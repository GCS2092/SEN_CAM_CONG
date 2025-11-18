# SEC CAM CONG - Site Web Officiel

Site web moderne pour le groupe de musique SEC CAM CONG, construit avec Next.js 14, TypeScript, PostgreSQL et PWA.

## 🚀 Technologies

- **Next.js 14** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **PWA** - Progressive Web App avec next-pwa

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL (local ou sur Render)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet et installer les dépendances :**
```bash
npm install
```

2. **Configurer les variables d'environnement :**
```bash
cp .env.example .env
```

Éditez `.env` et configurez :
- `DATABASE_URL` : URL de connexion PostgreSQL (ex: `postgresql://user:password@host:5432/dbname`)
- `JWT_SECRET` : Clé secrète pour JWT (générez une clé aléatoire)

3. **Initialiser la base de données :**
```bash
npx prisma migrate dev --name init
```

Ou si vous préférez push directement :
```bash
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

## 📁 Structure du projet

```
├── app/                    # Pages et routes Next.js
│   ├── api/               # API Routes (backend)
│   ├── events/            # Page événements
│   ├── performances/      # Page performances
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── prisma.ts         # Client Prisma
│   └── utils.ts          # Fonctions utilitaires
├── prisma/               # Schéma Prisma
│   └── schema.prisma     # Modèles de base de données
└── public/               # Fichiers statiques
    └── manifest.json     # Manifest PWA
```

## 🗄️ Base de données

Le schéma Prisma inclut les modèles suivants :
- **User** - Utilisateurs (membres, admins, fans)
- **Event** - Événements (concerts, tournées)
- **Performance** - Performances passées
- **Media** - Médias (vidéos, images, audio)
- **Like** - Likes sur événements
- **Comment** - Commentaires sur événements

### Visualiser la base de données :
```bash
npm run db:studio
```

## 🚢 Déploiement sur Render

### 1. Base de données PostgreSQL

1. Créez une nouvelle base de données PostgreSQL sur Render
2. Copiez l'URL de connexion (DATABASE_URL)

### 2. Backend/Web Service

1. Créez un nouveau **Web Service** sur Render
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement :
   - `DATABASE_URL` : URL de votre base PostgreSQL Render
   - `JWT_SECRET` : Clé secrète JWT
   - `NODE_ENV` : `production`
4. Build Command : `npm run build`
5. Start Command : `npm start`

### 3. Variables d'environnement sur Render

Dans le dashboard Render, ajoutez :
```
DATABASE_URL=postgresql://...
JWT_SECRET=votre-secret-jwt
NODE_ENV=production
```

### 4. Migration de la base de données

Après le premier déploiement, exécutez les migrations :
```bash
npx prisma migrate deploy
```

Ou via Render Shell :
```bash
npx prisma db push
```

## 📱 PWA

Le site est configuré comme Progressive Web App. Les utilisateurs peuvent :
- Installer l'app sur leur appareil
- Accéder au contenu hors ligne (via Service Worker)
- Recevoir des notifications push (à configurer)

## 🔧 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Build de production
- `npm start` - Lancer le serveur de production
- `npm run db:migrate` - Créer une migration
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:studio` - Ouvrir Prisma Studio

## 📝 Notes

- Les icônes PWA (`icon-192x192.png`, `icon-512x512.png`) doivent être ajoutées dans le dossier `public/`
- Pour l'upload de médias, configurez Cloudinary ou un autre service de stockage
- Les liens sociaux dans le footer doivent être mis à jour avec vos vraies URLs

## 📄 Licence

Tous droits réservés © SEC CAM CONG

