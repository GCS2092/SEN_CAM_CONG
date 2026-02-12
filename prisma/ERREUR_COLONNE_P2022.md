# Erreur « The column `colonne` does not exist » (P2022)

## Ce que ça veut dire

- Prisma envoie une requête à la base (ex. `findUnique` sur `users`).
- La base répond qu’une colonne attendue **n’existe pas**.
- Le nom affiché `colonne` peut être **trompeur** (bug connu Prisma) : la vraie colonne en cause peut être une autre (ex. `supabaseAuthId`, `createdAt`, `updatedAt`).

En pratique : **le schéma Prisma et la table réelle en base ne sont pas alignés** (colonne manquante ou nom différent).

---

## 1. Vérifier la structure de la table `users` dans Supabase

Dans **Supabase → SQL Editor**, exécuter :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
```

Prisma attend au minimum ces colonnes (noms **exacts**, casse respectée) :

- `id`
- `email`
- `name`
- `password`
- `role`
- `avatar`
- `bio`
- `supabaseAuthId`
- `createdAt`
- `updatedAt`

Si vous voyez par exemple `created_at` / `updated_at` au lieu de `createdAt` / `updatedAt`, ou si une colonne (souvent `supabaseAuthId`, `createdAt`, `updatedAt`) manque, c’est la cause de l’erreur.

---

## 2. Resynchroniser la base avec le schéma Prisma

Avec le bon `.env` (ou `.env.local`) qui pointe vers votre base Supabase :

```bash
npx prisma db push
```

Cela va **ajouter** les colonnes manquantes (sans supprimer de données). Si la commande échoue (ex. conflit de noms), il faudra soit renommer les colonnes en base pour qu’elles correspondent au schéma, soit ajouter des `@map(...)` dans le schéma pour coller à la base.

---

## 3. Régénérer le client Prisma

Après tout changement de schéma ou pour repartir sur une base saine :

```bash
npx prisma generate
```

Puis relancer l’app (ex. `npm run dev`).

---

## Résumé

| Problème | Action |
|----------|--------|
| Colonne manquante en base (ex. `supabaseAuthId`, `createdAt`, `updatedAt`) | `npx prisma db push` (avec la bonne `DATABASE_URL`) |
| Noms de colonnes différents (snake_case vs camelCase) | Adapter le schéma avec `@map` ou modifier la table en base pour correspondre au schéma |
| Client Prisma obsolète | `npx prisma generate` puis redémarrer l’app |

Une fois la table `users` alignée avec le schéma Prisma, l’erreur « column `colonne` does not exist » disparaît.
