-- Ajouter la colonne supabaseAuthId à la table users si elle n'existe pas
-- Erreur : « la colonne supabaseAuthId n'existe pas » (Code 42703)
-- À exécuter dans Supabase → SQL Editor (même projet que celui utilisé par Vercel)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'supabaseAuthId'
  ) THEN
    ALTER TABLE public.users ADD COLUMN "supabaseAuthId" TEXT UNIQUE;
    CREATE INDEX IF NOT EXISTS users_supabaseAuthId_idx ON public.users ("supabaseAuthId");
  END IF;
END $$;
