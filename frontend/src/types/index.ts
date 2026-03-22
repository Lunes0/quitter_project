export interface UserProfile {
  avatar: string | null;
  display_name: string;
  bio: string;
  following_count: number;
  followers_count: number;
}

export interface Post {
  id: number;
  author_username: string;
  content: string;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}
