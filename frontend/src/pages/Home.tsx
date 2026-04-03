import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPost, deletePost, getFeedPosts } from "../api/services/posts";
import Post from "../components/layout/Post";
import type { PostType } from "../types";
import Button from "../components/ui/buttons/Buttons";
import Inputs from "../components/ui/Inputs";

function Home() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
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
      alert(err);
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
      alert(err);
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{t("home.create_post")}</h2>
        <form onSubmit={handleCreatePost}>
          <Inputs
            value={content}
            placeholder={t("home.post_placeholder")}
            onChange={(e) => setContent(e.target.value)}
            required
            textarea={true}
          />
          <Button primary={true} size="lg" type="submit" disabled={loading}>
            {loading ? t("home.posting") : t("home.create_post")}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">{t("home.feed")}</h2>
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
