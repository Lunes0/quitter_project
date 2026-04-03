export interface Likeable {
  id: number;
  likes_count: number;
  is_liked: boolean;
}

export interface PostType extends Likeable {
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

export interface UserSummaryType {
  username: string;
  display_name: string;
}

export interface UserProfileType {
  id: number;
  username: string;
  display_name: string;
  bio?: string;
  avatar?: string;
  followers_count: number;
  following_count: number;
  followers: UserSummaryType[];
  following: UserSummaryType[];
  posts: PostType[];
  is_following: boolean;
  profile: {
    display_name: string;
    bio?: string;
    avatar?: string;
  };
}

export interface CommentType extends Likeable {
  post_id: number;
  content: string;
  author_username: string;
  author_avatar?: string;
  created_at: string;
  updated_at?: string;
}
