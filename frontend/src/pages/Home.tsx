import { useState, useEffect } from "react";
import { createPost, deletePost, getPosts } from "../api/services/posts";
import Post from "../components/posts/Post";
import type { PostType } from "../types";

function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Erro ao buscar posts", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createPost(content);
      if (res.status === 201) {
        setContent("");
        loadPosts();
      }
    } catch (err) {
      alert("Erro ao criar post: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      const res = await deletePost(id);
      if (res.status === 204) {
        loadPosts();
      }
    } catch (err) {
      alert("Erro ao deletar post: " + err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            className="focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-3 py-2 w-full mb-4 dark:text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md w-full disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              onUpdate={loadPosts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
