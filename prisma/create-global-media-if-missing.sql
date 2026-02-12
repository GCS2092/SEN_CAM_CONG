-- Créer la table global_media (et l'enum MediaType) si absents
-- Erreur : "The table (not available) does not exist" pour prisma.globalMedia.create()
-- À exécuter dans le même projet que votre DATABASE_URL locale (Supabase SQL Editor ou psql)

-- Enum MediaType (si pas déjà créé par une autre table)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediaType') THEN
    CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'IMAGE', 'AUDIO');
  END IF;
END $$;

-- Table global_media
CREATE TABLE IF NOT EXISTS public.global_media (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type         "MediaType" NOT NULL,
  url          TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  title        TEXT,
  description  TEXT,
  category     TEXT,
  "order"      INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS global_media_type_idx ON public.global_media (type);
CREATE INDEX IF NOT EXISTS global_media_category_idx ON public.global_media (category);
CREATE INDEX IF NOT EXISTS global_media_active_idx ON public.global_media (active);
CREATE INDEX IF NOT EXISTS global_media_order_idx ON public.global_media ("order");
