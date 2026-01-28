# Guide de Migration PostgreSQL → Supabase

Ce guide vous aide à migrer votre base de données PostgreSQL locale vers Supabase.

## 📋 Prérequis

- [ ] Compte Supabase créé (https://supabase.com)
- [ ] Base de données locale PostgreSQL fonctionnelle
- [ ] Prisma CLI installé (`npm install -g prisma` ou `npx prisma`)

---

## 🎯 Étape 1 : Créer un projet Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Configurez votre projet :
   - **Name** : `sen-cam-cong` (ou votre nom)
   - **Database Password** : Générez un mot de passe fort (SAUVEGARDEZ-LE !)
   - **Region** : Choisissez la plus proche (ex: `us-east-1`)
4. Cliquez sur **"Create new project"**
5. Attendez ~2 minutes que le projet soit prêt

---

## 🔑 Étape 2 : Récupérer la connexion Supabase

### Dans le dashboard Supabase :

1. Allez dans **Settings** (icône ⚙️) → **Database**
2. Trouvez la section **Connection string** → **URI**
3. Sélectionnez le mode **"Session"** (recommandé) ou **"Transaction"**
4. Copiez l'URL qui ressemble à :

```


5. Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé

---

## 📝 Étape 3 : Configurer les environnements

### 3.1 Créer `.env.local` (pour développement local)

```bash
# PostgreSQL LOCAL
DATABASE_URL="postgresql://votre_user:votre_password@localhost:5432/votre_db_name"

# JWT & Auth
JWT_SECRET="ktA2IcdTl6sCaW9XnpLYB1qrEhugUNZKx37MmiSFoP4DfObHGzyVR08eJw5Qj"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changez-moi-aussi"

# Cloudinary
CLOUDINARY_CLOUD_NAME="dfhuu4drw"
CLOUDINARY_API_KEY="543716329812553"
CLOUDINARY_API_SECRET="zm9pecmSVAgwW5yJz4VqXkatfxg"
```

### 3.2 Créer `.env.supabase` (pour production)

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# JWT & Auth (générez de nouvelles clés pour la production !)
JWT_SECRET="NOUVELLE_CLE_SECRETE_PRODUCTION"
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="NOUVELLE_CLE_NEXTAUTH_PRODUCTION"

# Cloudinary
CLOUDINARY_CLOUD_NAME="dfhuu4drw"
CLOUDINARY_API_KEY="543716329812553"
CLOUDINARY_API_SECRET="zm9pecmSVAgwW5yJz4VqXkatfxg"

# Supabase API Keys (optionnel, pour Row Level Security)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key"
SUPABASE_SERVICE_ROLE_KEY="votre_service_role_key"
```

### 3.3 Mettre à jour `.gitignore`

Assurez-vous que ces fichiers sont ignorés :

```
.env
.env.local
.env.supabase
.env*.local
```

---

## 🗄️ Étape 4 : Migrer le schéma vers Supabase

### Option A : Migration automatique avec Prisma (RECOMMANDÉ)

```bash
# 1. Pointer vers Supabase
export DATABASE_URL="postgresql://postgres.rorgwqzzesaabvfwpwzh:Stemk2141abc@aws-1-eu-west-3.pooler.supabase.com:6543/postgres"

# 2. Appliquer les migrations
npx prisma migrate deploy

# 3. Générer le client Prisma
npx prisma generate
```

### Option B : Migration manuelle

1. Exporter le schéma local :
```bash
pg_dump -U postgres -s votre_db_locale > schema.sql
```

2. Importer dans Supabase :
   - Ouvrez **SQL Editor** dans le dashboard Supabase
   - Collez le contenu de `schema.sql`
   - Exécutez la requête

---

## 📊 Étape 5 : Migrer les données

### Option A : Avec pg_dump/pg_restore (recommandé pour grandes bases)

```bash
# 1. Exporter les données
pg_dump -U postgres -d urbanbeauty -F c -b -v -f backup.dump

# 2. Restaurer vers Supabase
pg_restore -d "postgresql://postgres.rorgwqzzesaabvfwpwzh:Stemk2141abc@aws-1-eu-west-3.pooler.supabase.com:6543/postgres" -v backup.dump
```

### Option B : Avec Prisma Studio (recommandé pour petites bases)

```bash
# 1. Ouvrir Prisma Studio en local
DATABASE_URL="postgresql://localhost:5432/votre_db_locale" npx prisma studio

# 2. Ouvrir un second terminal pour Supabase
DATABASE_URL="postgresql://postgres.xxxx:..." npx prisma studio

# 3. Copier manuellement les données entre les deux interfaces
```

### Option C : Script de migration personnalisé

Créez un script `migrate-data.ts` :

```typescript
import { PrismaClient } from '@prisma/client';

const localDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://localhost:5432/votre_db_locale'
    }
  }
});

const supabaseDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL
    }
  }
});

async function migrate() {
  // Migrer les utilisateurs
  const users = await localDb.user.findMany();
  for (const user of users) {
    await supabaseDb.user.create({ data: user });
  }
  
  // Migrer les événements
  const events = await localDb.event.findMany();
  for (const event of events) {
    await supabaseDb.event.create({ data: event });
  }
  
  // ... etc pour les autres tables
  
  console.log('Migration terminée !');
}

migrate()
  .catch(console.error)
  .finally(async () => {
    await localDb.$disconnect();
    await supabaseDb.$disconnect();
  });
```

Exécutez :
```bash
SUPABASE_DATABASE_URL="postgresql://..." npx ts-node migrate-data.ts
```

---

## ✅ Étape 6 : Tester la connexion Supabase

```bash
# 1. Mettre à jour .env avec l'URL Supabase
# 2. Vérifier la connexion
npx prisma db pull

# 3. Tester avec Prisma Studio
npx prisma studio

# 4. Lancer votre application
npm run dev
```

---

## 🔐 Étape 7 : Sécurité Supabase (Optionnel mais recommandé)

### Activer Row Level Security (RLS)

Dans le SQL Editor de Supabase :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Performance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
-- ... etc pour toutes vos tables

-- Exemple : Politique pour la table Event
CREATE POLICY "Les événements publics sont visibles par tous"
ON "Event" FOR SELECT
USING (status = 'PUBLISHED' OR status = 'UPCOMING');

CREATE POLICY "Les admins peuvent tout faire"
ON "Event" FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE "User".id = auth.uid()
    AND "User".role = 'ADMIN'
  )
);
```

---

## 🚀 Étape 8 : Déploiement

### Vercel (recommandé)

1. Connectez votre repo GitHub à Vercel
2. Dans **Settings** → **Environment Variables**, ajoutez :
   - `DATABASE_URL` : Votre URL Supabase
   - `JWT_SECRET` : Votre clé JWT de production
   - `NEXTAUTH_SECRET` : Votre clé NextAuth de production
   - Toutes les autres variables d'environnement

3. Déployez : `vercel --prod`

---

## 📚 Commandes utiles

```bash
# Switcher entre local et Supabase
# Local :
export DATABASE_URL="postgresql://localhost:5432/votre_db"

# Supabase :
export DATABASE_URL="postgresql://postgres.xxxx:..."

# Réinitialiser la base de données
npx prisma migrate reset

# Voir le status des migrations
npx prisma migrate status

# Créer une nouvelle migration
npx prisma migrate dev --name description_changement

# Appliquer les migrations en production
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio
npx prisma studio
```

---

## ⚠️ Checklist avant de passer en production

- [ ] Schéma migré et testé sur Supabase
- [ ] Données migrées et vérifiées
- [ ] Variables d'environnement configurées
- [ ] Row Level Security configuré (si nécessaire)
- [ ] Backups automatiques activés dans Supabase
- [ ] Tests effectués sur l'environnement de staging
- [ ] Clés JWT et secrets régénérés pour la production
- [ ] Documentation mise à jour

---

## 🆘 Dépannage

### Erreur : "Can't reach database server"
- Vérifiez que l'URL Supabase est correcte
- Vérifiez que le mot de passe ne contient pas de caractères spéciaux non-encodés
- Utilisez le mode "Session" plutôt que "Transaction" dans l'URL

### Erreur : "SSL connection required"
Ajoutez `?sslmode=require` à la fin de votre DATABASE_URL :
```
postgresql://...postgres?sslmode=require
```

### Erreur : "Too many connections"
- Utilisez le connection pooler Supabase (port 6543 au lieu de 5432)
- Réduisez `connection_limit` dans Prisma :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Les migrations ne s'appliquent pas
```bash
# Réinitialiser l'état des migrations
npx prisma migrate resolve --applied "20231118000000_migration_name"
```

---

## 📞 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Prisma avec Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Conseils

1. **Testez d'abord sur un projet Supabase de test** avant de migrer en production
2. **Gardez un backup** de votre base locale avant la migration
3. **Utilisez des migrations Prisma** plutôt que des modifications manuelles du schéma
4. **Activez les backups automatiques** dans Supabase (Settings → Database → Backup)
5. **Surveillez l'utilisation** : Supabase gratuit offre 500MB de base de données

Bon courage avec la migration ! 🚀