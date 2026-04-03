import { getUserProfile } from "./users";
import type { UserProfileType } from "../../types";

export const CURRENT_USERNAME = "current_username";

export const getCurrentUsername = (): string | null =>
  localStorage.getItem(CURRENT_USERNAME);

export const setCurrentUsername = (username: string): void => {
  localStorage.setItem(CURRENT_USERNAME, username);
};

export const removeCurrentUsername = (): void => {
  localStorage.removeItem(CURRENT_USERNAME);
};

export const fetchCurrentProfile =
  async (): Promise<UserProfileType | null> => {
    const username = getCurrentUsername();

    if (!username) {
      return null;
    }

    const profile = await getUserProfile(username);
    return profile;
  };
