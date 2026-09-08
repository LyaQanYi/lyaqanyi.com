#!/usr/bin/env bash
# Install next to the Compose file and .env on the Debian server.
set -Eeuo pipefail
umask 077

fail() { printf '%s\n' "$*" >&2; exit 1; }
deploy_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
cd -- "$deploy_dir"
[[ $# == 1 ]] || fail 'Usage: bash deploy.sh <ghcr.io/owner/image@sha256:digest> | --rollback'
[[ -f .env ]] || fail 'Create .env next to deploy.sh first.'
compose_file=''
for filename in compose.yaml compose.yml docker-compose.yaml docker-compose.yml; do
  if [[ -f $filename ]]; then
    [[ -z $compose_file ]] || fail 'Multiple Compose files found; keep only the file used by this website.'
    compose_file="$deploy_dir/$filename"
  fi
done
[[ -n $compose_file ]] || fail 'Install the website Compose file next to deploy.sh first.'
command -v docker >/dev/null || fail 'Docker is required.'
command -v flock >/dev/null || fail 'flock is required (Debian package: util-linux).'
exec 9>.deploy.lock
flock -n 9 || fail 'Another deployment is running; retry after it finishes.'

target=$1
if [[ $target == --rollback ]]; then
  [[ -s .previous-image ]] || fail 'No previous image has been recorded.'
  target=$(cat .previous-image)
fi
# Never accept shell expressions, mutable tags, or arbitrary registries.
if [[ ! $target =~ ^ghcr\.io/[a-z0-9][a-z0-9._/-]*@sha256:[a-f0-9]{64}$ &&
      ! $target =~ ^sha256:[a-f0-9]{64}$ ]]; then
  fail 'Use an immutable ghcr.io image digest, or --rollback.'
fi

compose_for() {
  local image=$1
  shift
  SITE_IMAGE="$image" docker compose --env-file "$deploy_dir/.env" \
    --project-name lyaqanyi-web --file "$compose_file" "$@"
}

record_image() {
  local image=$1 env_tmp
  env_tmp=$(mktemp "$deploy_dir/.env.XXXXXX")
  # Keep port and any user comments; do not source .env as shell code.
  awk '!/^[[:space:]]*(export[[:space:]]+)?SITE_IMAGE[[:space:]]*=/' .env > "$env_tmp"
  printf '\nSITE_IMAGE=%s\n' "$image" >> "$env_tmp"
  mv -f -- "$env_tmp" .env
}

compose_for "$target" config --quiet
current_container=$(compose_for "$target" ps --quiet website)
previous_image=''
if [[ -n $current_container ]]; then
  # Keep the actual local image ID, even when the old container used a tag.
  previous_image=$(docker inspect --format '{{.Image}}' "$current_container")
fi

if [[ $target == ghcr.io/* ]]; then
  # Pull first: a registry/network failure leaves the running version untouched.
  compose_for "$target" pull website
else
  docker image inspect "$target" >/dev/null
fi

if compose_for "$target" up --detach --no-build --pull never --wait --wait-timeout 120 website; then
  record_image "$target"
  new_container=$(compose_for "$target" ps --quiet website)
  new_image=$(docker inspect --format '{{.Image}}' "$new_container")
  if [[ -n $previous_image && $previous_image != "$new_image" ]]; then
    printf '%s\n' "$previous_image" > .previous-image
  fi
  printf 'Deployment healthy: %s\n' "$target"
  exit 0
fi

printf 'Deployment failed; recent website logs follow.\n' >&2
compose_for "$target" logs --tail 60 website >&2 || true
if [[ -n $previous_image ]]; then
  if compose_for "$previous_image" up --detach --no-build --pull never --wait --wait-timeout 120 website; then
    record_image "$previous_image"
    fail 'Deployment failed. The previous image has been restored and is healthy.'
  fi
  fail 'Deployment and rollback both failed. Check the website container in 1Panel.'
fi
fail 'Initial deployment failed; there is no previous version to restore. Check the container logs.'
