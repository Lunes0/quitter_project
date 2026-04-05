import React, { useEffect, useCallback, type JSX } from "react"; // Adicionado useCallback
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

import { REFRESH_TOKEN, ACCESS_TOKEN } from "../api/constants";
import api from "../api/api";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const { t } = useTranslation();

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refresh,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
    }
  }, []);

  const auth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      return false;
    }
    const decoded = jwtDecode<{ exp?: number }>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      await refreshToken();
      return;
    }
    return true;
  }, [refreshToken]);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const result = await auth();
        if (isMounted) {
          if (result === true) setIsAuthorized(true);
          else if (result === false) setIsAuthorized(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setIsAuthorized(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [auth]);

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
