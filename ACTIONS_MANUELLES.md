# ✅ ACTIONS MANUELLES À EFFECTUER

Ce guide liste **TOUT ce que vous devez faire manuellement** pour que le site fonctionne.

---

## 🔴 ÉTAPE 1 : INSTALLER LES DÉPENDANCES (OBLIGATOIRE)

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
``` 

⏱️ **Temps estimé :** 2-5 minutes

---

## 🔴 ÉTAPE 2 : CRÉER LE FICHIER .env (OBLIGATOIRE)

1. **Créez un fichier `.env`** à la racine du projet (à côté de `package.json`)

2. **Copiez ce contenu dans `.env` :**

```env
# Database - REMPLACEZ PAR VOTRE URL POSTGRESQL
DATABASE_URL="postgresql://user:password@localhost:5432/sec_cam_cong?schema=public"

# JWT Secret - GÉNÉREZ UNE CLÉ SECRÈTE
JWT_SECRET="changez-moi-par-une-cle-secrete-aleatoire-tres-longue"

# NextAuth (optionnel pour l'instant)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changez-moi-aussi"

# Supabase Auth (connexion / inscription)
NEXT_PUBLIC_SUPABASE_URL="https://VOTRE_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key"

# Cloudinary (optionnel - pour upload d'images plus tard)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Environment
NODE_ENV="development"
```

3. **MODIFIEZ ces valeurs :**
   - `DATABASE_URL` : URL PostgreSQL (ex. Supabase → Settings → Database)
   - `JWT_SECRET` : Générez une clé aléatoire (voir ci-dessous)
   - **Supabase Auth** : Si vous utilisez Supabase pour la base, ajoutez aussi l’URL et la clé anon (Dashboard → Project Settings → API) pour que la connexion / inscription fonctionnent.

### 🔑 Générer JWT_SECRET :

**Sur Windows (PowerShell) :**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Ou utilisez un générateur en ligne :**
https://generate-secret.vercel.app/32

**Ou simplement :** Utilisez une longue chaîne aléatoire de 32+ caractères

---

## 🔴 ÉTAPE 3 : CONFIGURER LA BASE DE DONNÉES (OBLIGATOIRE)

### Option A : Base de données locale (PostgreSQL installé)

1. **Créez une base de données :**
```sql
CREATE DATABASE sec_cam_cong;
```

2. **Mettez à jour `.env`** avec vos identifiants PostgreSQL

3. **Initialisez le schéma :**
```bash
npx prisma db push
```

### Option B : Base de données Render (Recommandé pour production)

1. **Créez une base PostgreSQL sur Render** (voir `DEPLOY.md`)

2. **Copiez l'URL de connexion** depuis Render

3. **Mettez à jour `DATABASE_URL` dans `.env`**

4. **Initialisez le schéma :**
```bash
npx prisma db push
```

⏱️ **Temps estimé :** 5-10 minutes

### Option C : Procédure réglementaire avec Prisma Migrate (baseline + deploy)

Si la base existe déjà (par ex. déjà synchronisée avec `db push`) et que vous voulez utiliser **Prisma Migrate** en production (`migrate deploy`) :

1. **Baseline :** marquer les migrations déjà reflétées en base comme appliquées (une seule fois) :

```bash
npx prisma migrate resolve --applied "20251117174517_add_indexes"
npx prisma migrate resolve --applied "20251206145039_add_member_model"
npx prisma migrate resolve --applied "20251206150406_add_member_model_with_user_relation"
npx prisma migrate resolve --applied "add_site_settings_and_global_media"
```

2. **Appliquer les migrations restantes** (dont `supabaseAuthId` si besoin) :

```bash
npx prisma migrate deploy
```

Ensuite, pour toute évolution du schéma : créer une migration en local avec `npx prisma migrate dev`, committer le dossier `prisma/migrations/`, puis en production exécuter uniquement `npx prisma migrate deploy`.

---

## 🔴 ÉTAPE 4 : CRÉER LES ICÔNES PWA (OBLIGATOIRE pour PWA)

Pour que la PWA fonctionne, vous devez ajouter 2 icônes dans le dossier `public/` :

1. **Créez ou téléchargez une image carrée** (logo de votre groupe)
   - Format : PNG
   - Taille minimale : 512x512 pixels
   - Fond transparent ou avec votre couleur de thème

2. **Redimensionnez en 2 tailles :**
   - `icon-192x192.png` (192x192 pixels)
   - `icon-512x512.png` (512x512 pixels)

3. **Placez les fichiers dans :** `public/icon-192x192.png` et `public/icon-512x512.png`

### 🛠️ Outils pour créer les icônes :

- **En ligne :** https://realfavicongenerator.net/
- **En ligne :** https://www.pwabuilder.com/imageGenerator
- **Logiciel :** GIMP, Photoshop, Canva, etc.

⏱️ **Temps estimé :** 10-15 minutes

---

## 🟡 ÉTAPE 5 : PERSONNALISER LE CONTENU (RECOMMANDÉ)

### 5.1 Modifier les textes du site

**Fichiers à modifier :**

1. **`components/Footer.tsx`** :
   - Ligne 20-25 : Remplacez les liens sociaux (`#`) par vos vraies URLs
   - Ligne 30 : Modifiez le texte de description

2. **`components/Hero.tsx`** :
   - Ligne 20 : Modifiez le titre principal si besoin
   - Ligne 24 : Modifiez le sous-titre

3. **`app/about/page.tsx`** :
   - Remplacez tout le contenu par votre vraie histoire
   - Modifiez l'email de contact

4. **`app/layout.tsx`** :
   - Ligne 9 : Modifiez le titre du site
   - Ligne 10 : Modifiez la description SEO

### 5.2 Modifier les couleurs (optionnel)

**Fichier :** `tailwind.config.ts`
- Lignes 8-18 : Modifiez la palette `primary` pour changer les couleurs du site

### 5.3 Modifier l'image de fond du Hero

**Fichier :** `components/Hero.tsx`
- Ligne 7 : Remplacez l'URL Unsplash par votre propre image
- Ou ajoutez votre image dans `public/` et utilisez `/votre-image.jpg`

⏱️ **Temps estimé :** 30-60 minutes

---

## 🟡 ÉTAPE 6 : TESTER EN LOCAL (RECOMMANDÉ)

1. **Lancez le serveur de développement :**
```bash
npm run dev
```

2. **Ouvrez votre navigateur :**
```
http://localhost:3000
```

3. **Vérifiez que :**
   - ✅ Le site se charge
   - ✅ La navigation fonctionne
   - ✅ Les pages s'affichent correctement
   - ✅ Pas d'erreurs dans la console (F12)

4. **Testez les API :**
   - Allez sur `http://localhost:3000/api/events`
   - Vous devriez voir `{"events":[]}` (vide au début, c'est normal)

⏱️ **Temps estimé :** 10 minutes

---

## 🟢 ÉTAPE 7 : AJOUTER DU CONTENU INITIAL (OPTIONNEL)

Une fois le site fonctionnel, vous pouvez ajouter des données :

### Via Prisma Studio (Interface graphique) :

```bash
npm run db:studio
```

Cela ouvre une interface web où vous pouvez :
- Créer des utilisateurs
- Ajouter des événements
- Ajouter des performances
- Ajouter des médias

### Via l'API (avec Postman ou curl) :

**Créer un événement :**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Concert au Zénith",
    "description": "Notre premier grand concert",
    "date": "2024-06-15T20:00:00Z",
    "location": "Paris",
    "venue": "Zénith de Paris",
    "userId": "votre-user-id"
  }'
```

---

## 🚀 ÉTAPE 8 : DÉPLOYER SUR RENDER (QUAND PRÊT)

Consultez le fichier **`DEPLOY.md`** pour le guide complet de déploiement.

**Résumé rapide :**
1. Créez une base PostgreSQL sur Render
2. Créez un Web Service et connectez votre repo GitHub
3. Configurez les variables d'environnement sur Render
4. Exécutez les migrations : `npx prisma migrate deploy`

---

## ✅ CHECKLIST FINALE

Avant de considérer le site comme "fonctionnel", vérifiez :

- [ ] ✅ `npm install` exécuté sans erreur
- [ ] ✅ Fichier `.env` créé et configuré
- [ ] ✅ `DATABASE_URL` pointe vers une base PostgreSQL valide
- [ ] ✅ `JWT_SECRET` défini avec une clé aléatoire
- [ ] ✅ `npx prisma db push` exécuté avec succès
- [ ] ✅ Icônes PWA ajoutées (`icon-192x192.png` et `icon-512x512.png`)
- [ ] ✅ `npm run dev` fonctionne sans erreur
- [ ] ✅ Le site s'affiche sur `http://localhost:3000`
- [ ] ✅ Les liens sociaux mis à jour dans le Footer
- [ ] ✅ Le contenu personnalisé (textes, images)

---

## 🆘 EN CAS DE PROBLÈME

### Erreur "Prisma Client not generated"
```bash
npx prisma generate
```

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré (si local)
- Vérifiez que `DATABASE_URL` est correct dans `.env`
- Testez la connexion avec `psql` ou un client PostgreSQL

### Erreur "Module not found"
```bash
rm -rf node_modules .next
npm install
```

### Le site ne se charge pas
- Vérifiez les logs dans le terminal
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que le port 3000 n'est pas déjà utilisé

### Authentification Supabase (connexion / inscription)
L’app utilise **Supabase Auth** pour la connexion et l’inscription.

- **Supabase** : Authentication → Providers → Email activé. (Optionnel : désactiver « Confirm email » pour ne pas exiger la confirmation par email.)
- **.env et Vercel** : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).
- Après mise à jour du schéma : `npx prisma db push` pour ajouter la colonne `supabaseAuthId`.
- Les utilisateurs existants sont liés au premier login avec le même email.

### Erreur 500 sur la connexion (login) en production (Vercel)
- **Vercel** → Settings → Environment Variables : `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Redéployez après modification. Consultez les logs (Deployments → Functions) pour l’erreur exacte.

---

## 📞 BESOIN D'AIDE ?

- Consultez `SETUP.md` pour plus de détails
- Consultez `DEPLOY.md` pour le déploiement
- Vérifiez les logs d'erreur dans le terminal

**Bon courage ! 🚀**

