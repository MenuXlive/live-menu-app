-- Migration to add tag columns to menu_items table
-- Run this in your Supabase SQL Editor

ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_chef_special BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_spicy BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_top_shelf BOOLEAN DEFAULT false;
