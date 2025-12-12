-- Create enum for menu section types
CREATE TYPE public.menu_section_type AS ENUM ('snacks', 'food', 'beverages', 'sides');

-- Create menu_sections table
CREATE TABLE public.menu_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type menu_section_type NOT NULL UNIQUE,
  title TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_categories table
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.menu_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  half_price DECIMAL(10,2),
  full_price DECIMAL(10,2),
  sizes JSONB,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.menu_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public read access (menu is public)
CREATE POLICY "Menu sections are publicly readable" ON public.menu_sections
  FOR SELECT USING (true);

CREATE POLICY "Menu categories are publicly readable" ON public.menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Menu items are publicly readable" ON public.menu_items
  FOR SELECT USING (true);

-- For now, allow public writes (no auth in this app yet)
CREATE POLICY "Anyone can insert menu sections" ON public.menu_sections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update menu sections" ON public.menu_sections
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete menu sections" ON public.menu_sections
  FOR DELETE USING (true);

CREATE POLICY "Anyone can insert menu categories" ON public.menu_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update menu categories" ON public.menu_categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete menu categories" ON public.menu_categories
  FOR DELETE USING (true);

CREATE POLICY "Anyone can insert menu items" ON public.menu_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update menu items" ON public.menu_items
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete menu items" ON public.menu_items
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_menu_categories_section ON public.menu_categories(section_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_menu_sections_updated_at
  BEFORE UPDATE ON public.menu_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();