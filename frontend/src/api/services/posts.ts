import api from "../api";

export const getPosts = async () => {
  const res = await api.get("/api/posts/");
  return res.data;
};

export const deletePost = async (id: number) => {
  return await api.delete(`/api/posts/${id}/`);
};

export const createPost = async (content: string) => {
  return await api.post("/api/posts/", { content });
};

export const updatePost = async (id: number, content: string) => {
  return await api.patch(`/api/posts/${id}/`, { content });
};
