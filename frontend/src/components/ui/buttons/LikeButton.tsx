import { useState } from "react";
import { toggleLike } from "../../../api/services/interactions";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

interface LikeButtonProps {
  targetId: number;
  targetType: "posts" | "comments";
  initialLikes: number;
  initialIsLiked: boolean;
}

function LikeButton({
  targetId,
  targetType,
  initialLikes,
  initialIsLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialLikes);

  const handleLike = async () => {
    const previousLiked = liked;
    const previousCount = count;

    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await toggleLike(targetId, targetType);
      const serverCount = response.data?.likes_count;
      const didLike = response.status === 201;

      if (typeof serverCount === "number") {
        setCount(serverCount);
      }
      setLiked(didLike);
    } catch (err) {
      console.error("Error:", err);
      setLiked(previousLiked);
      setCount(previousCount);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 group cursor-pointer"
    >
      {liked ? (
        <HeartSolid className="w-5 h-5 text-red-500 transition-transform group-active:scale-125" />
      ) : (
        <HeartOutline className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
      )}
      <span className={`text-sm ${liked ? "text-red-500" : "text-slate-500"}`}>
        {count}
      </span>
    </button>
  );
}

export default LikeButton;
