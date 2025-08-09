-- Migration: Update products to use description + how_to_use and create admins table
-- Date: 2025-08-09

-- 1) Products table changes
-- Remove short_description and add how_to_use
DO $$
BEGIN
  -- Drop short_description if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'short_description'
  ) THEN
    ALTER TABLE products DROP COLUMN short_description;
  END IF;

  -- Add how_to_use if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'how_to_use'
  ) THEN
    ALTER TABLE products ADD COLUMN how_to_use TEXT;
  END IF;
END $$;

-- 2) Admins table for site settings
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  email TEXT UNIQUE,
  whatsapp_number TEXT,
  business_name TEXT,
  business_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can manage admins rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admins' AND policyname = 'Authenticated users can manage admins'
  ) THEN
    CREATE POLICY "Authenticated users can manage admins" ON admins
      FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
