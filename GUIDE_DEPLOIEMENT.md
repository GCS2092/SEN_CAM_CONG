# 🚀 Guide de Déploiement - SEN CAM CONG

## 📌 Architecture du Projet

Votre projet est une **application Next.js full-stack** :
- ✅ **Frontend** : Pages React (Next.js)
- ✅ **Backend** : API Routes Next.js (`/app/api/*`)
- ✅ **Base de données** : PostgreSQL avec Prisma
- ✅ **PWA** : Progressive Web App

**IMPORTANT** : C'est un projet **monolithique** - vous déployez **TOUT EN UNE SEULE FOIS**, pas besoin de séparer frontend/backend !

---

## 🎯 Options de Déploiement Recommandées

### Option 1 : Vercel (⭐ RECOMMANDÉ - Le plus simple)

**Avantages :**
- ✅ Gratuit pour commencer
- ✅ Créé par l'équipe Next.js (optimisé pour Next.js)
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/HTTPS automatique
- ✅ CDN global inclus
- ✅ Variables d'environnement faciles à gérer
- ✅ Base de données PostgreSQL intégrée (Vercel Postgres) ou externe

**Inconvénients :**
- ⚠️ Fonctions serverless (limites de temps d'exécution)
- ⚠️ Base de données PostgreSQL payante (mais vous pouvez utiliser Render DB)

**Prix :** Gratuit (Hobby) → $20/mois (Pro)

---

### Option 2 : Render (Déjà configuré dans votre projet)

**Avantages :**
- ✅ Déjà configuré (`render.yaml` présent)
- ✅ PostgreSQL intégré
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/HTTPS automatique
- ✅ Support des applications longues (pas de limite de temps)

**Inconvénients :**
- ⚠️ Cold start (première requête peut être lente)
- ⚠️ Payant (mais plan Starter abordable)

**Prix :** $7/mois (Starter) pour Web Service + $7/mois pour PostgreSQL = **$14/mois**

---

### Option 3 : Railway

**Avantages :**
- ✅ Très simple à utiliser
- ✅ PostgreSQL intégré
- ✅ Déploiement automatique
- ✅ Pay-as-you-go (facturation à l'usage)

**Inconvénients :**
- ⚠️ Peut devenir cher avec beaucoup de trafic

**Prix :** ~$5-20/mois selon l'usage

---

## 🎯 Ma Recommandation : Vercel + Render PostgreSQL

**Pourquoi ?**
- Vercel = meilleur pour Next.js (gratuit, rapide, optimisé)
- Render PostgreSQL = base de données fiable et abordable
- Total : **~$7/mois** (juste la base de données)

---

## 📋 Guide de Déploiement : Vercel (Recommandé)

### Étape 1 : Créer la Base de Données PostgreSQL

**Option A : Render PostgreSQL (Recommandé)**

1. Allez sur [render.com](https://render.com) et créez un compte
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez :
   - **Name** : `sen-cam-cong-db`
   - **Database** : `sen_cam_cong`
   - **User** : `sen_cam_cong_user`
   - **Region** : Choisissez la région la plus proche
   - **Plan** : Starter ($7/mois)
4. Cliquez sur **"Create Database"**
5. **Copiez l'Internal Database URL** (vous en aurez besoin)

**Option B : Vercel Postgres (Plus simple mais payant)**

1. Dans votre projet Vercel, allez dans **Storage**
2. Créez une base **Postgres**
3. Vercel génère automatiquement `DATABASE_URL`

---

### Étape 2 : Déployer sur Vercel

1. **Connectez votre compte GitHub à Vercel :**
   - Allez sur [vercel.com](https://vercel.com)
   - Créez un compte (gratuit)
   - Connectez votre compte GitHub

2. **Importez votre projet :**
   - Cliquez sur **"Add New"** → **"Project"**
   - Sélectionnez le repository `GCS2092/SEN_CAM_CONG`
   - Cliquez sur **"Import"**

3. **Configurez le projet :**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (laisser vide)
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `.next` (automatique)
   - **Install Command** : `npm install` (automatique)

4. **Variables d'environnement :**
   Cliquez sur **"Environment Variables"** et ajoutez :
   ```
   DATABASE_URL=postgresql://... (votre URL Render ou Vercel)
   JWT_SECRET=votre-cle-secrete-aleatoire-tres-longue
   NODE_ENV=production
   ```

   **Générer JWT_SECRET :**
   ```bash
   # Windows PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   
   # Ou utilisez : https://generate-secret.vercel.app/64
   ```

5. **Déployez :**
   - Cliquez sur **"Deploy"**
   - Vercel va automatiquement :
     - Installer les dépendances
     - Exécuter `prisma generate` (via `postinstall`)
     - Builder l'application
     - Déployer

---

### Étape 3 : Initialiser la Base de Données

**Après le premier déploiement :**

1. **Via Vercel CLI (Recommandé) :**
   ```bash
   # Installer Vercel CLI
   npm i -g vercel
   
   # Se connecter
   vercel login
   
   # Lier au projet
   vercel link
   
   # Exécuter les migrations
   npx prisma migrate deploy
   ```

2. **Ou via votre machine locale :**
   ```bash
   # Créez un fichier .env avec DATABASE_URL de production
   DATABASE_URL="postgresql://..."
   
   # Exécutez les migrations
   npx prisma migrate deploy
   ```

3. **Ou via Render Shell (si vous utilisez Render DB) :**
   - Allez dans votre base de données Render
   - Cliquez sur **"Shell"**
   - Exécutez : `npx prisma migrate deploy`

---

### Étape 4 : Créer le Premier Admin

Après avoir initialisé la base de données :

```bash
# Via votre machine locale avec DATABASE_URL de production
npm run create-admin
```

Ou créez un script de déploiement qui crée automatiquement l'admin.

---

## 📋 Guide de Déploiement : Render (Alternative)

Si vous préférez Render (déjà configuré) :

### Étape 1 : Créer la Base de Données

1. Allez sur [render.com](https://render.com)
2. **"New +"** → **"PostgreSQL"**
3. Configurez selon `render.yaml`
4. Copiez l'**Internal Database URL**

### Étape 2 : Créer le Web Service

1. **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub : `GCS2092/SEN_CAM_CONG`
3. Render détecte automatiquement `render.yaml` et configure tout
4. Ajoutez les variables d'environnement :
   - `DATABASE_URL` : Votre Internal Database URL
   - `JWT_SECRET` : Clé secrète générée
   - `NODE_ENV` : `production`
5. Cliquez sur **"Create Web Service"**

### Étape 3 : Initialiser la Base de Données

Via Render Shell :
```bash
npx prisma migrate deploy
```

---

## 🔐 Variables d'Environnement Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Clé secrète pour JWT (64+ caractères) | `abc123...xyz` |
| `NODE_ENV` | Environnement | `production` |

**Optionnelles :**
- `CLOUDINARY_CLOUD_NAME` : Pour upload d'images Cloudinary
- `CLOUDINARY_API_KEY` : Clé API Cloudinary
- `CLOUDINARY_API_SECRET` : Secret Cloudinary

---

## ✅ Checklist de Déploiement

- [ ] Repository GitHub créé et poussé
- [ ] Base de données PostgreSQL créée (Render ou Vercel)
- [ ] Variables d'environnement configurées
- [ ] Application déployée (Vercel ou Render)
- [ ] Migrations Prisma exécutées
- [ ] Premier admin créé
- [ ] Site accessible et fonctionnel
- [ ] Test de connexion admin
- [ ] Test de création d'événement
- [ ] Test d'upload d'image

---

## 🎯 Comparaison Rapide

| Critère | Vercel | Render | Railway |
|---------|--------|--------|---------|
| **Prix (début)** | Gratuit | $14/mois | ~$5-10/mois |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Optimisé Next.js** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **PostgreSQL intégré** | Payant | Inclus | Inclus |
| **Cold Start** | Minimal | Oui | Minimal |
| **Déploiement auto** | ✅ | ✅ | ✅ |

---

## 🚀 Ma Recommandation Finale

**Pour commencer : Vercel (gratuit) + Render PostgreSQL ($7/mois)**

**Pourquoi ?**
1. Vercel est gratuit et optimisé pour Next.js
2. Render PostgreSQL est fiable et abordable
3. Total : **$7/mois** seulement
4. Facile à migrer vers Render complet plus tard si besoin

**Étapes :**
1. Créez PostgreSQL sur Render
2. Déployez sur Vercel (gratuit)
3. Configurez `DATABASE_URL` dans Vercel
4. Exécutez les migrations
5. C'est tout ! 🎉

---

## 📞 Besoin d'Aide ?

- **Vercel Docs** : https://vercel.com/docs
- **Render Docs** : https://render.com/docs
- **Prisma Deploy** : https://www.prisma.io/docs/guides/deployment

