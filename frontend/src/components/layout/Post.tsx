import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../../api/services/posts";
import type { PostType } from "../../types";
import Comments from "./Comments";
import LikeButton from "../ui/buttons/LikeButton";
import { useTranslation } from "react-i18next";
import IconButton from "../ui/buttons/IconButtons";
import Inputs from "../ui/Inputs";
import Buttons from "../ui/buttons/Buttons";

interface PostProps {
  post: PostType;
  onDelete: (id: number) => Promise<void>;
  onUpdate: () => Promise<void>;
}

function Post({ post, onDelete, onUpdate }: PostProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const currentUsername = localStorage.getItem("current_username");
  const { t } = useTranslation();

  const formattedDate = new Date(post.created_at).toLocaleString();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updatePost(post.id, newContent);
      if (res.status === 200) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all">
      <div
        className="flex w-fit items-center gap-3 mb-2 cursor-pointer"
        onClick={() => navigate(`/profile/${post.author_username}`)}
      >
        {post.author_avatar ? (
          <img
            src={post.author_avatar}
            alt={post.author_username}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            {"👤"}
          </span>
        )}
        <h3
          onClick={() => navigate(`/profile/${post.author_username}`)}
          className="font-bold text-slate-900 dark:text-white"
        >
          {post.author_username}
        </h3>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <Inputs
            textarea={true}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Buttons
              onClick={() => setIsEditing(false)}
              primary={false}
              rounded={true}
              size="lg"
            >
              {t("common.cancel")}
            </Buttons>
            <Buttons
              onClick={handleUpdate}
              disabled={loading || newContent === post.content}
              primary={true}
              rounded={true}
              size="lg"
            >
              {loading ? t("common.saving") : t("common.save")}
            </Buttons>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 dark:text-slate-300 my-2">
          {post.content}
        </p>
      )}
      <div className="flex items-center justify-between mt-3">
        <LikeButton
          targetId={post.id}
          targetType="posts"
          initialLikes={post.likes_count}
          initialIsLiked={post.is_liked}
        />
        <IconButton
          onClick={() => setShowComments((prev) => !prev)}
          icon="comment"
        >
          <span>{commentsCount}</span>
        </IconButton>
      </div>

      {showComments && (
        <Comments
          postId={post.id}
          onCommentAdded={() => setCommentsCount((current) => current + 1)}
        />
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-slate-800 text-xs text-slate-500">
        <div>
          <span>{formattedDate}</span>
          {post.updated_at && post.updated_at !== post.created_at && (
            <span className="italic ml-2 text-sm text-slate-500">
              • {t("common.edited")} •{" "}
              {new Date(post.updated_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {currentUsername === post.author_username && (
            <>
              {!isEditing && (
                <IconButton onClick={() => setIsEditing(true)} icon="edit" />
              )}

              <IconButton onClick={() => onDelete(post.id)} icon="delete" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
