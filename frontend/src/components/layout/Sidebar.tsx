import { useNavigate } from "react-router-dom";
import LanguageButton from "../ui/buttons/LanguageButton";
import ThemeButton from "../ui/buttons/ThemeButton";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import Buttons from "../ui/buttons/Buttons";

function Sidebar() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <aside className="w-64 p-4 border-r border-gray-300 dark:border-gray-700">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("common.loading")}
        </p>
      </aside>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <aside className="hidden lg:flex sticky top-16 h-fit w-64 flex-col gap-6 p-4 border-r border-gray-300 dark:border-gray-700 transition-colors duration-300">
      <div
        onClick={() => navigate(`/profile/${user.username}`)}
        className="flex items-center gap-3 mb-2 cursor-pointer"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <span className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            {"👤"}
          </span>
        )}
        <h3 className="font-bold text-slate-900 dark:text-white">
          {user.display_name || user.username}
        </h3>
      </div>
      <Buttons
        onClick={() => navigate(`/profile/${user.username}`)}
        primary={true}
        rounded={false}
        size="lg"
      >
        {t("home.profile")}
      </Buttons>
      <nav className="gap-4 flex flex-col">
        <div className="flex gap-10">
          <LanguageButton />
          <ThemeButton />
        </div>
        <button
          onClick={logout}
          className="w-fit px-3 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 cursor-pointer"
        >
          {t("auth.logout")}
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
