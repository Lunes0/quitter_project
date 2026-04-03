import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/constants";
import type { UserProfileType } from "../types";
import {
  fetchCurrentProfile,
  getCurrentUsername,
  removeCurrentUsername,
} from "../api/services/auth";

export interface AuthContextType {
  user: UserProfileType | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfileType | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, access: string, refresh: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated =
    Boolean(localStorage.getItem(ACCESS_TOKEN)) &&
    Boolean(getCurrentUsername());

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    removeCurrentUsername();
    setUser(null);
    navigate("/login");
  };

  const refreshProfile = async () => {
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
  };

  const login = async (username: string, access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    localStorage.setItem("current_username", username);

    try {
      const profile = await fetchCurrentProfile();
      setUser(profile);
    } catch (error) {
      console.error("Login profile load failed", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchCurrentProfile();
        setUser(profile);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

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
