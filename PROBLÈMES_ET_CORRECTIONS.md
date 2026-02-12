# PROBLÈMES ET CORRECTIONS – Référence complète

Ce fichier regroupe **tous** les problèmes rencontrés sur le projet (conversations, fichiers de doc, dépannage) et la solution proposée pour chacun.

---

## 1. Authentification et connexion

### 1.1 POST /api/auth/verify → 401 « Token invalide ou utilisateur non trouvé »

**Problème :** Après login (email + mot de passe corrects), la requête vers `/api/auth/verify` renvoie 401.

**Causes possibles :**
- L’utilisateur existe dans **Supabase Auth** mais pas dans la table **`public.users`**, ou les UID ne correspondent pas.
- La base de données n’est pas joignable depuis le serveur (Vercel : mauvaise `DATABASE_URL` ou RLS).
- Prisma échoue (ex. erreur « prepared statement » ou « column colonne »).

**Solutions :**
1. Mettre en place le **trigger** Supabase Auth → `public.users` : exécuter **`prisma/supabase-auth-sync-trigger.sql`** dans Supabase → SQL Editor (voir section 2.1).
2. Sur **Vercel** : utiliser **`DATABASE_URL`** avec le **pooler** (port **6543**) et **`?pgbouncer=true`** (voir 3.2 et 3.3).
3. Désactiver le **RLS** sur la table `users` dans Supabase : `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
4. Redéployer après toute modification des variables d’environnement.

---

### 1.2 Utilisateur dans Supabase Auth mais pas dans la table `users` / UID différents

**Problème :** L’utilisateur est bien dans **Authentication → Users** (Supabase) mais pas dans **`public.users`**, ou les `id` ne correspondent pas.

**Solution :**
- Exécuter le script **`prisma/supabase-auth-sync-trigger.sql`** pour que chaque **nouvelle** inscription crée une ligne dans `public.users` avec le **même id** (UUID) que dans Auth.
- Pour les utilisateurs **déjà** dans Auth : ils sont créés ou liés au **premier login** par l’app (recherche par email puis liaison ou création). S’assurer que la base est accessible (RLS désactivé sur `users`, `DATABASE_URL` correcte).

---

### 1.3 Nouvel utilisateur : « Email ou mot de passe incorrect » alors que je viens de m’inscrire

**Problème :** On clique sur « Connexion » avec un email qui n’a jamais été inscrit.

**Solution :** Il faut **d’abord s’inscrire** (lien « S’inscrire » sur la page de connexion), puis se connecter. La connexion directe avec un email jamais enregistré dans Supabase Auth renvoie « Email ou mot de passe incorrect ».

---

### 1.4 Erreur 500 sur la connexion (login) en production (Vercel)

**Problème :** Le login échoue en production avec une erreur 500.

**Solutions :**
- Vercel → Settings → Environment Variables : vérifier **`DATABASE_URL`**, **`JWT_SECRET`**, **`NEXT_PUBLIC_SUPABASE_URL`**, **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**.
- Redéployer après modification.
- Consulter les logs (Deployments → Functions) pour l’erreur exacte et appliquer la correction correspondante (ex. 3.2, 3.3, 1.1).

---

### 1.5 CORS / requête vers `https://placeholder.supabase.co`

**Problème :** Message du type : « Blocage d’une requête multiorigine… située sur https://placeholder.supabase.co/auth/v1/token… échec CORS ».

**Cause :** L’app n’a **pas** la vraie URL Supabase : `NEXT_PUBLIC_SUPABASE_URL` est vide ou non définie, donc le client utilise l’URL placeholder.

**Solution :** Définir **`NEXT_PUBLIC_SUPABASE_URL`** et **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (Supabase → Project Settings → API) dans `.env` / `.env.local` en local et dans les variables d’environnement Vercel en production. Redéployer si besoin.

---

### 1.6 Connexion OK en local mais pas en production (URLs Supabase)

**Problème :** En production, la redirection après login échoue ou Supabase rejette la requête.

**Cause :** Dans Supabase (Authentication → URL Configuration), seules des URLs en **localhost** sont autorisées.

**Solution :** Dans Supabase → **Authentication** → **URL Configuration** (ou Redirect URLs), ajouter les URLs de **production** (ex. `https://sen-cam-cong.vercel.app`, `https://sen-cam-cong.vercel.app/**`). Garder aussi `http://localhost:3000` et `http://localhost:3000/**` pour le développement.

---

## 2. Base de données et Prisma

### 2.1 Erreur « prepared statement "s0" / "s3" already exists » (42P05)

**Problème :** Sur Vercel (ou en local avec le pooler), Prisma renvoie une erreur PostgreSQL 42P05 (prepared statement already exists).

**Cause :** Utilisation du **pooler** Supabase (port 6543) sans indiquer à Prisma qu’il s’agit de PgBouncer.

**Solution :** Dans **`DATABASE_URL`**, ajouter **`?pgbouncer=true`** à la fin (ou **`&pgbouncer=true`** si l’URL a déjà des paramètres). Exemple : `...6543/postgres?pgbouncer=true`. Puis redéployer / redémarrer l’app.

---

### 2.2 P1001 : Can't reach database server at `....supabase.co:5432`

**Problème :** `npx prisma db push` (ou l’app) ne peut pas joindre la base (connexion directe, port 5432).

**Cause :** La connexion **directe** (5432) est souvent bloquée depuis l’extérieur (pare-feu, politique Supabase).

**Solution :** Utiliser l’URL de **connection pooling** (port **6543**) dans **`DATABASE_URL`** (Supabase → Project Settings → Database → Connection string → **Connection pooling**). Ajouter **`?pgbouncer=true`** à la fin. Utiliser cette URL en local **et** sur Vercel pour les commandes Prisma et l’app.

---

### 2.3 Erreur « The column `colonne` does not exist » (P2022)

**Problème :** Prisma renvoie : « The column `colonne` does not exist in the current database ».

**Cause :** Décalage entre le **schéma Prisma** et la **structure réelle** de la table (colonne manquante ou nom différent). Le nom « colonne » peut être trompeur (bug connu Prisma).

**Solutions :**
1. Vérifier la structure de la table (ex. `users`) dans Supabase → SQL Editor :
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'users' ORDER BY ordinal_position;
   ```
2. S’assurer que les noms et la casse correspondent au schéma (ex. `createdAt`, `updatedAt`, `supabaseAuthId`).
3. Resynchroniser : **`npx prisma db push`** (avec la bonne `DATABASE_URL`) pour ajouter les colonnes manquantes.
4. Régénérer le client : **`npx prisma generate`**, puis redémarrer l’app.

---

### 2.4 EPERM : operation not permitted, rename '...query_engine-windows.dll.node'

**Problème :** Lors de **`npx prisma generate`**, erreur EPERM sur le renommage du fichier du moteur Prisma.

**Cause :** Le fichier est **verrouillé** par un autre processus (souvent le serveur Next.js ou l’IDE).

**Solution :**
1. Arrêter le serveur de dev (`Ctrl+C` dans le terminal où tourne `npm run dev`).
2. Fermer les autres terminaux/onglets qui utilisent le projet.
3. Relancer **`npx prisma generate`**.
4. Si l’erreur persiste : fermer Cursor/VS Code, relancer un terminal, refaire **`npx prisma generate`**, puis rouvrir le projet.

---

### 2.5 Prisma Client not generated

**Problème :** Erreur indiquant que le client Prisma n’est pas généré.

**Solution :**
```bash
npx prisma generate
```

---

### 2.6 Erreur de connexion à la base de données (générique)

**Problème :** L’app ou Prisma ne peut pas se connecter à la base.

**Solutions :**
- Vérifier que PostgreSQL est démarré (si base locale).
- Vérifier que **`DATABASE_URL`** dans `.env` / `.env.local` est correcte (voir 2.2 pour Supabase : préférer le pooler 6543 + `?pgbouncer=true`).
- Tester la connexion avec `psql` ou un client PostgreSQL si besoin.

---

### 2.7 RLS (Row Level Security) et 401 après login réussi

**Problème :** Supabase accepte le login mais l’app renvoie 401 car elle ne « voit » pas l’utilisateur en base.

**Cause :** RLS activé sur la table **`users`** sans politique adaptée, donc 0 ligne retournée.

**Solution :** Dans Supabase → SQL Editor, exécuter :
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

---

## 3. Vercel et production

### 3.1 Checklist connexion en production (Vercel)

Si vous voyez **401** ou « Token invalide ou utilisateur non trouvé » après login :

1. **Nouvel utilisateur** : s’inscrire d’abord (lien « S’inscrire »), puis se connecter.
2. **Variables d’environnement** sur Vercel :
   - **`DATABASE_URL`** : URL **pooler** (port **6543**) + **`?pgbouncer=true`** (voir 3.2 et 3.3).
   - **`NEXT_PUBLIC_SUPABASE_URL`** et **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** : identiques à Supabase (Project Settings → API).
   - **`JWT_SECRET`** : défini (même valeur qu’en local si souhaité).
3. **RLS** : désactivé sur la table `users` (voir 2.7).
4. **Redéploiement** : après toute modification des variables, faire **Redeploy** sur le dernier déploiement (Vercel → Deployments → ⋮ → Redeploy).

---

### 3.2 DATABASE_URL sur Vercel (pooler obligatoire)

**Problème :** En production, la base n’est pas joignable ou erreurs Prisma (prepared statement, timeouts).

**Solution :** Sur Vercel, utiliser **uniquement** la chaîne de connexion **pooler** (port **6543**) depuis Supabase (Project Settings → Database → Connection string → **Connection pooling**), avec **`?pgbouncer=true`** à la fin (ou **`&pgbouncer=true`** si l’URL a déjà des paramètres).

---

### 3.3 Migration d’images : « Le dossier public/uploads n'existe pas » (404) sur Vercel

**Problème :** Sur `/admin/migrate-images`, clic sur « Lancer la migration » → 404 et message « Le dossier public/uploads n'existe pas ».

**Cause :** Sur Vercel, il n’y a **pas** de système de fichiers persistant ; le dossier **`public/uploads`** n’existe pas côté serveur.

**Solution :** Cette migration doit être lancée **en local** : placer les images dans **`public/uploads`** sur votre machine, lancer **`npm run dev`**, aller sur **http://localhost:3000/admin/migrate-images**, se connecter en admin, puis cliquer sur « Lancer la migration ». Les images seront envoyées vers Vercel Blob (ou le stockage configuré).

---

## 4. Formulaire et validation

### 4.1 Formulaire « Créer l’événement » : message « Required »

**Problème :** Lors de la création d’un événement (admin), validation échouée avec le message « Required ».

**Cause :** Le formulaire exigeait un **`userId`** et le récupérait depuis le JWT (payload). Avec un **token Supabase**, l’id utilisateur est dans **`sub`**, pas dans **`id`**, donc `payload.id` était undefined → erreur de validation.

**Solution (déjà appliquée dans le code) :** Utiliser **`eventCreateSchema`** (sans champ `userId` côté client). L’API vérifie le token et définit **`userId`** à partir de l’utilisateur authentifié. Plus besoin d’envoyer `userId` depuis le front.

---

## 5. Synchronisation Auth ↔ table `users`

### 5.1 Trigger : nouvelle inscription → ligne dans `public.users`

**Problème :** Éviter la désynchronisation entre **auth.users** (Supabase Auth) et **public.users** (table métier).

**Solution :** Exécuter **une fois** le script **`prisma/supabase-auth-sync-trigger.sql`** dans Supabase → SQL Editor. À chaque **insert** dans **auth.users**, une ligne est créée dans **public.users** avec le **même id** (UUID). Vérification possible avec **`VERIFICATION_AUTH.md`**.

---

### 5.2 Vérifier que le trigger et la connexion fonctionnent

**Problème :** S’assurer que l’auth et la sync sont OK.

**Solution :** Suivre le guide **`VERIFICATION_AUTH.md`** (vérification du trigger, comparaison **auth.users** / **public.users**, test inscription + connexion, statut 200 sur **POST /api/auth/verify**).

---

## 6. Développement et outillage

### 6.1 Erreur « Module not found »

**Problème :** Un module Node/Next est introuvable.

**Solution :**
```bash
rm -rf node_modules .next
npm install
```

---

### 6.2 Le site ne se charge pas (local)

**Problème :** La page ne s’affiche pas ou erreur au démarrage.

**Solutions :**
- Vérifier les logs dans le terminal.
- Ouvrir la console du navigateur (F12) pour les erreurs JavaScript.
- Vérifier que le port 3000 n’est pas déjà utilisé.
- Nettoyer le cache Next : **`rm -rf .next`** puis **`npm run dev`**.

---

### 6.3 Écran blanc / SyntaxError (layout, icônes)

**Problème :** Page blanche avec erreur du type « Uncaught SyntaxError » (ex. dans `layout.js`), souvent liée à une icône manquante.

**Solutions :**
- Vérifier que les icônes référencées dans **`app/layout.tsx`** (metadata) existent dans **`public/`** (ex. **`icon.svg`**, **`icon-192x192.png`**, **`icon-512x512.png`**). Corriger les chemins si besoin.
- Supprimer le cache : **`rm -rf .next`**, puis **`npm run dev`**.
- Si le problème persiste : **`rm -rf node_modules .next`**, **`npm install`**, **`npm run dev`**.

---

### 6.4 Erreur d’hydratation (heure / date différente serveur vs client)

**Problème :** Warning « Text content did not match. Server: "23:41" Client: "23:42" » (ou équivalent pour une date/heure).

**Cause :** L’heure (ou la date) change entre le rendu serveur et le premier rendu client.

**Solution :** N’afficher l’heure (ou la date dynamique) qu’après le premier montage client (ex. avec un état `isMounted` ou `useEffect`), et afficher un placeholder (ex. `--:--:--`) côté serveur.

---

## 7. Cloudinary et stockage d’images

### 7.1 Upload Cloudinary échoue (preset, variables)

**Problème :** L’upload vers Cloudinary ne fonctionne pas.

**Causes possibles :**
- Preset **unsigned** absent ou mal configuré dans le dashboard Cloudinary.
- Variables d’environnement manquantes : **`CLOUDINARY_CLOUD_NAME`**, **`CLOUDINARY_API_KEY`**, **`CLOUDINARY_API_SECRET`** (et optionnellement **`CLOUDINARY_UPLOAD_PRESET`**).

**Solutions :**
- Vérifier les variables dans `.env` et sur Vercel.
- Vérifier dans Cloudinary que le preset « unsigned » existe et est bien configuré.
- Consulter **`DIAGNOSTIC_CLOUDINARY.md`** et **`GUIDE_FIX_CLOUDINARY.md`** pour le détail.

---

### 7.2 Stockage en production (Vercel)

**Problème :** Besoin d’un stockage fiable pour les images en production.

**Contexte :** Vercel est serverless ; il n’y a pas de stockage persistant local. Le dossier **`public/uploads`** n’existe pas en production (voir 3.3).

**Solutions recommandées :**
- **Vercel Blob Storage** : intégré, simple, gratuit jusqu’à 1 Go.
- **Supabase Storage** : gratuit jusqu’à 1 Go.
- **Cloudinary** : si déjà configuré et diagnostiqué (voir 7.1).

---

## 8. Résumé par fichier / doc existante

| Fichier | Contenu utile |
|--------|----------------|
| **ACTIONS_MANUELLES.md** | Étapes d’installation, .env, BDD, PWA, dépannage (Prisma, Auth, prepared statement, 500 login, checklist Vercel, trigger). |
| **VERIFICATION_AUTH.md** | Vérification du trigger, comparaison Auth / users, tests inscription et connexion, statut 200 sur /api/auth/verify. |
| **prisma/ERREUR_COLONNE_P2022.md** | Détail erreur « column colonne », vérification structure table, `db push`, `prisma generate`. |
| **DIAGNOSTIC_CLOUDINARY.md** | Problèmes Cloudinary (preset, variables, DataURI), alternatives (Vercel Blob, Supabase Storage). |
| **FIX_ECRAN_BLANC.md** | Écran blanc, icônes manquantes, nettoyage .next / node_modules. |
| **FIX_HEURE_HYDRATATION.md** | Hydratation heure/date, usage de `isMounted` / placeholder. |
| **GUIDE_SUPABASE_INTEGRATION.md** | Configuration Supabase, schéma, auth, déploiement. |

---

## 9. Commandes utiles (rappel)

```bash
# Dépendances
npm install

# Prisma
npx prisma generate
npx prisma db push
npx prisma studio

# Cache / redémarrage propre
rm -rf .next
rm -rf node_modules .next && npm install

# Dev
npm run dev
```

---

*Dernière mise à jour : regroupement de tous les problèmes et corrections documentés dans le projet et les conversations.*
