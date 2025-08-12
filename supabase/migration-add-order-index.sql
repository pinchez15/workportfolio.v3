-- Migration: Add order_index field to projects and links tables
-- Run this if you have an existing database that needs the order_index field

-- Add featured field to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add order_index to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add order_index to links table  
ALTER TABLE links ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Update existing records to have sequential order_index based on created_at
-- This ensures existing projects and links have a proper order
UPDATE projects 
SET order_index = subquery.row_num - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as row_num
  FROM projects
) AS subquery
WHERE projects.id = subquery.id;

UPDATE links
SET order_index = subquery.row_num - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as row_num
  FROM links
) AS subquery
WHERE links.id = subquery.id;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_order_index ON projects(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_links_order_index ON links(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(user_id, featured);
