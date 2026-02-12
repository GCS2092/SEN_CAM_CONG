-- =============================================================================
-- Sync Supabase Auth → public.users (id = auth.users.id)
-- À exécuter une fois dans Supabase → SQL Editor
-- =============================================================================
-- Quand un utilisateur s'inscrit via Supabase Auth, une ligne est créée
-- automatiquement dans public.users avec le MÊME id (UUID).
-- Plus de désynchronisation entre auth.users et public.users.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    'USER',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Supprimer le trigger s'il existait déjà (éviter les doublons)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_auth_user();

-- Note: Les utilisateurs déjà présents dans auth.users ne sont pas rétroactivement
-- insérés. Ils seront créés/linkés au premier login par l'app (getCurrentUserFromSupabaseToken).
