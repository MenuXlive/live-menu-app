-- SUPABASE CLEAN SETUP SCRIPT
-- Run this in the SQL Editor to fix missing columns and permission issues.

-- 1. Add Missing Columns to 'menu_items' table
DO $$
BEGIN
    -- Tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_best_seller') THEN
        ALTER TABLE menu_items ADD COLUMN is_best_seller BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_chef_special') THEN
        ALTER TABLE menu_items ADD COLUMN is_chef_special BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_new') THEN
        ALTER TABLE menu_items ADD COLUMN is_new BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_veg') THEN
        ALTER TABLE menu_items ADD COLUMN is_veg BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_spicy') THEN
        ALTER TABLE menu_items ADD COLUMN is_spicy BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_premium') THEN
        ALTER TABLE menu_items ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_top_shelf') THEN
        ALTER TABLE menu_items ADD COLUMN is_top_shelf BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Fix Row Level Security (RLS) Policies
-- This ensures you can SAVE edits.

-- Enable RLS just in case
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (clean slate)
DROP POLICY IF EXISTS "Enable read access for all users" ON menu_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON menu_items;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON menu_items;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON menu_items;
DROP POLICY IF EXISTS "Public Read Access" ON menu_items;
DROP POLICY IF EXISTS "Admin Access" ON menu_items;

DROP POLICY IF EXISTS "Enable read access for all users" ON menu_categories;
DROP POLICY IF EXISTS "Admin Access" ON menu_categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON menu_sections;
DROP POLICY IF EXISTS "Admin Access" ON menu_sections;

-- Create New Simple Policies for menu_items
-- public read
CREATE POLICY "Public Read Access" ON menu_items
    FOR SELECT USING (true);

-- admin full access (insert/update/delete)
CREATE POLICY "Admin Access" ON menu_items
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create New Policies for menu_categories
CREATE POLICY "Public Read Access" ON menu_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin Access" ON menu_categories
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create New Policies for menu_sections
CREATE POLICY "Public Read Access" ON menu_sections
    FOR SELECT USING (true);

CREATE POLICY "Admin Access" ON menu_sections
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Success Message
SELECT 'Database schema and permissions updated successfully!' as status;
