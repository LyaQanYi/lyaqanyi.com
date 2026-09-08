"use client";

import { useSyncExternalStore } from "react";

import { Icon } from "@/components/icon";
import {
  readThemeState,
  readThemeStateOnServer,
  setMode,
  subscribeTheme,
} from "@/lib/theme";

export interface ModeSwitcherCopy {
  /** Names the switch. Which end is on is carried by `aria-checked`. */
  label: string;
  /** The two positions, spelled out for the tooltip. */
  modeLight: string;
  modeDark: string;
}

/**
 * Sun on the left, moon on the right, and a slab of ink covering whichever one
 * is in force. Clicking anywhere on it slides the slab to the other end.
 *
 * The slab and the dimming of the idle icon hang off the `dark:` variant — that
 * is, off the `data-mode` attribute — and not off React state, even though the
 * click goes through React. The attribute is written by the boot script before
 * the first paint; `useSyncExternalStore` answers `null` for the whole of the
 * hydration render and only reads the controller once mounted. Driving the
 * visuals from that store would put the slab on the left in the HTML of a
 * dark-mode page and then slide it across a moment later, playing a transition
 * nobody asked for on every single load. Driven by CSS, the first paint is
 * already right, and the slab only moves when someone actually clicks.
 *
 * What React does own is `aria-checked`, the tooltip, and which end the next
 * click aims for — none of it visible, so the one frame spent at `null` costs
 * nothing.
 */
export function ModeSwitcher({ copy }: { copy: ModeSwitcherCopy }) {
  /* Subscribed rather than copied into local state. The mode lives outside
     React — in localStorage, on `<html>`, and in the OS appearance setting —
     and three separate things can move it without this component being told:
     the OS flipping between light and dark while nothing has been chosen yet,
     another tab writing a new preference, and the boot script's own handlers,
     which apply both of those before React has mounted anything. Mirroring the
     value into `useState` captured only the first read. */
  const state = useSyncExternalStore(
    subscribeTheme,
    readThemeState,
    readThemeStateOnServer,
  );
  const dark = state?.mode === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={copy.label}
      title={dark ? copy.modeDark : copy.modeLight}
      onClick={() => setMode(dark ? "light" : "dark")}
      className="relative inline-grid h-9 w-[4.5rem] grid-cols-2 items-center rounded-md border border-line bg-bg-alt transition-colors hover:bg-surface-hover"
    >
      {/* `inset-y-0` and `w-1/2` make the slab exactly one cell wide, so
          `translate-x-full` — a multiple of its own width — lands it exactly on
          the other. Positioned, and first in the tree, so both icon cells paint
          over it; they carry `relative` for that reason alone. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 bg-accent transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] dark:translate-x-full"
      />
      {/* The covered icon reverses out of the slab in the accent's own contrast
          colour; the exposed one drops back to `--fg-subtle`, which is audited
          against every page surface it can land on. */}
      <span className="relative flex items-center justify-center text-accent-contrast dark:text-fg-subtle">
        <Icon name="sun" size={16} />
      </span>
      <span className="relative flex items-center justify-center text-fg-subtle dark:text-accent-contrast">
        <Icon name="moon" size={16} />
      </span>
    </button>
  );
}
