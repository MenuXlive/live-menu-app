-- Create archived_menus table to store previous menu versions
CREATE TABLE public.archived_menus (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    archived_at timestamp with time zone NOT NULL DEFAULT now(),
    archived_by uuid REFERENCES auth.users(id),
    menu_data jsonb NOT NULL,
    notes text
);

-- Enable RLS
ALTER TABLE public.archived_menus ENABLE ROW LEVEL SECURITY;

-- Policies: admins can manage, public can read
CREATE POLICY "Archived menus are publicly readable"
ON public.archived_menus
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert archived menus"
ON public.archived_menus
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete archived menus"
ON public.archived_menus
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));