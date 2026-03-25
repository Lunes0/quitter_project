import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import { useSettings } from "./hooks/useSettings";
import "./index.css";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
