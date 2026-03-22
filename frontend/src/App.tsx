import { useSettings } from "./hooks/useSettings";
import { useTranslation } from "react-i18next";
import "./index.css";

function App() {
  const { toggleTheme, changeLanguage } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex gap-4">
        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          {t("toggle_theme")}
        </button>

        <div className="flex border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => changeLanguage("pt")}
            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            PT
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 border-l border-slate-300 dark:border-slate-700 transition"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
