# 🔧 Guide : Corriger Cloudinary OU Utiliser Vercel Blob

## Problème Actuel

**Erreur** : `Upload preset must be whitelisted for unsigned uploads`

Le preset "unsigned" n'est pas configuré correctement dans Cloudinary.

---

## ✅ Solution 1 : Configurer Cloudinary Correctement

### Option A : Créer un Preset "unsigned" (Recommandé)

1. **Connectez-vous à Cloudinary** : https://cloudinary.com/console
2. **Allez dans** : Settings → Upload → Upload presets
3. **Créez un nouveau preset** :
   - Nom : `unsigned`
   - Signing mode : **Unsigned**
   - **IMPORTANT** : Dans Settings → Security → Upload presets, activez "Allow unsigned uploads"
   - Folder : `sec-cam-cong` (optionnel)
   - Save

### Option B : Utiliser un Preset Signé (Plus Sécurisé)

1. **Créez un preset signé** dans Cloudinary
2. **Modifiez le code** pour utiliser l'authentification signée au lieu d'unsigned
3. **Avantage** : Plus sécurisé, pas besoin d'activer "unsigned uploads"

---

## ✅ Solution 2 : Utiliser Vercel Blob Storage (Plus Simple)

### Avantages
- ✅ Gratuit jusqu'à 1GB
- ✅ Intégré à Vercel
- ✅ Pas de configuration complexe
- ✅ Fonctionne immédiatement

### Configuration (2 minutes)

1. **Vercel Dashboard** → Votre projet → Storage
2. **Create Database** → Choisissez **Blob**
3. **Nom** : `sec-cam-cong-images` (ou autre)
4. **Région** : Choisissez la plus proche
5. **Create**

6. **Le token est automatiquement ajouté** aux variables d'environnement :
   - `BLOB_READ_WRITE_TOKEN` est créé automatiquement

7. **Redéployez** votre projet (ou attendez le prochain déploiement)

### Comment ça fonctionne

Le code essaie maintenant :
1. **Cloudinary** (si configuré) → Si échoue
2. **Vercel Blob** (si configuré) → Si échoue
3. **Local** (développement uniquement)

---

## 🎯 Recommandation

**Utilisez Vercel Blob Storage** :
- Plus simple à configurer
- Gratuit jusqu'à 1GB
- Intégré à Vercel
- Pas de problèmes de configuration

**OU** corrigez Cloudinary si vous préférez :
- Plus de fonctionnalités (optimisation d'images, transformations)
- Mais nécessite une configuration correcte

---

## 📝 Après Configuration

Une fois Vercel Blob configuré, l'upload fonctionnera automatiquement. Le code détecte que Cloudinary échoue et utilise Vercel Blob automatiquement.

