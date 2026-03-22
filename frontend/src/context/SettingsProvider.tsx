import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsContext, type Theme } from "./SettingsContext";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light",
  );
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SettingsContext.Provider
      value={{ theme, toggleTheme, language: i18n.language, changeLanguage }}
    >
      <div className="min-h-screen transition-colors duration-500 ease-in-out bg-white dark:bg-slate-950">
        {children}
      </div>
    </SettingsContext.Provider>
  );
};
