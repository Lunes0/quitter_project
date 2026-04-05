import { useNavigate } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import Buttons from "../ui/buttons/Buttons";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onMenuToggle?: () => void;
}

function Navbar({ onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 mt-4 mb-4 px-4 items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <Buttons
          onClick={() => navigate("/")}
          primary={true}
          size="lg"
          rounded={true}
        >
          {t("home.home")}
        </Buttons>
      </div>
      <SearchBar />
    </div>
  );
}

export default Navbar;
