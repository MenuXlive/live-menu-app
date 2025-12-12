-- Add initial admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('5c65f53d-c2f1-46c0-a22e-b27097cc5a35', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;