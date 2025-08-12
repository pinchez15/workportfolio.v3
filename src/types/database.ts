export interface User {
  id: string; // Clerk user ID
  username: string;
  name?: string;
  title?: string;
  avatar_url?: string;
  bio?: string;
  calendly_url?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  company?: string;
  short_description?: string;
  long_description?: string;
  start_date?: string;
  end_date?: string;
  url?: string;
  image_path: string | null;
  image_paths?: string[];
  tags?: string[];
  skills?: string[];
  visible: boolean;
  order_index?: number;
  created_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  show_preview?: boolean;
  visible: boolean;
  order_index?: number;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  bio: string;
  calendly_url?: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at'>;
        Update: Partial<Omit<User, 'created_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      links: {
        Row: Link;
        Insert: Omit<Link, 'id' | 'created_at'>;
        Update: Partial<Omit<Link, 'id' | 'created_at'>>;
      };
    };
  };
} 