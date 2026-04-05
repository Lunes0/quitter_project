import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageButton from "../ui/buttons/LanguageButton";
import ThemeButton from "../ui/buttons/ThemeButton";
import { useAuth } from "../../hooks/useAuth";
import Buttons from "../ui/buttons/Buttons";
import { getAvatarUrl } from "../../api/services/profileImg";

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
        <img
          src={getAvatarUrl(user.avatar, user.username)}
          alt={user.username}
          className="w-24 h-24 rounded-full"
        />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
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
