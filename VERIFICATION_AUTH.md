# Vérifier que l’auth et la sync Auth → users marchent

Suivez ces étapes dans l’ordre pour valider le trigger et la connexion.

---

## 1. Vérifier que le trigger existe (Supabase)

1. Ouvrez **Supabase** → **SQL Editor**.
2. Exécutez :

```sql
SELECT trigger_schema, trigger_name, event_manipulation, event_object_schema, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Résultat attendu : une ligne avec **`trigger_name = on_auth_user_created`**, **`event_object_schema = auth`**, **`event_object_table = users`** (donc le trigger est bien sur `auth.users`).

---

## 2. Comparer auth.users et public.users (SQL)

Dans **Supabase → SQL Editor** :

```sql
-- Utilisateurs dans Auth
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Utilisateurs dans votre table
SELECT id, email, "supabaseAuthId", role, "createdAt" FROM public.users ORDER BY "createdAt" DESC;
```

Vérifications :
- Pour chaque utilisateur qui s’est **inscrit après** avoir mis en place le trigger : il doit y avoir une ligne dans `public.users` avec **le même `id`** que dans `auth.users` (ou un `supabaseAuthId` égal à cet `id`).
- Les comptes créés **avant** le trigger peuvent n’avoir qu’un `supabaseAuthId` rempli (lien fait au premier login).

---

## 3. Test en conditions réelles

### A. Nouvelle inscription (trigger)

1. Sur votre site : **page de connexion** → **« S’inscrire »**.
2. Utilisez un **nouvel email** (ex. `test-sync@example.com`) + mot de passe.
3. Inscription puis connexion (ou directement connexion si pas de confirmation email).
4. Dans **Supabase → SQL Editor** :

```sql
SELECT id, email FROM auth.users WHERE email = 'test-sync@example.com';
SELECT id, email FROM public.users WHERE email = 'test-sync@example.com';
```

Les deux **`id`** doivent être **identiques** (même UUID). Si oui, le trigger fonctionne.

### B. Connexion et vérification du token (app)

1. Allez sur la page **Connexion**.
2. Entrez un compte existant (Auth + si possible déjà présent dans `public.users`).
3. Ouvrez les **outils de développement** (F12) → onglet **Réseau / Network**.
4. Connectez-vous (bouton « Se connecter »).
5. Repérez la requête **`/api/auth/verify`** (méthode POST).

Vérifications :
- **Statut 200** : la vérification a réussi, l’auth et la sync sont OK.
- **Réponse** : `authenticated: true` et un objet `user` avec `id`, `email`, `role`.
- Si **401** : regardez le champ `error` dans la réponse (ex. `SUPABASE: ...` ou `BASE_DE_DONNÉES: ...`) et la checklist dans `ACTIONS_MANUELLES.md` (section « Connexion en production »).

### C. Vérification rapide en local

En local, après `npm run dev` :

1. Allez sur `http://localhost:3000/login`.
2. Connectez-vous avec un compte Supabase.
3. Si vous êtes redirigé (ex. `/admin`, `/user/dashboard`) sans message d’erreur → login et verify OK.

---

## 4. Récap : tout marche quand…

| Étape | Où | Résultat attendu |
|--------|-----|-------------------|
| Trigger présent | Supabase → SQL (étape 1) | `on_auth_user_created` sur `auth.users` |
| Nouvelle inscription | Site → S’inscrire | Même `id` dans `auth.users` et `public.users` |
| Connexion | Site → Se connecter | Requête `/api/auth/verify` en **200** |
| Réponse verify | Network → Response | `authenticated: true` + `user` avec `id`, `email`, `role` |

Si tout est vert, l’auth et la synchronisation Auth → `public.users` fonctionnent correctement.
