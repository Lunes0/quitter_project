import i18n from "../i18n";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <h1 className="text-5xl font-black text-red-600 animate-pulse">
        {i18n.t("not_found.title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {i18n.t("not_found.message")}
      </p>
    </div>
  );
}

export default NotFound;
