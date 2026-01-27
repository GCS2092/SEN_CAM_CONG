# 🚨 Étapes Immédiates pour Faire Fonctionner l'Application

## 1️⃣ Éditer .env.local avec ton mot de passe PostgreSQL

```bash
# Ouvre le fichier .env.local et remplace 'your_password'
notepad .env.local
```

Change cette ligne:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sec_cam_cong"
```

Par (avec TON vrai mot de passe):
```
DATABASE_URL="postgresql://postgres:TON_MOT_DE_PASSE_ICI@localhost:5432/sec_cam_cong"
```

## 2️⃣ Copier .env.local vers .env

```bash
copy .env.local .env
```

## 3️⃣ Vérifier la connexion à la base de données

```bash
npm run test-db
```

Si ça ne fonctionne pas, vérifie que:
- PostgreSQL est démarré (Services Windows)
- Le mot de passe est correct
- La base de données `sec_cam_cong` existe

## 4️⃣ Lancer l'application

```bash
npm run dev:local
```

Ou simplement:
```bash
npm run dev
```

## 5️⃣ Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## ✅ Ce qui a été corrigé

1. ✅ Footer.tsx - erreur `window is not defined`
2. ✅ API routes - variables non définies dans les fallbacks
3. ✅ API media - ajout de fallback data
4. ✅ API global-media - ajout de fallback data
5. ✅ Fichier pattern.svg créé
6. ✅ Fichier .env.local créé (à éditer avec ton mot de passe)

---

## 🔧 Si ça ne fonctionne toujours pas

### Erreur de connexion DB:
```bash
# Vérifie ton mot de passe PostgreSQL
psql -U postgres -d sec_cam_cong
```

### Port déjà utilisé:
```bash
# Tue le processus sur le port 3000
npx kill-port 3000
# Puis relance
npm run dev
```

### Erreurs 500:
L'application a des fallback data maintenant, donc même sans DB elle devrait fonctionner (avec des données de démonstration).

---

Bon dev ! 🚀
