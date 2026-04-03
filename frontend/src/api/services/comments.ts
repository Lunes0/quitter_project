import api from "../api";
import type { CommentType } from "../../types";

export const getComments = async (postId: number): Promise<CommentType[]> => {
  const res = await api.get(`/api/posts/${postId}/comments/`);
  return res.data;
};

export const createComment = async (postId: number, content: string) => {
  return api.post(`/api/posts/${postId}/comments/`, { content });
};

export const updateComment = async (commentId: number, content: string) => {
  return api.patch(`/api/comments/${commentId}/`, { content });
};

export const deleteComment = async (commentId: number) => {
  return api.delete(`/api/comments/${commentId}/`);
};
