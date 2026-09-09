"use client";

import { useSyncExternalStore } from "react";

import { Icon } from "@/components/icon";
import { fill } from "@/content/copy";
import {
  readThemeState,
  readThemeStateOnServer,
  setThemePreference,
  subscribeTheme,
  type ThemePreference,
} from "@/lib/theme";

import styles from "./mode-switcher.module.css";

export interface ModeSwitcherCopy {
  label: string;
  modeLight: string;
  modeDark: string;
  modeSystem: string;
  autoLabel: string;
  switchHint: string;
}

const nextPreference: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

/** CSS reads the boot script's preference before hydration, so the selected
 * half or full-width Auto label is correct from the first paint. */
export function ModeSwitcher({ copy }: { copy: ModeSwitcherCopy }) {
  const state = useSyncExternalStore(
    subscribeTheme,
    readThemeState,
    readThemeStateOnServer,
  );
  const preference = state?.preference ?? "system";
  const labels = {
    light: copy.modeLight,
    dark: copy.modeDark,
    system: copy.modeSystem,
  };
  const hint = fill(copy.switchHint, {
    current: labels[preference],
    next: labels[nextPreference[preference]],
  });

  return (
    <button
      type="button"
      aria-label={`${copy.label}，${hint}`}
      title={hint}
      onClick={() => setThemePreference(nextPreference[readThemeState()?.preference ?? "system"])}
      className={`relative inline-grid h-9 w-[4.5rem] grid-cols-2 items-center rounded-md border border-line bg-bg-alt transition-colors hover:bg-surface-hover ${styles.switcher}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 bg-accent ${styles.indicator}`}
      />
      <span aria-hidden="true" className={`relative flex items-center justify-center ${styles.icon} ${styles.sun}`}>
        <Icon name="sun" size={16} />
      </span>
      <span aria-hidden="true" className={`relative flex items-center justify-center ${styles.icon} ${styles.moon}`}>
        <Icon name="moon" size={16} />
      </span>
      <span aria-hidden="true" className={`absolute inset-0 flex items-center justify-center font-display text-base leading-none text-accent-contrast ${styles.autoLabel}`}>
        {copy.autoLabel}
      </span>
    </button>
  );
}
