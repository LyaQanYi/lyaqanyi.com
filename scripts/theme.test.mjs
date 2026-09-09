import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";

import {
  MODE_ATTR,
  MODE_STORAGE_KEY,
  PREFERENCE_ATTR,
  readThemeState,
  setThemePreference,
  subscribeTheme,
  themeBootScript,
} from "../src/lib/theme.ts";

function createBrowser({ stored = null, dark = false, denyRead = false, denyWrite = false } = {}) {
  const attributes = new Map();
  const storage = new Map([[MODE_STORAGE_KEY, stored]]);
  const media = new EventTarget();
  media.matches = dark;
  const window = new EventTarget();
  window.matchMedia = () => media;
  window.localStorage = {
    getItem(key) {
      if (denyRead) throw new Error("Storage unavailable");
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      if (denyWrite) throw new Error("Storage unavailable");
      storage.set(key, value);
    },
  };
  let repairAttributes;
  class MutationObserver {
    constructor(callback) { repairAttributes = callback; }
    observe() {}
  }
  window.MutationObserver = MutationObserver;
  const document = {
    documentElement: {
      getAttribute: (key) => attributes.get(key) ?? null,
      setAttribute: (key, value) => attributes.set(key, value),
    },
  };
  runInNewContext(themeBootScript, { window, document, MutationObserver });

  return {
    window,
    storage,
    attributes,
    controller: window.__qanyiTheme,
    repairAttributes: () => repairAttributes(),
    changeSystem(value) {
      media.matches = value;
      media.dispatchEvent(new Event("change"));
    },
    changeStorage(value, key = MODE_STORAGE_KEY) {
      if (key === null) storage.clear();
      else storage.set(key, value);
      window.dispatchEvent(Object.assign(new Event("storage"), { key }));
    },
    expect(preference, mode) {
      assert.deepEqual({ ...window.__qanyiTheme.get() }, { preference, mode });
      assert.equal(attributes.get(MODE_ATTR), mode);
      assert.equal(attributes.get(PREFERENCE_ATTR), preference);
    },
  };
}

test("initial paint resolves Auto and preserves existing manual preferences", () => {
  for (const dark of [false, true]) {
    for (const stored of [null, "invalid", "system", "light", "dark"]) {
      const preference = stored === "light" || stored === "dark" ? stored : "system";
      createBrowser({ dark, stored }).expect(
        preference,
        preference === "system" ? (dark ? "dark" : "light") : preference,
      );
    }
  }
});

test("only Auto follows live system changes and its selection survives reload", () => {
  const browser = createBrowser();
  browser.changeSystem(true);
  browser.expect("system", "dark");
  browser.controller.setPreference("light");
  browser.changeSystem(false);
  browser.changeSystem(true);
  browser.expect("light", "light");
  browser.controller.setPreference("dark");
  browser.changeSystem(false);
  browser.expect("dark", "dark");
  browser.controller.setPreference("system");
  browser.expect("system", "light");
  assert.equal(browser.storage.get(MODE_STORAGE_KEY), "system");
  createBrowser({ stored: browser.storage.get(MODE_STORAGE_KEY), dark: true }).expect("system", "dark");
});

test("cross-tab preferences and storage clearing update both state and appearance", () => {
  const browser = createBrowser({ dark: true });
  browser.changeStorage("light");
  browser.expect("light", "light");
  browser.changeStorage("dark", "unrelated-key");
  browser.expect("light", "light");
  browser.changeStorage("system");
  browser.expect("system", "dark");
  browser.changeStorage("light");
  browser.changeStorage(null, null);
  browser.expect("system", "dark");
});

test("storage failures keep the in-memory choice through system changes", () => {
  for (const denyRead of [false, true]) {
    const browser = createBrowser({ stored: "system", denyRead, denyWrite: true });
    browser.controller.setPreference("light");
    browser.changeSystem(true);
    browser.expect("light", "light");
    browser.controller.setPreference("system");
    browser.expect("system", "dark");
    browser.changeSystem(false);
    browser.expect("system", "light");
  }
});

test("attribute repair preserves the Auto indicator through navigation", () => {
  const browser = createBrowser({ dark: true });
  browser.attributes.delete(MODE_ATTR);
  browser.attributes.delete(PREFERENCE_ATTR);
  browser.repairAttributes();
  browser.expect("system", "dark");
  // A media change can precede its event while navigation mutates attributes.
  browser.window.matchMedia().matches = false;
  browser.attributes.delete(PREFERENCE_ATTR);
  browser.repairAttributes();
  browser.expect("system", "light");
  browser.repairAttributes();
  browser.expect("system", "light");
});

test("React snapshots distinguish Auto from the same resolved manual mode", (context) => {
  const browser = createBrowser();
  globalThis.window = browser.window;
  let notifications = 0;
  const unsubscribe = subscribeTheme(() => { notifications++; });
  context.after(() => {
    unsubscribe();
    delete globalThis.window;
  });
  const auto = readThemeState();
  assert.equal(readThemeState(), auto);
  setThemePreference("light");
  const manual = readThemeState();
  assert.notEqual(manual, auto);
  assert.equal(manual.preference, "light");
  assert.equal(manual.mode, auto.mode);
  browser.changeSystem(true);
  assert.equal(readThemeState(), manual);
  browser.changeStorage("system");
  assert.deepEqual(readThemeState(), { preference: "system", mode: "dark" });
  assert.equal(notifications, 3);
});
