import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/constants";
import type { UserProfileType } from "../types";
import { AuthContext } from "./AuthContextInstance";
import {
  fetchCurrentProfile,
  getCurrentUsername,
  removeCurrentUsername,
} from "../api/services/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated =
    Boolean(localStorage.getItem(ACCESS_TOKEN)) &&
    Boolean(getCurrentUsername());

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    removeCurrentUsername();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await fetchCurrentProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to refresh profile", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    localStorage.setItem("current_username", username);

    try {
      const profile = await fetchCurrentProfile();
      setUser(profile);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
