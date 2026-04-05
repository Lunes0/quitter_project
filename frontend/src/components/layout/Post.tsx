import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updatePost } from "../../api/services/posts";
import { getAvatarUrl } from "../../api/services/profileImg";
import type { PostType } from "../../types";
import Comments from "./Comments";
import LikeButton from "../ui/buttons/LikeButton";
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
        <img
          src={getAvatarUrl(post.author_avatar, post.author_username)}
          alt={post.author_username}
          className="w-14 h-14 rounded-full"
        />
        <div className="flex flex-col leading-tight">
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            {post.author_display_name || post.author_username}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            @{post.author_username}
          </span>
        </div>
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
        <p className="text-slate-700 dark:text-slate-300 my-2 wrap-break-word whitespace-pre-wrap">
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
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span>{formattedDate}</span>
          {post.is_edited && post.updated_at && (
            <span className="italic ml-2">
              • {t("common.edited")} •{" "}
              {new Date(post.updated_at).toLocaleString()}
            </span>
          )}
        </p>

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
