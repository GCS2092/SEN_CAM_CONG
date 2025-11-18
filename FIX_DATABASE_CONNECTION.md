# 🔧 Correction : Connexion Base de Données sur Vercel

## Problème Identifié

**Erreur** : `Can't reach database server at dpg-d4e78cer433s738hi9vg-a:5432`

Vercel essaie d'utiliser l'**Internal Database URL** de Render, qui n'est accessible que depuis d'autres services Render, pas depuis Vercel.

## ✅ Solution

### Sur Vercel, vous DEVEZ utiliser l'External Database URL

1. **Allez sur Render Dashboard** → Votre base de données PostgreSQL
2. **Copiez l'External Database URL** (pas l'Internal !)
   - Format : `postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/dbname`
   - Notez le port `:5432` et le domaine complet

3. **Sur Vercel** → Settings → Environment Variables
4. **Vérifiez/modifiez `DATABASE_URL`** :
   - Doit être l'**External Database URL**
   - Doit contenir le port `:5432`
   - Doit avoir le domaine complet (pas juste `dpg-xxxxx-a`)

5. **Redéployez** le projet

## 🔍 Vérification

L'URL doit ressembler à :
```
postgresql://user:password@dpg-d4e78cer433s738hi9vg-a.oregon-postgres.render.com:5432/sen_cam_cong_db
```

**PAS** :
```
postgresql://user:password@dpg-d4e78cer433s738hi9vg-a:5432/sen_cam_cong_db
```

## ⚠️ Problème de Rate Limiting

Si vous voyez "trop de requêtes", c'est que :
- Trop de requêtes simultanées
- La base de données Render est peut-être en pause (gratuit)
- Il faut attendre quelques minutes

