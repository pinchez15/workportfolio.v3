-- Add featured field to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create index for better performance on featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;