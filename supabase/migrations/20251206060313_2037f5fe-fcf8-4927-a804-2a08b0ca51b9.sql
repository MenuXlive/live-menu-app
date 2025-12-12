-- Drop the current public SELECT policy
DROP POLICY IF EXISTS "Archived menus are publicly readable" ON archived_menus;

-- Create admin-only SELECT policy
CREATE POLICY "Admins can view archived menus" 
ON archived_menus 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));