import { useSettings } from "../../../hooks/useSettings";

function LanguageButton() {
  const { changeLanguage } = useSettings();

  return (
    <>
      <div className="inline-block border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden w-fit">
        <button
          onClick={() => changeLanguage("pt")}
          className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition duration-300 cursor-pointer"
        >
          PT
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 border-l border-slate-300 dark:border-slate-700 transition duration-300 cursor-pointer"
        >
          EN
        </button>
      </div>
    </>
  );
}

export default LanguageButton;
