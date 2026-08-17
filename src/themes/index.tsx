import React, { createContext, useContext } from "react";
import type { ThemeSpec } from "./types";
import { galaxy } from "./galaxy";
import { blueprint } from "./blueprint";
import { maps } from "./maps";

export const THEMES = { galaxy, blueprint, maps } as const;
export type ThemeName = keyof typeof THEMES;

const ThemeContext = createContext<ThemeSpec>(galaxy);

export const ThemeProvider: React.FC<{
  theme: ThemeSpec;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

// All shared components and scenes read the active skin through this hook.
export const useTheme = (): ThemeSpec => useContext(ThemeContext);
