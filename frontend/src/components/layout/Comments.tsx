import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LikeButton from "../ui/buttons/LikeButton";
import type { CommentType } from "../../types";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../api/services/comments";
import { getAvatarUrl } from "../../api/services/profileImg";
import IconButton from "../ui/buttons/IconButtons";
import Buttons from "../ui/buttons/Buttons";
import Inputs from "../ui/Inputs";

interface CommentsProps {
  postId: number;
  onCommentAdded?: () => void;
}

function Comments({ postId, onCommentAdded }: CommentsProps) {
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const { t } = useTranslation();

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
    setCurrentUsername(localStorage.getItem("current_username"));
  }, [loadComments]);

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      alert("Erro ao deletar comentário: " + err);
    }
  };

  const handleStartEdit = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (commentId: number) => {
    try {
      await updateComment(commentId, editingContent);
      setEditingCommentId(null);
      setEditingContent("");
      await loadComments();
    } catch (err) {
      alert("Erro ao atualizar comentário: " + err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await createComment(postId, content.trim());
      setContent("");
      await loadComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/80 dark:bg-slate-900/60 rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3">{t("comments.comments")}</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <Inputs
          textarea={true}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("comments.placeholder")}
          required
        />
        <Buttons
          type="submit"
          disabled={loading}
          primary={true}
          rounded={true}
          size="lg"
        >
          {loading ? t("home.posting") : t("comments.post_button")}
        </Buttons>
      </form>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">{t("comments.no_comments")}</p>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUsername === comment.author_username;
            const isEditing = editingCommentId === comment.id;

            const authorUsername = comment.author_username;
            const authorAvatar = comment.author_avatar;
            const authorDisplayName = comment.author_display_name;

            return (
              <div
                key={comment.id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => navigate(`/profile/${authorUsername}`)}
                    >
                      <img
                        src={getAvatarUrl(authorAvatar, authorUsername)}
                        alt={authorUsername}
                        className="w-12 h-12 rounded-full mr-2"
                      />
                      <div className="flex flex-col leading-tight mr-5">
                        <p className="text-md font-semibold text-slate-900 dark:text-white">
                          {authorDisplayName || authorUsername}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          @{authorUsername}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.created_at).toLocaleString()}
                      {comment.is_edited && comment.updated_at && (
                        <span className="ml-2 italic">
                          • {t("common.edited")} •{" "}
                          {new Date(comment.updated_at).toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LikeButton
                      targetId={comment.id}
                      targetType="comments"
                      initialLikes={comment.likes_count}
                      initialIsLiked={comment.is_liked}
                    />
                    {isOwner && !isEditing && (
                      <>
                        <IconButton
                          onClick={() => handleStartEdit(comment)}
                          icon="edit"
                        />
                        <IconButton
                          onClick={() => handleDelete(comment.id)}
                          icon="delete"
                        />
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Inputs
                      textarea={true}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Buttons
                        onClick={() => handleSaveEdit(comment.id)}
                        primary={true}
                        rounded={true}
                        size="sm"
                      >
                        {t("common.save")}
                      </Buttons>
                      <Buttons
                        onClick={handleCancelEdit}
                        primary={false}
                        rounded={true}
                        size="sm"
                      >
                        {t("common.cancel")}
                      </Buttons>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-200 wrap-break-word whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Comments;
