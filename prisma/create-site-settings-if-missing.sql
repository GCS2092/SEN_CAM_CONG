-- Créer la table site_settings si elle n'existe pas (erreur P2021 "table does not exist")
-- À exécuter dans Supabase → SQL Editor si npx prisma db push n'est pas possible.

CREATE TABLE IF NOT EXISTS public.site_settings (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  type        TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT
);

CREATE INDEX IF NOT EXISTS site_settings_key_idx ON public.site_settings (key);

-- Optionnel : insérer des clés par défaut si la table est vide
-- INSERT INTO public.site_settings (id, key, value, type, "updatedAt")
-- SELECT gen_random_uuid()::text, 'hero_background_image', NULL, 'image', NOW()
-- WHERE NOT EXISTS (SELECT 1 FROM public.site_settings LIMIT 1);
