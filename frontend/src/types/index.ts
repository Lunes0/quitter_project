export interface PostType {
  id: number;
  author_username: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}
