import { createContext } from "react";

export type Theme = "light" | "dark";

export interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: string;
  changeLanguage: (lng: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
