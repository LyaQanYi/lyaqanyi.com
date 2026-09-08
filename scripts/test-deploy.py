"""Exercise deployment/rollback failures without a Docker daemon or server."""
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
OLD = "sha256:" + "a" * 64
NEW = "sha256:" + "b" * 64
TARGET = "ghcr.io/lyaqanyi/lyaqanyi.com@sha256:" + "c" * 64

DOCKER = r'''
import json, os, sys
from pathlib import Path
state_file = Path(os.environ["DOCKER_TEST_STATE"])
state = json.loads(state_file.read_text())
args = sys.argv[1:]
image = os.environ.get("SITE_IMAGE", "")
state["calls"].append({"args": args, "image": image})
code, output = 0, ""
if args[0] == "compose":
    command = args[7]
    if command == "ps":
        output = "website-id" if state["running"] else ""
    elif command == "pull":
        code = 1 if state.get("pull_fail") else 0
    elif command == "up":
        state["running"] = image
        code = 1 if image in state.get("unhealthy", []) else 0
    elif command not in ("config", "logs"):
        raise AssertionError(args)
elif args[0] == "inspect":
    output = state["running"] if state["running"].startswith("sha256:") else state["new_id"]
elif args[:2] == ["image", "inspect"]:
    code = 0
else:
    raise AssertionError(args)
state_file.write_text(json.dumps(state))
if output: print(output)
sys.exit(code)
'''


class DeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        self.bin = self.directory / "bin"
        self.bin.mkdir()
        for name in ["deploy.sh", "compose.yaml"]:
            shutil.copy(ROOT / "deploy" / name, self.directory / name)
        self.env_file = self.directory / ".env"
        self.env_file.write_text(f"# Keep this setting\nSITE_PORT=3210\nSITE_IMAGE={OLD}\n")
        self.state_file = self.directory / "state.json"
        self.state_file.write_text(json.dumps({"running": OLD, "new_id": NEW, "calls": []}))
        self.make_executable("docker", DOCKER)
        # Match Linux flock's inherited-descriptor behavior on macOS as well.
        self.make_executable("flock", "import fcntl, sys\ntry: fcntl.flock(int(sys.argv[-1]), fcntl.LOCK_EX | fcntl.LOCK_NB)\nexcept BlockingIOError: sys.exit(1)\n")

    def make_executable(self, name, code):
        file = self.bin / name
        file.write_text(f"#!{sys.executable}\n" + code)
        file.chmod(0o755)

    def state(self):
        return json.loads(self.state_file.read_text())

    def configure(self, **values):
        state = self.state()
        state.update(values)
        self.state_file.write_text(json.dumps(state))

    def run_deploy(self, target=TARGET):
        return subprocess.run(["bash", str(self.directory / "deploy.sh"), target],
            env={**os.environ, "PATH": f"{self.bin}:{os.environ['PATH']}",
                 "DOCKER_TEST_STATE": str(self.state_file)},
            capture_output=True, text=True, timeout=10)

    def test_success_preserves_settings_and_records_previous_image(self):
        result = self.run_deploy()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn(f"SITE_IMAGE={TARGET}", self.env_file.read_text())
        self.assertIn("SITE_PORT=3210", self.env_file.read_text())
        self.assertIn("# Keep this setting", self.env_file.read_text())
        self.assertEqual((self.directory / ".previous-image").read_text().strip(), OLD)

    def test_failed_pull_does_not_touch_running_container_or_config(self):
        before = self.env_file.read_bytes()
        self.configure(pull_fail=True)
        self.assertNotEqual(self.run_deploy().returncode, 0)
        self.assertEqual(self.state()["running"], OLD)
        self.assertEqual(before, self.env_file.read_bytes())
        self.assertFalse(any("up" in call["args"] for call in self.state()["calls"]))

    def test_unhealthy_release_restores_actual_previous_image(self):
        self.configure(unhealthy=[TARGET])
        result = self.run_deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("restored and is healthy", result.stderr)
        self.assertEqual(self.state()["running"], OLD)
        self.assertIn(f"SITE_IMAGE={OLD}", self.env_file.read_text())

    def test_rollback_failure_is_reported_as_failure(self):
        self.configure(unhealthy=[TARGET, OLD])
        result = self.run_deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("rollback both failed", result.stderr)

    def test_initial_failure_never_claims_rollback(self):
        self.configure(running="", unhealthy=[TARGET])
        result = self.run_deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("no previous version", result.stderr)
        self.assertFalse((self.directory / ".previous-image").exists())

    def test_manual_rollback_uses_retained_image_without_registry(self):
        (self.directory / ".previous-image").write_text(OLD)
        self.configure(running=NEW)
        result = self.run_deploy("--rollback")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.state()["running"], OLD)
        self.assertEqual((self.directory / ".previous-image").read_text().strip(), NEW)
        self.assertFalse(any("pull" in call["args"] for call in self.state()["calls"]))

    def test_redeploy_same_image_preserves_existing_rollback(self):
        (self.directory / ".previous-image").write_text(OLD)
        self.configure(running=NEW)
        self.assertEqual(self.run_deploy().returncode, 0)
        self.assertEqual((self.directory / ".previous-image").read_text().strip(), OLD)

    def test_rejects_mutable_tags_and_shell_input_before_docker(self):
        for target in ["ghcr.io/lyaqanyi/lyaqanyi.com:main", TARGET + ";touch injected", "--rollback"]:
            with self.subTest(target=target):
                self.assertNotEqual(self.run_deploy(target).returncode, 0)
                self.assertEqual(self.state()["calls"], [])

    def test_parallel_deployment_is_rejected(self):
        with (self.directory / ".deploy.lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = self.run_deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Another deployment", result.stderr)
        self.assertEqual(self.state()["calls"], [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
