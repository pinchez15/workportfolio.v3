-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID (not UUID format)
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  title TEXT,
  avatar_url TEXT,
  bio TEXT,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  short_description TEXT,
  long_description TEXT,
  start_date DATE,
  end_date DATE,
  url TEXT,
  image_path TEXT,
  image_paths TEXT[],
  tags TEXT[],
  skills TEXT[],
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  show_preview BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- e.g. john_ops
  bio TEXT,
  calendly_url TEXT,
  show_links BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow anyone to view user profiles (needed for public portfolios)
CREATE POLICY "Anyone can view user profiles" ON users
  FOR SELECT USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Allow service role to insert users (for webhooks)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR 
    auth.role() = 'service_role'
  );

-- RLS Policies for projects table
-- Users can view their own projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid()::text = user_id);

-- Anyone can view public projects (for portfolios)
CREATE POLICY "Anyone can view public projects" ON projects
  FOR SELECT USING (visible = true);

-- Users can manage their own projects
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid()::text = user_id);

-- RLS Policies for links table
-- Users can view their own links
CREATE POLICY "Users can view their own links" ON links
  FOR SELECT USING (auth.uid()::text = user_id);

-- Anyone can view public links (for portfolios)
CREATE POLICY "Anyone can view public links" ON links
  FOR SELECT USING (visible = true);

-- Users can manage their own links
CREATE POLICY "Users can manage their own links" ON links
  FOR ALL USING (auth.uid()::text = user_id);

-- RLS Policies for portfolios table
-- Users can view their own portfolios
CREATE POLICY "Users can view their own portfolios" ON portfolios
  FOR SELECT USING (auth.uid()::text = user_id);

-- Anyone can view portfolios by slug (public portfolios)
CREATE POLICY "Anyone can view portfolios by slug" ON portfolios
  FOR SELECT USING (true);

-- Users can manage their own portfolios
CREATE POLICY "Users can manage their own portfolios" ON portfolios
  FOR ALL USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_visible ON links(visible);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user_uploads', 'user_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user_uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user_uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user_uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to uploaded files (for portfolio viewing)
CREATE POLICY "Public can view uploaded files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user_uploads'); 