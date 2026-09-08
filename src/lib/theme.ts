/* The two modes, and the whole of the choice the visitor is offered. Not
   exported: the switcher hard-codes both ends rather than mapping over a list,
   and the array exists because the boot script is generated from it, so the
   accepted values stay defined in exactly one place. */
const modes = ["light", "dark"] as const;
export type ModeName = (typeof modes)[number];

export const MODE_STORAGE_KEY = "qanyi-mode";

/** Attribute on `<html>`; CSS keys the dark tokens off it. */
export const MODE_ATTR = "data-mode";

export interface ThemeState {
  /** The mode in force, which is also the value on the attribute. */
  mode: ModeName;
}

/**
 * Browser-side controller installed by the boot script.
 * Components call these instead of touching localStorage or the DOM directly,
 * so resolution rules live in exactly one place.
 */
export interface ThemeController {
  get(): ThemeState;
  setMode(mode: ModeName): ThemeState;
}

declare global {
  interface Window {
    __qanyiTheme?: ThemeController;
  }
}

function isMode(value: unknown): value is ModeName {
  return typeof value === "string" && (modes as readonly string[]).includes(value);
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
 * stops, so it cannot loop. Only `data-mode` is watched — deliberately not
 * `style`, which Next writes on every route transition and which this script
 * does not touch at all.
 *
 * The two listeners after it keep the preference honest from outside the page:
 * `matchMedia` so that a visitor who has never chosen follows the OS moving
 * between light and dark, and `storage` so a change made in another tab is
 * reflected here instead of leaving two tabs disagreeing about what is on
 * screen. A `storage` event with a null key means storage was cleared
 * wholesale. Neither event fires in the tab that made the change, so there is
 * nothing to guard against.
 *
 * Following the OS is a starting point rather than a third mode. The switch
 * offers light and dark only; picking either writes the choice, and a written
 * choice then outranks the media listener — which is why both listeners simply
 * re-run `preferred` instead of checking whether they are allowed to. Nothing
 * unwrites it again: there is no reset, because with two modes and no "auto" to
 * return to, resetting would only mean "go back to guessing", and a visitor who
 * wants the OS in charge can say so with the OS.
 *
 * `setMode` applies the value it was handed instead of reading storage back
 * after writing it. In a browser that refuses the write — private browsing, a
 * full quota — the read returns the OS preference, and the page would visibly
 * undo the click a moment after it happened. Applying the request keeps the
 * screen agreeing with the visitor for the session and loses only the
 * persistence.
 */
export const themeBootScript = `(function () {
  var MODE_KEY = ${JSON.stringify(MODE_STORAGE_KEY)};
  var MODE_ATTR = ${JSON.stringify(MODE_ATTR)};
  var MODES = ${JSON.stringify(modes)};

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
    if (MODES.indexOf(stored) !== -1) return stored;
    return media.matches ? "dark" : "light";
  }

  function apply(mode) {
    root.setAttribute(MODE_ATTR, mode);
    return { mode: mode };
  }

  var state = apply(preferred());

  function assertAttribute() {
    if (root.getAttribute(MODE_ATTR) !== state.mode) apply(state.mode);
  }
  if (window.MutationObserver) {
    new MutationObserver(assertAttribute).observe(root, {
      attributes: true,
      attributeFilter: [MODE_ATTR]
    });
  }

  var onChange = function () {
    state = apply(preferred());
  };
  if (media.addEventListener) media.addEventListener("change", onChange);
  else if (media.addListener) media.addListener(onChange);

  window.addEventListener("storage", function (event) {
    if (event.key !== MODE_KEY && event.key !== null) return;
    state = apply(preferred());
  });

  window.__qanyiTheme = {
    get: function () { return state; },
    setMode: function (next) {
      if (MODES.indexOf(next) === -1) return state;
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
  };
  if (lastSnapshot !== null && lastSnapshot.mode === normalized.mode) {
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

export function setMode(mode: ModeName): void {
  const instance = controller();
  if (!instance) return;
  /* Normalized before the announcement, so a listener that re-reads during
     `emit` sees the new value rather than the old one. */
  normalize(instance.setMode(mode));
  emit();
}
