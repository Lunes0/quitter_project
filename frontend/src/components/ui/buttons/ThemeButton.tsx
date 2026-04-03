import { useState } from "react";
import { SunIcon as SunOutline } from "@heroicons/react/24/outline";
import { MoonIcon as MoonOutline } from "@heroicons/react/24/outline";

import { useSettings } from "../../../hooks/useSettings";

function ThemeButton() {
  const [darkMode, setDarkMode] = useState(false);
  const { toggleTheme } = useSettings();

  const handleToggle = () => {
    toggleTheme();
    setDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 active:scale-95 cursor-pointer w-fit"
    >
      {darkMode ? (
        <MoonOutline className="h-5 w-5" />
      ) : (
        <SunOutline className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeButton;
