# 🗄️ Configuration de la Base de Données Locale PostgreSQL

Ce guide vous aide à configurer votre base de données PostgreSQL locale pour le développement.

## ✅ Vérification de l'installation

Vous avez déjà PostgreSQL 18.0 installé ! Vérifions :

```bash
psql --version
# Devrait afficher : psql (PostgreSQL) 18.0
```

---

## 🔧 Configuration de la Base de Données Locale

### Étape 1 : Identifier vos identifiants PostgreSQL

Vous devez connaître :
- **Utilisateur** : probablement `postgres` ou `ThinkPad` (votre nom d'utilisateur Windows)
- **Mot de passe** : celui que vous avez défini lors de l'installation de PostgreSQL
- **Port** : par défaut `5432`

### Étape 2 : Créer la base de données (si pas déjà fait)

Ouvrez **PowerShell** ou **CMD** et exécutez :

```bash
# Option 1 : Avec l'utilisateur postgres
psql -U postgres -c "CREATE DATABASE sen_cam_cong_local;"

# Option 2 : Avec votre utilisateur Windows
psql -U ThinkPad -c "CREATE DATABASE sen_cam_cong_local;"

# Vérifier que la base existe
psql -U postgres -l
```

Si vous avez déjà une base de données, notez son nom.

---

## 📝 Configuration du fichier .env.local

### Créer le fichier `.env.local`

Dans le dossier racine du projet `C:\SEC_CAM_CONG`, créez un fichier `.env.local` :

```bash
# Base de données PostgreSQL LOCALE
DATABASE_URL="postgresql://UTILISATEUR:MOT_DE_PASSE@localhost:5432/NOM_DE_LA_BASE"

# Exemples :
# DATABASE_URL="postgresql://postgres:monmotdepasse@localhost:5432/sen_cam_cong_local"
# DATABASE_URL="postgresql://ThinkPad:password123@localhost:5432/ma_base"

# JWT Secret
JWT_SECRET="ktA2IcdTl6sCaW9XnpLYB1qrEhugUNZKx37MmiSFoP4DfObHGzyVR08eJw5Qj"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changez-moi-aussi"

# Cloudinary
CLOUDINARY_CLOUD_NAME="dfhuu4drw"
CLOUDINARY_API_KEY="543716329812553"
CLOUDINARY_API_SECRET="zm9pecmSVAgwW5yJz4VqXkatfxg"
```

### ⚠️ Format de l'URL de connexion

```
postgresql://UTILISATEUR:MOT_DE_PASSE@localhost:5432/NOM_BASE
           ↑            ↑              ↑         ↑       ↑
      Utilisateur   Password        Host      Port   Database
```

**Exemples concrets :**

1. **Avec utilisateur postgres :**
```
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/sen_cam_cong_local"
```

2. **Avec votre utilisateur Windows :**
```
DATABASE_URL="postgresql://ThinkPad:password@localhost:5432/sen_cam_cong_local"
```

3. **Sans mot de passe (si configuré en trust) :**
```
DATABASE_URL="postgresql://postgres@localhost:5432/sen_cam_cong_local"
```

---

## 🚀 Initialiser la base de données

Une fois `.env.local` créé et configuré :

```bash
# 1. Copier .env.local vers .env pour que Prisma l'utilise
cp .env.local .env

# 2. Appliquer les migrations Prisma
npx prisma migrate dev

# 3. (Optionnel) Générer des données de test
npx prisma db seed

# 4. Vérifier avec Prisma Studio
npx prisma studio
```

---

## 🔍 Dépannage

### Problème : "password authentication failed"

**Solution 1 : Vérifier le mot de passe**
```bash
# Essayez de vous connecter manuellement
psql -U postgres -d sen_cam_cong_local
# Si ça demande un mot de passe, entrez-le
```

**Solution 2 : Réinitialiser le mot de passe**

1. Ouvrez le fichier `pg_hba.conf` (souvent dans `C:\Program Files\PostgreSQL\18\data\`)
2. Trouvez la ligne :
```
host    all             all             127.0.0.1/32            scram-sha-256
```
3. Changez `scram-sha-256` en `trust` temporairement
4. Redémarrez PostgreSQL :
```bash
# Dans Services Windows, redémarrez "postgresql-x64-18"
```
5. Changez le mot de passe :
```bash
psql -U postgres
ALTER USER postgres PASSWORD 'nouveau_mot_de_passe';
\q
```
6. Remettez `scram-sha-256` dans `pg_hba.conf`
7. Redémarrez PostgreSQL

### Problème : "database does not exist"

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE sen_cam_cong_local;"
```

### Problème : "port 5432 already in use"

PostgreSQL utilise déjà ce port. Soit :
- Utilisez la base existante
- Ou changez le port dans DATABASE_URL : `localhost:5433`

### Problème : "psql: command not found"

Ajoutez PostgreSQL au PATH :
1. Ouvrez **Variables d'environnement système**
2. Ajoutez `C:\Program Files\PostgreSQL\18\bin` au PATH
3. Redémarrez votre terminal

---

## 📊 Vérifier que tout fonctionne

```bash
# 1. Vérifier la connexion
npx prisma db pull

# 2. Voir les tables
psql -U postgres -d sen_cam_cong_local -c "\dt"

# 3. Compter les enregistrements
psql -U postgres -d sen_cam_cong_local -c "SELECT COUNT(*) FROM \"User\";"

# 4. Lancer l'app
npm run dev
```

---

## 🎯 Commandes rapides

```bash
# Ouvrir une session psql
psql -U postgres -d sen_cam_cong_local

# Lister les bases de données
\l

# Lister les tables
\dt

# Voir la structure d'une table
\d "User"

# Exécuter une requête
SELECT * FROM "Event" LIMIT 5;

# Quitter
\q
```

---

## 📦 Structure actuelle de votre projet

Votre projet a déjà :
- ✅ Schema Prisma configuré (`prisma/schema.prisma`)
- ✅ Migrations existantes (`prisma/migrations/`)
- ✅ Fallback data (l'app fonctionne même sans DB)

Il vous suffit de :
1. Créer `.env.local` avec la bonne URL
2. Exécuter `npx prisma migrate dev`
3. Lancer `npm run dev`

---

## 🔄 Passer entre Local et Supabase

Une fois Supabase configuré, utilisez :

```bash
# Développement local
npm run dev:local

# Développement avec Supabase
npm run dev:supabase

# Migrations locales
npm run db:migrate:local

# Migrations Supabase
npm run db:migrate:supabase
```

(Ces scripts seront ajoutés au `package.json`)

---

## 💾 Backup de votre base locale

```bash
# Sauvegarder
pg_dump -U postgres -d sen_cam_cong_local -F c -f backup_$(date +%Y%m%d).dump

# Restaurer
pg_restore -U postgres -d sen_cam_cong_local -v backup_20231118.dump
```

---

## ❓ Questions fréquentes

**Q : Dois-je créer les tables manuellement ?**
Non, Prisma s'en charge avec `npx prisma migrate dev`.

**Q : Puis-je utiliser une base existante ?**
Oui ! Mettez simplement son nom dans DATABASE_URL.

**Q : Que faire si j'ai déjà des données ?**
Elles seront préservées lors des migrations Prisma (sauf si vous faites `migrate reset`).

**Q : Comment voir mes données ?**
Utilisez `npx prisma studio` - c'est une interface graphique super pratique !

---

## ✨ Prochaines étapes

1. ✅ Configurer `.env.local`
2. ✅ Exécuter les migrations
3. ✅ Tester l'application
4. 📖 Lire `MIGRATION_SUPABASE.md` quand vous serez prêt à migrer

Besoin d'aide ? Vérifiez les logs ou demandez ! 🚀