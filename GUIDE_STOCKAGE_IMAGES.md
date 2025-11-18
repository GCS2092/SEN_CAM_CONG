# 📸 Guide : Gestion des Images - Cloudinary vs Alternatives

## 🔍 Diagnostic du Problème Cloudinary

### Problèmes Potentiels Identifiés

1. **Upload Preset "unsigned" manquant**
   - Le preset doit être créé dans Cloudinary Dashboard
   - Settings → Upload → Upload presets → Create upload preset
   - Mode : Unsigned

2. **Variables d'environnement manquantes sur Vercel**
   - Vérifiez dans Vercel → Settings → Environment Variables :
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `CLOUDINARY_UPLOAD_PRESET` (optionnel, défaut: 'unsigned')

3. **Erreurs non visibles**
   - Les logs sont maintenant améliorés dans le code
   - Vérifiez les logs Vercel pour voir l'erreur exacte

---

## ✅ Solution 1 : Corriger Cloudinary (Recommandé d'abord)

### Étape 1 : Vérifier la Configuration Cloudinary

1. **Connectez-vous à Cloudinary** : https://cloudinary.com/console
2. **Vérifiez vos credentials** :
   - Dashboard → Account Details
   - Cloud Name
   - API Key
   - API Secret

3. **Créez un Upload Preset "unsigned"** :
   - Settings → Upload → Upload presets
   - Create upload preset
   - Nom : `unsigned`
   - Signing mode : **Unsigned**
   - Folder : `sec-cam-cong` (optionnel)
   - Save

### Étape 2 : Configurer sur Vercel

1. **Vercel Dashboard** → Votre projet → Settings → Environment Variables
2. **Ajoutez** :
   ```
   CLOUDINARY_CLOUD_NAME=votre-cloud-name
   CLOUDINARY_API_KEY=votre-api-key
   CLOUDINARY_API_SECRET=votre-api-secret
   CLOUDINARY_UPLOAD_PRESET=unsigned
   ```
3. **Redéployez** le projet

### Étape 3 : Tester

1. Essayez d'uploader une image
2. Vérifiez les logs Vercel pour voir les erreurs détaillées
3. Les logs montrent maintenant exactement où ça bloque

---

## 🔄 Solution 2 : Vercel Blob Storage (Alternative Simple)

### Avantages
- ✅ Gratuit jusqu'à 1GB
- ✅ Intégré à Vercel (pas de service externe)
- ✅ Simple à configurer
- ✅ Pas de limite de requêtes (sur le plan gratuit)

### Configuration

1. **Créer un Blob Storage** :
   - Vercel Dashboard → Storage → Create Database
   - Choisissez **Blob**
   - Nom : `sec-cam-cong-images`
   - Région : Choisissez la plus proche
   - Create

2. **Récupérer le Token** :
   - Une fois créé, copiez le `BLOB_READ_WRITE_TOKEN`
   - Il est automatiquement ajouté aux variables d'environnement

3. **Installer la dépendance** :
   ```bash
   npm install @vercel/blob
   ```

4. **Utiliser le nouvel endpoint** :
   - Le code est déjà créé dans `app/api/upload-vercel-blob/route.ts`
   - Modifiez `components/ImageUpload.tsx` pour utiliser `/api/upload-vercel-blob` au lieu de `/api/upload`

---

## 🚫 Pourquoi PAS de Stockage Local en Production ?

### Problème avec Vercel
- ⚠️ Vercel est **serverless** (fonctions sans état)
- ⚠️ Les fichiers uploadés dans `/public/uploads` **disparaissent** à chaque redéploiement
- ⚠️ Pas de stockage persistant sur le système de fichiers
- ⚠️ Chaque fonction peut être sur un serveur différent

### Solutions qui FONCTIONNENT en Production

1. **Vercel Blob Storage** (recommandé pour Vercel)
2. **Cloudinary** (si corrigé)
3. **AWS S3** (payant mais très fiable)
4. **Supabase Storage** (gratuit jusqu'à 1GB)
5. **DigitalOcean Spaces** (simple et pas cher)

---

## 🎯 Recommandation Finale

### Ordre d'Action

1. **D'abord** : Diagnostiquer Cloudinary
   - Vérifier les variables d'environnement
   - Vérifier le preset "unsigned"
   - Regarder les logs Vercel améliorés
   - Tester l'upload

2. **Si Cloudinary ne fonctionne toujours pas** :
   - Utiliser Vercel Blob Storage (le plus simple)
   - Ou Supabase Storage (gratuit et simple)

3. **Si besoin de plus de fonctionnalités** :
   - AWS S3 (optimisation d'images, CDN, etc.)
   - Cloudinary (si vous résolvez le problème)

---

## 📝 Code Modifié

Le code d'upload a été amélioré avec :
- ✅ Logs détaillés pour diagnostiquer
- ✅ Vérification de la configuration
- ✅ Messages d'erreur plus clairs
- ✅ Alternative Vercel Blob Storage prête

---

## 🔧 Prochaines Étapes

1. Vérifiez les logs Vercel après un upload
2. Partagez l'erreur exacte si Cloudinary échoue encore
3. On pourra alors décider si on passe à Vercel Blob ou si on corrige Cloudinary

