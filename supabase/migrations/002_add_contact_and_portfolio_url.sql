-- Migration: Add contact_email, available_for_hire, and portfolio_url columns
-- Run this in your Supabase SQL editor

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS available_for_hire BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Update existing users to have portfolio_url
UPDATE users
SET portfolio_url = 'https://workportfolio.io/' || username
WHERE portfolio_url IS NULL;

-- Create index on portfolio_url for faster lookups (useful for admin views)
CREATE INDEX IF NOT EXISTS idx_users_portfolio_url ON users(portfolio_url);

-- Create index on available_for_hire for filtering
CREATE INDEX IF NOT EXISTS idx_users_available_for_hire ON users(available_for_hire);
