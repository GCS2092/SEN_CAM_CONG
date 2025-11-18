# 🔧 Correction des Problèmes Identifiés

## Problème 1 : Cloudinary - Upload Preset

**Erreur** : `Upload preset must be whitelisted for unsigned uploads`

**Solution** : Le preset "unsigned" doit être configuré dans Cloudinary Dashboard

### Étapes pour corriger :

1. **Connectez-vous à Cloudinary** : https://cloudinary.com/console
2. **Allez dans** : Settings → Upload → Upload presets
3. **Créez ou modifiez le preset "unsigned"** :
   - Nom : `unsigned`
   - Signing mode : **Unsigned**
   - **IMPORTANT** : Cochez "Allow unsigned uploads" dans les paramètres du compte
   - Folder : `sec-cam-cong` (optionnel)
   - Save

4. **Alternative** : Utiliser un preset signé (plus sécurisé)
   - Créez un preset avec votre API Secret
   - Modifiez le code pour utiliser l'authentification signée

---

## Problème 2 : Migration Prisma Non Appliquée

**Erreur** : `The table 'public.site_settings' does not exist`

**Solution** : Appliquer la migration sur la base de données Render

### Étapes pour corriger :

1. **Connectez-vous à Render** : https://dashboard.render.com
2. **Allez dans votre base de données PostgreSQL**
3. **Cliquez sur "Shell"** (ou utilisez votre terminal local avec External URL)
4. **Exécutez** :
   ```bash
   npx prisma migrate deploy
   ```

   **OU** si vous êtes en local avec External URL :
   ```bash
   # Assurez-vous que votre .env pointe vers Render
   npx prisma migrate deploy
   ```

5. **Vérifiez** que les tables sont créées :
   ```bash
   npx prisma db pull
   ```

---

## Solution Rapide : Passer à Vercel Blob Storage

Si vous voulez éviter les problèmes Cloudinary, vous pouvez utiliser Vercel Blob Storage :

1. **Vercel Dashboard** → Storage → Create Database → Blob
2. Le token est automatiquement ajouté
3. Le code est déjà prêt dans `app/api/upload-vercel-blob/route.ts`

