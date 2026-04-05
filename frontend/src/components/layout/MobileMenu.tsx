import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageButton from "../ui/buttons/LanguageButton";
import ThemeButton from "../ui/buttons/ThemeButton";
import SearchBar from "../ui/SearchBar";
import { getAvatarUrl } from "../../api/services/profileImg";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 z-50 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <button
            onClick={onClose}
            className="self-end mb-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>

          <div
            onClick={() => {
              navigate(`/profile/${user.username}`);
              onClose();
            }}
            className="cursor-pointer flex items-center gap-3 mb-6"
          >
            <img
              src={getAvatarUrl(user.avatar, user.username)}
              alt={user.username}
              className="w-24 h-24 rounded-full"
            />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              {user.display_name || user.username}
            </h3>
          </div>

          <nav className="flex flex-col gap-4 flex-1">
            <div className="mb-4">
              <SearchBar mobile />
            </div>
            <div className="flex gap-10 mb-8">
              <LanguageButton />
              <ThemeButton />
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full px-3 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 cursor-pointer text-left"
            >
              {t("auth.logout")}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
