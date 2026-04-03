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
  const [language, setLanguage] = useState<string>(i18n.language || "pt");

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

  useEffect(() => {
    const onChange = (lng: string) => setLanguage(lng);
    i18n.on("languageChanged", onChange);

    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, [i18n]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <SettingsContext.Provider
      value={{ theme, toggleTheme, language, changeLanguage }}
    >
      <div className="min-h-screen transition-colors duration-500 ease-in-out bg-white dark:bg-slate-950">
        {children}
      </div>
    </SettingsContext.Provider>
  );
};
