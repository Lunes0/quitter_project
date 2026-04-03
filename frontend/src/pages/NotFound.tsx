import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <h1 className="text-5xl font-black text-red-600 animate-pulse">
        {t("not_found.title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {t("not_found.message")}
      </p>
    </div>
  );
}

export default NotFound;
