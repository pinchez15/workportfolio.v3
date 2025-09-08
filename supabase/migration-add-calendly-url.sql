-- Add calendly_url column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS calendly_url TEXT;

-- Add calendly_url column to portfolios table if it doesn't exist  
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS calendly_url TEXT;
