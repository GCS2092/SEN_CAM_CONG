# Guide de Déploiement sur Render

Ce guide vous explique comment déployer le site SEN CAM CONG sur Render.

## 📋 Prérequis

- Un compte Render (avec abonnement)
- Un repository GitHub/GitLab/Bitbucket
- PostgreSQL (via Render ou externe)

## 🗄️ Étape 1 : Créer la Base de Données PostgreSQL

1. Connectez-vous à votre dashboard Render
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez :
   - **Name** : `sen-cam-cong-db`
   - **Database** : `sen_cam_cong`
   - **User** : `sen_cam_cong_user`
   - **Region** : Choisissez la région la plus proche
   - **Plan** : Sélectionnez votre plan (Starter ou supérieur)
4. Cliquez sur **"Create Database"**
5. **Important** : Copiez l'**Internal Database URL** (vous en aurez besoin)

## 🚀 Étape 2 : Créer le Web Service

1. Dans le dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository (GitHub/GitLab/Bitbucket)
3. Sélectionnez le repository `SEN_CAM_CONG` (ou `GCS2092/SEN_CAM_CONG`)
4. Configurez le service :
   - **Name** : `sen-cam-cong`
   - **Region** : Même région que votre base de données
   - **Branch** : `main` (ou votre branche principale)
   - **Root Directory** : `/` (laisser vide)
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Sélectionnez votre plan

## 🔐 Étape 3 : Configurer les Variables d'Environnement

Dans la section **"Environment"** de votre Web Service, ajoutez :

```
DATABASE_URL=<votre-internal-database-url-de-render>
JWT_SECRET=<générez-une-clé-secrète-aléatoire>
NODE_ENV=production
```

### Générer JWT_SECRET :

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Ou utilisez un générateur en ligne
# https://generate-secret.vercel.app/32
```

### Obtenir DATABASE_URL :

1. Allez dans votre base de données PostgreSQL sur Render
2. Dans l'onglet **"Connections"**, copiez l'**Internal Database URL**
3. Collez-la dans la variable `DATABASE_URL`

## 🗃️ Étape 4 : Initialiser la Base de Données

Après le premier déploiement, vous devez exécuter les migrations :

### Option 1 : Via Render Shell

1. Dans votre Web Service, allez dans l'onglet **"Shell"**
2. Exécutez :
```bash
npx prisma migrate deploy
```

Ou si vous préférez push directement :
```bash
npx prisma db push
```

### Option 2 : Via votre machine locale

1. Configurez votre `.env` local avec la DATABASE_URL de Render
2. Exécutez :
```bash
npx prisma migrate deploy
```

## 📱 Étape 5 : Configurer le Domaine (Optionnel)

1. Dans votre Web Service, allez dans **"Settings"**
2. Dans la section **"Custom Domains"**, ajoutez votre domaine
3. Suivez les instructions pour configurer le DNS

## ✅ Vérification

Une fois déployé, vérifiez que :

- ✅ Le site est accessible sur l'URL Render
- ✅ Les pages se chargent correctement
- ✅ Les API routes fonctionnent (`/api/events`, `/api/performances`)
- ✅ La base de données est accessible (via Prisma Studio si besoin)

## 🔧 Commandes Utiles

### Accéder à Prisma Studio (en production)

Via Render Shell :
```bash
npx prisma studio
```

Puis utilisez le port forwarding de Render pour y accéder.

### Voir les logs

Dans Render, allez dans l'onglet **"Logs"** de votre Web Service.

### Redémarrer le service

Dans Render, cliquez sur **"Manual Deploy"** → **"Clear build cache & deploy"**

## 🐛 Dépannage

### Erreur : "Prisma Client not generated"

Solution : Vérifiez que le script `postinstall` dans `package.json` inclut `prisma generate`

### Erreur : "Database connection failed"

Solutions :
- Vérifiez que `DATABASE_URL` est correctement configurée
- Vérifiez que votre base de données est dans la même région
- Utilisez l'**Internal Database URL** (pas l'externe) pour de meilleures performances

### Erreur : "Build failed"

Solutions :
- Vérifiez les logs de build dans Render
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que `NODE_ENV=production` est défini

## 📝 Notes Importantes

- **Cold Start** : Avec un abonnement Render, le cold start est minimal
- **Auto-deploy** : Render déploie automatiquement à chaque push sur la branche principale
- **Health Check** : Render vérifie automatiquement `/` comme health check path
- **PWA** : Les Service Workers sont automatiquement générés par `next-pwa`

## 🔄 Mises à Jour

Pour mettre à jour le site :

1. Poussez vos changements sur GitHub
2. Render déploiera automatiquement
3. Si vous avez modifié le schéma Prisma, exécutez les migrations via Shell

---

**Besoin d'aide ?** Consultez la [documentation Render](https://render.com/docs) ou les logs de votre service.

