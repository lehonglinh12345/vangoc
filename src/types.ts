export type Language = 'vi' | 'en' | 'ja';

export interface Episode {
  id: string;
  title: string;
  duration?: string;
  videoUrl?: string;
  thumbnail?: string;
  isPlaceholder?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  mainImage: string;
  gallery?: string[];
  color?: string;
  tags: string[];
  episodes: Episode[];
  views?: number;
  likes?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  position?: 'top' | 'center' | 'bottom';
  facebook?: string;
}

export interface CommentReaction {
  like: number;
  heart: number;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  is_edited?: boolean;
  parent_id?: string | null;
  reply_to_name?: string;
  likes: number;
  user_reacted?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}
