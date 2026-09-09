/** A preference can follow the system; the rendered mode is always resolved. */
const modes = ["light", "dark"] as const;
export type ModeName = (typeof modes)[number];
const preferences = [...modes, "system"] as const;
export type ThemePreference = (typeof preferences)[number];

export const MODE_STORAGE_KEY = "qanyi-mode";

/** Attribute on `<html>`; CSS keys the dark tokens off it. */
export const MODE_ATTR = "data-mode";
export const PREFERENCE_ATTR = "data-mode-preference";

export interface ThemeState {
  /** The mode in force, which is also the value on the attribute. */
  mode: ModeName;
  preference: ThemePreference;
}

/**
 * Browser-side controller installed by the boot script.
 * Components call these instead of touching localStorage or the DOM directly,
 * so resolution rules live in exactly one place.
 */
export interface ThemeController {
  get(): ThemeState;
  setPreference(preference: ThemePreference): ThemeState;
}

declare global {
  interface Window {
    __qanyiTheme?: ThemeController;
  }
}

function isMode(value: unknown): value is ModeName {
  return typeof value === "string" && (modes as readonly string[]).includes(value);
}

function isPreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && (preferences as readonly string[]).includes(value);
}

/**
 * Inline boot script. Executes as the first thing inside `<body>`, ahead of any
 * themed markup, so the page never paints in a mode the visitor did not choose;
 * it also installs the controller the switcher drives.
 *
 * Emitted by the root layout as a plain `<script>` element rather than through
 * `next/script`, which queues its source for hydration instead of letting the
 * parser run it — see the comment there.
 *
 * Constants are interpolated rather than duplicated, keeping this file the
 * single source of truth for the storage key and allowed values.
 *
 * The reasoning behind each part lives out here rather than inside the string.
 * Everything between the backticks is served verbatim on every response, so a
 * paragraph of explanation in there is a paragraph downloaded by every visitor
 * — the comments below were a third of the script's bytes, for text only a
 * maintainer ever reads. Only the two-word marker on the empty `catch` blocks
 * stays inline, because that one has to be read where it appears.
 *
 * On the MutationObserver: nothing in React owns `data-mode`. The root layout
 * renders `<html>` and re-renders it during client navigations, and a browser
 * session exercising a navigation that re-rendered it found the attribute gone
 * afterwards, until a full reload ran this script again. What removed it was
 * never established — React's own reconciliation only touches attributes that
 * were in its props at some point, and this one never was — so the guard watches
 * the attribute and re-asserts it, whoever cleared it.
 *
 * The stakes are lower than when the palette also hung off a `data-style`
 * attribute: the light tokens live on the unscoped `:root`, so a missing
 * attribute degrades to light mode instead of to a page where every `var()`
 * fails to resolve. Still worth correcting — a visitor who asked for dark and
 * got light is precisely what this script exists to prevent.
 *
 * A MutationObserver callback runs as a microtask, before the next paint, so the
 * correction is never visible. Re-writing re-triggers the observer, which is why
 * the value is compared first: the second pass finds it already correct and
 * stops, so it cannot loop. Only the mode and preference attributes are watched,
 * leaving `style`, which Next writes on every route transition, alone.
 *
 * The two listeners after it keep the preference honest from outside the page:
 * `matchMedia` so that a visitor choosing Auto follows the OS moving
 * between light and dark, and `storage` so a change made in another tab is
 * reflected here instead of leaving two tabs disagreeing about what is on
 * screen. A `storage` event with a null key means storage was cleared
 * wholesale, which returns the preference to system.
 *
 * The preference stays separate from the resolved mode. System changes resolve
 * the current in-memory preference; only storage events re-read persistence.
 * This also preserves a manual selection when storage is unavailable.
 *
 * `setPreference` applies the value it was handed instead of reading storage back
 * after writing it. In a browser that refuses the write — private browsing, a
 * full quota — the read returns the OS preference, and the page would visibly
 * undo the click a moment after it happened. Applying the request keeps the
 * screen agreeing with the visitor for the session and loses only the
 * persistence.
 */
export const themeBootScript = `(function () {
  var MODE_KEY = ${JSON.stringify(MODE_STORAGE_KEY)};
  var MODE_ATTR = ${JSON.stringify(MODE_ATTR)};
  var PREFERENCE_ATTR = ${JSON.stringify(PREFERENCE_ATTR)};
  var PREFERENCES = ${JSON.stringify(preferences)};

  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function preferred() {
    var stored = read(MODE_KEY);
    return PREFERENCES.indexOf(stored) !== -1 ? stored : "system";
  }

  function apply(preference) {
    var mode = preference === "system" ? (media.matches ? "dark" : "light") : preference;
    root.setAttribute(MODE_ATTR, mode);
    root.setAttribute(PREFERENCE_ATTR, preference);
    return { mode: mode, preference: preference };
  }

  var state = apply(preferred());

  function assertAttribute() {
    if (root.getAttribute(MODE_ATTR) !== state.mode ||
        root.getAttribute(PREFERENCE_ATTR) !== state.preference) state = apply(state.preference);
  }
  if (window.MutationObserver) {
    new MutationObserver(assertAttribute).observe(root, {
      attributes: true,
      attributeFilter: [MODE_ATTR, PREFERENCE_ATTR]
    });
  }

  var onChange = function () {
    state = apply(state.preference);
  };
  if (media.addEventListener) media.addEventListener("change", onChange);
  else if (media.addListener) media.addListener(onChange);

  window.addEventListener("storage", function (event) {
    if (event.key !== MODE_KEY && event.key !== null) return;
    state = apply(preferred());
  });

  window.__qanyiTheme = {
    get: function () { return state; },
    setPreference: function (next) {
      if (PREFERENCES.indexOf(next) === -1) return state;
      write(MODE_KEY, next);
      state = apply(next);
      return state;
    }
  };
})();`;

/* The last object handed out by `normalize`, kept so that an unchanged state
   keeps handing out the same reference. `useSyncExternalStore` compares
   snapshots with `Object.is` and re-renders — warns, then loops — if a getter
   returns a fresh object for a state that has not moved, and normalizing
   builds a new one on every call no matter how little changed. */
let lastSnapshot: ThemeState | null = null;

function normalize(state: ThemeState): ThemeState {
  /* Falling back to light rather than to a declared default: the light tokens
     live on the unscoped `:root`, so light is what an unrecognised value
     already looks like, and agreeing with the CSS beats inventing a mode. The
     boot script only ever produces the two, so this is a guard, not a path. */
  const normalized: ThemeState = {
    mode: isMode(state.mode) ? state.mode : "light",
    preference: isPreference(state.preference) ? state.preference : "system",
  };
  if (lastSnapshot !== null && lastSnapshot.mode === normalized.mode &&
      lastSnapshot.preference === normalized.preference) {
    return lastSnapshot;
  }
  lastSnapshot = normalized;
  return normalized;
}

function controller(): ThemeController | null {
  if (typeof window === "undefined") return null;
  return window.__qanyiTheme ?? null;
}

/**
 * Components registered through `subscribeTheme`.
 *
 * The boot script updates its own state when the OS appearance flips or
 * another tab writes to localStorage, but it was written before anything was
 * listening, so it tells nobody. Everything that changes the theme now goes
 * through this module — the setters below, and the two browser events
 * `subscribeTheme` watches — which is what makes one registry enough.
 */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * Subscribes to theme changes, for `useSyncExternalStore`.
 *
 * Both listeners re-read the boot script's state rather than carrying a value
 * of their own: it has already applied the change by the time these fire, since
 * it registered its own handlers first, back at the top of `<body>`. Reading it
 * back keeps one copy of the resolution rules instead of two that could
 * disagree.
 *
 * A no-op change is fine to announce. `emit` only asks components to look
 * again, and what they see goes through `normalize`, which returns the previous
 * object when the values have not moved — so React finds nothing to re-render.
 * That matters for the appearance listener in particular, which fires on every
 * OS change even when a stored choice makes the answer the same as before.
 */
export function subscribeTheme(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onAppearance = () => emit();
  const onStorage = (event: StorageEvent) => {
    /* A null key means storage was cleared wholesale, which resets the stored
       preference along with everything else. */
    if (event.key === MODE_STORAGE_KEY || event.key === null) emit();
  };

  media.addEventListener("change", onAppearance);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    media.removeEventListener("change", onAppearance);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current state, or `null` on the server / if the boot script was blocked. */
export function readThemeState(): ThemeState | null {
  const instance = controller();
  return instance ? normalize(instance.get()) : null;
}

/** Server snapshot for `useSyncExternalStore`: there is no DOM and no stored
 *  preference to read, and the boot script owns the first paint, so `null` is
 *  the honest answer — and the one the client render starts from too. */
export function readThemeStateOnServer(): null {
  return null;
}

export function setThemePreference(preference: ThemePreference): void {
  const instance = controller();
  if (!instance) return;
  /* Normalized before the announcement, so a listener that re-reads during
     `emit` sees the new value rather than the old one. */
  normalize(instance.setPreference(preference));
  emit();
}
