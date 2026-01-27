# 🚀 Démarrage Rapide - Configuration Base de Données

## 📌 Situation actuelle

✅ PostgreSQL 18.0 installé
✅ Code corrigé (plus d'erreurs window/status/page/key)
❌ Base de données non connectée

## 🎯 Ce que tu dois faire maintenant

### 1️⃣ Créer le fichier `.env.local`

Dans `C:\SEC_CAM_CONG`, crée un fichier `.env.local` et mets :

```env
DATABASE_URL="postgresql://TON_USER:TON_PASSWORD@localhost:5432/TA_BASE"
JWT_SECRET="ktA2IcdTl6sCaW9XnpLYB1qrEhugUNZKx37MmiSFoP4DfObHGzyVR08eJw5Qj"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changez-moi-aussi"
CLOUDINARY_CLOUD_NAME="dfhuu4drw"
CLOUDINARY_API_KEY="543716329812553"
CLOUDINARY_API_SECRET="zm9pecmSVAgwW5yJz4VqXkatfxg"
```

**Remplace :**
- `TON_USER` : probablement `postgres` ou `ThinkPad`
- `TON_PASSWORD` : ton mot de passe PostgreSQL
- `TA_BASE` : le nom de ta base (ex: `sen_cam_cong_local`)

### 2️⃣ Copier vers .env et migrer

```bash
cp .env.local .env
npx prisma migrate dev
```

### 3️⃣ Lancer l'application

```bash
npm run dev
```

## 📚 Fichiers créés pour toi

- ✅ `SETUP_LOCAL_DB.md` - Guide détaillé pour configurer PostgreSQL local
- ✅ `MIGRATION_SUPABASE.md` - Guide complet pour migrer vers Supabase
- ✅ `.env.local.example` - Template de configuration
- ✅ `.gitignore` - Mis à jour pour protéger tes secrets

## 🔄 Quand tu voudras migrer vers Supabase

1. Lis `MIGRATION_SUPABASE.md`
2. Crée un projet sur supabase.com
3. Crée `.env.supabase` avec l'URL Supabase
4. Lance `npm run db:migrate:supabase`

## ❓ Besoin d'aide ?

- Problème de connexion ? → Consulte `SETUP_LOCAL_DB.md` section Dépannage
- Prêt pour Supabase ? → Ouvre `MIGRATION_SUPABASE.md`
- Erreurs Prisma ? → Vérifie que DATABASE_URL est correct dans `.env.local`

Bonne chance ! 🎉
