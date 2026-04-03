import api from "../api";

export const toggleLike = async (id: number, type: "posts" | "comments") => {
  return await api.post(`/api/${type}/${id}/like/`);
};
