# 🗄️ Guide Base de Données - Sen Cam Cong

## 📊 Vue d'ensemble

Ce projet supporte deux configurations de base de données :
1. **PostgreSQL Local** (développement)
2. **Supabase** (production)

---

## 🚀 Démarrage Rapide

### Pour commencer MAINTENANT (Local)

1. **Crée `.env.local` :**
```env
DATABASE_URL="postgresql://postgres:tonpassword@localhost:5432/ta_base"
JWT_SECRET="ktA2IcdTl6sCaW9XnpLYB1qrEhugUNZKx37MmiSFoP4DfObHGzyVR08eJw5Qj"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changez-moi-aussi"
CLOUDINARY_CLOUD_NAME="dfhuu4drw"
CLOUDINARY_API_KEY="543716329812553"
CLOUDINARY_API_SECRET="zm9pecmSVAgwW5yJz4VqXkatfxg"
```

2. **Lance les migrations :**
```bash
npm run db:migrate:local
```

3. **Démarre l'app :**
```bash
npm run dev:local
```

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| `QUICK_START.md` | Guide ultra-rapide (5 minutes) |
| `SETUP_LOCAL_DB.md` | Configuration PostgreSQL détaillée |
| `MIGRATION_SUPABASE.md` | Migration vers Supabase (pour plus tard) |

---

## 🛠️ Scripts NPM disponibles

### Développement

```bash
# Avec base locale
npm run dev:local

# Avec Supabase (après migration)
npm run dev:supabase

# Mode standard (utilise .env actuel)
npm run dev
```

### Base de données

```bash
# Migrations
npm run db:migrate:local      # Appliquer migrations en local
npm run db:migrate:supabase   # Appliquer migrations sur Supabase

# Prisma Studio (interface graphique)
npm run db:studio:local       # Ouvrir base locale
npm run db:studio:supabase    # Ouvrir base Supabase

# Push schema (dev rapide sans migrations)
npm run db:push:local         # Push vers base locale
npm run db:push:supabase      # Push vers Supabase

# Utilitaires
npm run test-db               # Tester la connexion
npm run create-admin          # Créer un utilisateur admin
npm run seed-events           # Remplir avec des événements de test
```

---

## 🔄 Workflow Recommandé

### Phase 1 : Développement Local (MAINTENANT)

```bash
# 1. Configure ta base locale
# Voir SETUP_LOCAL_DB.md

# 2. Travaille normalement
npm run dev:local
npm run db:studio:local  # Pour voir/éditer les données

# 3. Crée des migrations quand tu changes le schema
npm run db:migrate:local
```

### Phase 2 : Migration vers Supabase (PLUS TARD)

```bash
# 1. Crée un projet Supabase
# Voir MIGRATION_SUPABASE.md étapes 1-2

# 2. Configure .env.supabase
# Copie l'URL de connexion Supabase

# 3. Migre le schéma
npm run db:migrate:supabase

# 4. Migre les données
# Plusieurs options dans MIGRATION_SUPABASE.md

# 5. Teste avec Supabase
npm run dev:supabase
npm run db:studio:supabase
```

---

## ⚙️ Configuration des Fichiers

```
C:\SEC_CAM_CONG\
├── .env                    # Fichier actif (copié depuis .env.local)
├── .env.local              # Config PostgreSQL local (TU CRÉES CELUI-CI)
├── .env.supabase           # Config Supabase (créer plus tard)
├── .env.local.example      # Template
└── prisma/
    ├── schema.prisma       # Schéma de la base
    └── migrations/         # Historique des migrations
```

**Important :** `.env.local` et `.env.supabase` sont dans `.gitignore` !

---

## 🔍 Vérifications

### Vérifier ta config locale

```bash
# 1. PostgreSQL est-il installé ?
psql --version

# 2. Ta base existe-t-elle ?
psql -U postgres -l

# 3. Connexion Prisma fonctionne ?
npm run test-db

# 4. Voir les données
npm run db:studio:local
```

---

## 🆘 Problèmes Courants

### ❌ "Can't reach database server at localhost"

**Solution :**
1. PostgreSQL est-il démarré ? (Services Windows)
2. `.env.local` existe-t-il ?
3. DATABASE_URL est-elle correcte ?

### ❌ "password authentication failed"

**Solution :**
Vérifie le mot de passe dans DATABASE_URL

### ❌ "database does not exist"

**Solution :**
```bash
psql -U postgres -c "CREATE DATABASE ton_nom_de_base;"
```

### ❌ L'app utilise des fallback data

**C'est normal !** L'app a des données de secours si la DB n'est pas connectée.
Pour utiliser la vraie DB, configure `.env.local` correctement.

---

## 📊 Structure de la Base

### Tables principales

- `User` - Utilisateurs (admin, artistes, visiteurs)
- `Event` - Événements culturels
- `Performance` - Performances artistiques
- `Media` - Photos/vidéos
- `SiteSettings` - Configuration du site
- `SocialLink` - Liens réseaux sociaux

### Voir le schéma complet

```bash
code prisma/schema.prisma
# ou
npm run db:studio:local
```

---

## 🎯 Prochaines Étapes

1. [ ] Créer `.env.local` avec ta config PostgreSQL
2. [ ] Exécuter `npm run db:migrate:local`
3. [ ] Lancer `npm run dev:local`
4. [ ] (Optionnel) Créer un admin : `npm run create-admin`
5. [ ] (Plus tard) Lire `MIGRATION_SUPABASE.md`

---

## 💡 Tips

- Utilise `npm run db:studio:local` pour une interface graphique de ta DB
- Fais des backups réguliers avec `pg_dump`
- Garde `.env.local` pour le dev, `.env.supabase` pour la prod
- Les données de fallback permettent de développer sans DB connectée

Besoin d'aide ? Consulte les guides détaillés ! 🚀
