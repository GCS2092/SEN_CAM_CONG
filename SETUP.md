# 🚀 Guide de Démarrage Rapide

Bienvenue ! Votre projet SEC CAM CONG est maintenant configuré avec toutes les technologies recommandées.

## ✅ Ce qui a été créé

### Structure du Projet
- ✅ Next.js 14 avec TypeScript
- ✅ Tailwind CSS + Framer Motion
- ✅ Prisma avec schéma PostgreSQL complet
- ✅ PWA configurée (next-pwa)
- ✅ API Routes pour backend
- ✅ Pages principales (Accueil, Événements, Performances, Galerie, À propos)
- ✅ Configuration pour déploiement Render

### Fonctionnalités
- ✅ Gestion des événements (concerts, tournées)
- ✅ Gestion des performances (vidéos, photos)
- ✅ Galerie multimédia
- ✅ Design responsive et moderne
- ✅ Animations fluides avec Framer Motion
- ✅ SEO optimisé

## 📦 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer l'environnement :**
```bash
cp .env.example .env
```

Éditez `.env` et configurez :
- `DATABASE_URL` : URL de votre base PostgreSQL
- `JWT_SECRET` : Générez une clé secrète (ex: `openssl rand -base64 32`)

3. **Initialiser la base de données :**
```bash
# Option 1 : Migration (recommandé pour production)
npx prisma migrate dev --name init

# Option 2 : Push direct (pour développement rapide)
npx prisma db push
```

4. **Générer le client Prisma :**
```bash
npx prisma generate
```

5. **Lancer le serveur de développement :**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `tailwind.config.ts`. Modifiez la palette `primary` pour changer le thème.

### Icônes PWA
Ajoutez vos icônes dans `public/` :
- `icon-192x192.png`
- `icon-512x512.png`

Voir `public/ICONS_README.md` pour plus de détails.

### Contenu
- Modifiez les textes dans les composants (`components/`)
- Ajoutez vos vraies URLs sociales dans `components/Footer.tsx`
- Personnalisez le contenu de la page "À propos" dans `app/about/page.tsx`

## 🗄️ Base de Données

### Visualiser les données
```bash
npm run db:studio
```

### Modèles disponibles
- **User** : Utilisateurs (membres, admins, fans)
- **Event** : Événements (concerts, tournées)
- **Performance** : Performances passées
- **Media** : Médias (vidéos, images, audio)
- **Like** : Likes sur événements
- **Comment** : Commentaires sur événements

## 📡 API Routes

### Événements
- `GET /api/events` - Liste des événements
- `GET /api/events/[id]` - Détails d'un événement
- `POST /api/events` - Créer un événement
- `PUT /api/events/[id]` - Modifier un événement
- `DELETE /api/events/[id]` - Supprimer un événement

### Performances
- `GET /api/performances` - Liste des performances
- `GET /api/performances/[id]` - Détails d'une performance
- `POST /api/performances` - Créer une performance
- `PUT /api/performances/[id]` - Modifier une performance
- `DELETE /api/performances/[id]` - Supprimer une performance

### Médias
- `GET /api/media` - Liste des médias
- `POST /api/media` - Ajouter un média

## 🚢 Déploiement sur Render

Consultez `DEPLOY.md` pour un guide détaillé du déploiement sur Render.

### Étapes rapides :
1. Créez une base PostgreSQL sur Render
2. Créez un Web Service et connectez votre repo
3. Configurez les variables d'environnement
4. Exécutez les migrations : `npx prisma migrate deploy`

## 📝 Prochaines Étapes

### À faire immédiatement :
1. ✅ Ajouter les icônes PWA (`icon-192x192.png`, `icon-512x512.png`)
2. ✅ Configurer votre `DATABASE_URL` dans `.env`
3. ✅ Initialiser la base de données
4. ✅ Personnaliser les textes et contenus

### Améliorations futures :
- [ ] Ajouter l'authentification (JWT ou NextAuth)
- [ ] Implémenter l'upload de médias (Cloudinary, AWS S3)
- [ ] Ajouter les notifications push pour la PWA
- [ ] Créer un dashboard admin
- [ ] Ajouter un système de commentaires interactif
- [ ] Intégrer les APIs YouTube, Spotify, etc.

## 🐛 Dépannage

### Erreur "Prisma Client not generated"
```bash
npx prisma generate
```

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correct dans `.env`
- Vérifiez que PostgreSQL est démarré (si local)

### Erreur de build
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Framer Motion](https://www.framer.com/motion/)
- [Documentation Render](https://render.com/docs)

## 🎉 C'est parti !

Votre site est prêt. Bon développement ! 🚀

