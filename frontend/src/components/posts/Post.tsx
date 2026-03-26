import { useState } from "react";
import { updatePost } from "../../api/services/posts";
import type { PostType } from "../../types";

interface PostProps {
  post: PostType;
  onDelete: (id: number) => Promise<void>;
  onUpdate: () => Promise<void>;
}

function Post({ post, onDelete, onUpdate }: PostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

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
      alert("Erro ao editar o post" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-2">
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
        <h3 className="font-bold text-slate-900 dark:text-white">
          {post.author_username}
        </h3>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full p-2 border rounded-md dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-slate-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading || newContent === post.content}
              className="px-4 py-1 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-700 dark:text-slate-300 my-2">
          {post.content}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-slate-800 text-xs text-slate-500">
        <div>
          <span>{formattedDate}</span>
          {post.updated_at && (
            <span className="italic ml-2">
              • Updated: {new Date(post.updated_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => onDelete(post.id)}
            className="text-red-500 hover:underline font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
