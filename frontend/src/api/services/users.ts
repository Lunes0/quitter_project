import type { UserProfileType } from "../../types";
import api from "../api";

export const getUserProfile = async (
  username: string,
): Promise<UserProfileType> => {
  const res = await api.get(`/api/profile/${username}/`);
  return res.data;
};

export const toggleFollow = async (userId: number) => {
  return await api.post(`/api/user/${userId}/follow/`);
};
