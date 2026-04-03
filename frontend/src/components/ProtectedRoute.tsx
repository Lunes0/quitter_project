import React, { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

import { REFRESH_TOKEN, ACCESS_TOKEN } from "../api/constants";
import api from "../api/api";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode<{ exp?: number }>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-indigo-600 font-bold animate-pulse">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
