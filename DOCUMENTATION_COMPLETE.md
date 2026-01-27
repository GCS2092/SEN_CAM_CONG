# SEC CAM CONG - Documentation Complète

## 📋 Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Technologies utilisées](#technologies-utilisées)
4. [Structure du projet](#structure-du-projet)
5. [Base de données](#base-de-données)
6. [API Routes](#api-routes)
7. [Composants principaux](#composants-principaux)
8. [Fonctionnalités](#fonctionnalités)
9. [Système d'authentification](#système-dauthentification)
10. [PWA et Performance](#pwa-et-performance)
11. [Installation et déploiement](#installation-et-déploiement)
12. [Scripts utilitaires](#scripts-utilitaires)
13. [Sécurité](#sécurité)
14. [Maintenance et évolution](#maintenance-et-évolution)

---

## 🎯 Vue d'ensemble du projet

**SEC CAM CONG** est une application web moderne dédiée au groupe de musique du même nom. Le projet combine un site vitrine avec des fonctionnalités interactives avancées, offrant une expérience utilisateur riche et engageante.

### Objectifs principaux
- **Visibilité** : Promouvoir le groupe et ses activités
- **Engagement** : Créer une communauté autour de la musique
- **Gestion** : Fournir des outils d'administration pour les membres
- **Performance** : Assurer une expérience utilisateur optimale sur tous les appareils

### Public cible
- **Fans** : Découvrir la musique, suivre les événements
- **Membres du groupe** : Gérer le contenu et interagir avec les fans
- **Administrateurs** : Supervision complète du site

---

## 🏗️ Architecture technique

L'application suit une architecture **full-stack moderne** basée sur Next.js avec une approche **API-first**.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Web    │◄──►│   Next.js App   │◄──►│   PostgreSQL    │
│                 │    │   (SSR + API)   │    │   (Prisma ORM)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PWA Service   │    │   API Routes    │    │   File Storage  │
│    Worker       │    │   + Auth JWT    │    │  (Vercel Blob)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Principes architecturaux
- **Séparation des préoccupations** : Frontend, Backend, Base de données
- **Composants réutilisables** : Architecture modulaire
- **API RESTful** : Communication standardisée
- **Responsive Design** : Adaptatif mobile-first
- **Progressive Enhancement** : Fonctionnalités progressives

---

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 14.0.4 | Framework React avec SSR/SSG |
| **React** | 18.2.0 | Bibliothèque UI |
| **TypeScript** | 5.3.3 | Typage statique |
| **Tailwind CSS** | 3.4.0 | Framework CSS utilitaire |
| **Framer Motion** | 10.16.16 | Animations et transitions |
| **React Query** | 5.90.10 | Gestion état serveur |
| **SWR** | 2.3.6 | Fetching de données |

### Backend & Base de données
| Technologie | Version | Rôle |
|-------------|---------|------|
| **Prisma** | 6.19.0 | ORM PostgreSQL |
| **PostgreSQL** | - | Base de données relationnelle |
| **JWT** | 9.0.2 | Authentification |
| **bcryptjs** | 2.4.3 | Hashage mots de passe |
| **Vercel Blob** | 0.25.0 | Stockage fichiers |

### Outils & Qualité
| Technologie | Version | Rôle |
|-------------|---------|------|
| **ESLint** | 8.56.0 | Linting code |
| **Sentry** | 10.25.0 | Monitoring erreurs |
| **Zod** | 3.22.4 | Validation schémas |
| **next-pwa** | 5.6.0 | Progressive Web App |

---

## 📁 Structure du projet

```
SEC_CAM_CONG/
├── 📁 app/                    # Pages et routes (App Router)
│   ├── 📁 about/              # Page À propos
│   ├── 📁 admin/              # Interface administration
│   │   ├── 📁 events/         # Gestion événements
│   │   ├── 📁 members/        # Gestion membres
│   │   └── 📁 media/          # Gestion médias
│   ├── 📁 api/                # API Routes (Backend)
│   │   ├── 📁 auth/           # Authentification
│   │   ├── 📁 events/         # CRUD événements
│   │   ├── 📁 users/          # Gestion utilisateurs
│   │   └── 📁 media/          # Upload/gestion médias
│   ├── 📁 artist/             # Interface artiste
│   ├── 📁 events/             # Pages événements publiques
│   ├── 📁 gallery/            # Galerie médias
│   ├── 📁 login/              # Authentification utilisateur
│   ├── 📁 members/            # Page membres du groupe
│   ├── 📁 performances/       # Performances passées
│   ├── 📁 user/               # Profil utilisateur
│   ├── 📄 globals.css         # Styles globaux
│   ├── 📄 layout.tsx          # Layout racine
│   └── 📄 page.tsx            # Page d'accueil
├── 📁 components/             # Composants réutilisables
│   ├── 📄 AdminGuard.tsx      # Protection routes admin
│   ├── 📄 ArtistGuard.tsx     # Protection routes artiste
│   ├── 📄 BottomNav.tsx       # Navigation mobile
│   ├── 📄 CommentsSection.tsx # Système commentaires
│   ├── 📄 EventsSection.tsx   # Affichage événements
│   ├── 📄 Footer.tsx          # Pied de page
│   ├── 📄 Hero.tsx            # Section héro
│   ├── 📄 Navbar.tsx          # Navigation principale
│   └── ...                   # Autres composants
├── 📁 hooks/                  # Custom hooks React
├── 📁 lib/                    # Utilitaires et configuration
│   ├── 📄 prisma.ts          # Client Prisma
│   ├── 📄 auth.ts            # Utilitaires authentification
│   └── 📄 utils.ts           # Fonctions utilitaires
├── 📁 prisma/                 # Schéma et migrations DB
│   ├── 📄 schema.prisma      # Modèles de données
│   └── 📁 migrations/        # Migrations SQL
├── 📁 public/                 # Fichiers statiques
│   ├── 📄 manifest.json      # Manifest PWA
│   ├── 🖼️ icons/             # Icônes PWA
│   └── 🖼️ images/            # Images statiques
├── 📁 scripts/                # Scripts utilitaires
│   ├── 📄 create-admin.js    # Création admin
│   ├── 📄 seed-events.js     # Données test événements
│   └── ...                   # Autres scripts
└── 📄 Configuration files     # Next.js, TypeScript, etc.
```

---

## 🗄️ Base de données

### Schéma Prisma

L'application utilise **PostgreSQL** avec **Prisma ORM** pour une gestion type-safe des données.

#### Modèles principaux

```prisma
// Utilisateurs du système
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  password    String
  role        Role     @default(FAN)
  avatar      String?
  bio         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  likes       Like[]
  comments    Comment[]
}

// Événements (concerts, tournées)
model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  date        DateTime
  location    String
  imageUrl    String?
  ticketUrl   String?
  price       Float?
  status      EventStatus @default(UPCOMING)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  likes       Like[]
  comments    Comment[]
}

// Performances passées
model Performance {
  id          String   @id @default(cuid())
  title       String
  venue       String
  date        DateTime
  description String?
  imageUrl    String?
  videoUrl    String?
  setlist     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Médias (photos, vidéos, audio)
model Media {
  id          String    @id @default(cuid())
  title       String
  type        MediaType
  url         String
  thumbnail   String?
  description String?
  tags        String[]
  featured    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Types et Enums

```prisma
enum Role {
  FAN
  ARTIST
  ADMIN
}

enum EventStatus {
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
}
```

### Relations et contraintes

- **User ↔ Like** : Un utilisateur peut liker plusieurs événements
- **User ↔ Comment** : Un utilisateur peut commenter plusieurs événements
- **Event ↔ Like/Comment** : Un événement peut avoir plusieurs likes/commentaires
- **Indexes** : Optimisés sur les champs fréquemment requêtés (date, status, featured)

---

## 🔌 API Routes

L'application expose une API RESTful complète via Next.js API Routes.

### Authentification

```typescript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
// Response: { token, user }

// POST /api/auth/register
{
  "email": "user@example.com", 
  "name": "User Name",
  "password": "password"
}

// GET /api/auth/me
// Headers: Authorization: Bearer <token>
// Response: { user }
```

### Événements

```typescript
// GET /api/events
// Query: ?page=1&limit=10&status=UPCOMING&featured=true
// Response: { events[], totalCount, hasMore }

// POST /api/events (Admin/Artist only)
{
  "title": "Concert Title",
  "description": "Description",
  "date": "2024-01-15T20:00:00Z",
  "location": "Venue Name",
  "price": 25.00
}

// PUT /api/events/[id]
// DELETE /api/events/[id]
```

### Médias

```typescript
// GET /api/media
// Query: ?type=IMAGE&featured=true&page=1
// Response: { media[], totalCount }

// POST /api/media/upload (Admin/Artist only)
// Form-data: file, title, description, type, tags[]

// DELETE /api/media/[id]
```

### Interactions sociales

```typescript
// POST /api/events/[id]/like
// DELETE /api/events/[id]/like

// GET /api/events/[id]/comments
// POST /api/events/[id]/comments
{
  "content": "Comment text"
}

// DELETE /api/comments/[id]
```

---

## 🧩 Composants principaux

### Structure des composants

L'application utilise une architecture de composants modulaire et réutilisable.

#### Composants de layout

```typescript
// Layout principal avec navigation
<RootLayout>
  <Navbar />
  <main>{children}</main>
  <Footer />
  <BottomNav /> // Mobile only
</RootLayout>
```

#### Composants de contenu

**Hero Section**
```typescript
<Hero 
  title="SEC CAM CONG"
  subtitle="Musique Fusion Moderne"
  backgroundImage="/hero-bg.jpg"
  ctaButton={{ text: "Découvrir", href: "/about" }}
/>
```

**Events Section**
```typescript
<EventsSection 
  events={upcomingEvents}
  showPagination={true}
  itemsPerPage={6}
  enableLikes={true}
  enableComments={true}
/>
```

**Media Gallery**
```typescript
<MediaGallery 
  media={mediaItems}
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  lightbox={true}
  lazyLoading={true}
/>
```

#### Composants d'interaction

**Like Button**
```typescript
<LikeButton 
  eventId={event.id}
  initialLikes={event._count.likes}
  userHasLiked={event.userHasLiked}
  onLikeChange={handleLikeChange}
/>
```

**Comments Section**
```typescript
<CommentsSection 
  eventId={event.id}
  allowComments={true}
  maxComments={50}
  enableReplies={false}
/>
```

#### Composants d'authentification

```typescript
// Protection des routes
<AdminGuard>
  <AdminDashboard />
</AdminGuard>

<ArtistGuard>
  <ArtistPanel />
</ArtistGuard>
```

---

## ⚡ Fonctionnalités

### Fonctionnalités publiques

1. **Page d'accueil**
   - Hero section animée
   - Événements à venir
   - Performances récentes
   - Call-to-actions

2. **Événements**
   - Liste paginée des événements
   - Filtrage par statut et date
   - Détails avec localisation
   - Système de likes et commentaires

3. **Galerie**
   - Photos et vidéos du groupe
   - Lightbox pour visualisation
   - Tri par type de média
   - Lazy loading optimisé

4. **À propos**
   - Histoire du groupe
   - Membres et leurs rôles
   - Discographie
   - Réseaux sociaux

### Fonctionnalités authentifiées

1. **Profil utilisateur**
   - Gestion informations personnelles
   - Historique des interactions
   - Événements likés/commentés

2. **Interface Artiste**
   - Upload de médias
   - Création d'événements
   - Modération commentaires
   - Statistiques engagement

3. **Interface Admin**
   - Gestion complète utilisateurs
   - CRUD complet événements
   - Gestion médias et galerie
   - Analytics et rapports
   - Configuration site

### Fonctionnalités PWA

1. **Installation**
   - Installable sur mobile/desktop
   - Icônes adaptatives
   - Splash screen personnalisé

2. **Hors ligne**
   - Service Worker
   - Cache des pages principales
   - Synchronisation différée

3. **Performance**
   - Lazy loading images
   - Code splitting
   - Prefetching intelligent

---

## 🔐 Système d'authentification

### Architecture JWT

L'authentification utilise **JSON Web Tokens** avec une approche stateless.

```typescript
// Structure du token JWT
interface JWTPayload {
  userId: string;
  email: string;
  role: 'FAN' | 'ARTIST' | 'ADMIN';
  iat: number;  // Issued at
  exp: number;  // Expiration
}
```

### Flux d'authentification

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    
    Client->>API: POST /api/auth/login
    API->>Database: Vérifier credentials
    Database->>API: Utilisateur valide
    API->>API: Générer JWT token
    API->>Client: { token, user }
    Client->>Client: Stocker token (localStorage)
    
    Client->>API: GET /api/protected (Authorization: Bearer <token>)
    API->>API: Vérifier & décoder token
    API->>Client: Données protégées
```

### Sécurité

1. **Hashage mots de passe** : bcrypt avec salt
2. **Tokens signés** : HMAC SHA-256
3. **Expiration** : Tokens valides 7 jours
4. **Validation côté client/serveur**
5. **Protection CSRF** : SameSite cookies
6. **Rate limiting** : Protection brute force

### Middleware d'authentification

```typescript
export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
```

---

## 📱 PWA et Performance

### Configuration PWA

L'application est configurée comme **Progressive Web App** complète.

```javascript
// next.config.js - Configuration PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});
```

### Manifest PWA

```json
{
  "name": "SEC CAM CONG",
  "short_name": "SCC",
  "description": "Site officiel du groupe SEC CAM CONG",
  "theme_color": "#1f2937",
  "background_color": "#111827",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Optimisations Performance

1. **Images optimisées**
   - Next.js Image component
   - WebP/AVIF formats
   - Responsive images
   - Lazy loading

2. **Code splitting**
   - Routes automatiques
   - Dynamic imports
   - Bundle analysis

3. **Caching**
   - Service Worker
   - API Response caching
   - Static assets CDN

4. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## 🚀 Installation et déploiement

### Installation locale

```bash
# 1. Cloner le projet
git clone <repository-url>
cd SEC_CAM_CONG

# 2. Installer les dépendances
npm install

# 3. Configuration environnement
cp .env.example .env
# Configurer DATABASE_URL, JWT_SECRET, etc.

# 4. Base de données
npx prisma migrate dev
npx prisma generate

# 5. Création admin initial
npm run create-admin

# 6. Données de test (optionnel)
npm run seed-events

# 7. Lancement développement
npm run dev
```

### Déploiement Production

#### Option 1: Render (Recommandé)

```yaml
# render.yaml
services:
  - type: web
    name: sec-cam-cong
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

#### Option 2: Vercel

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod

# Variables d'environnement via dashboard Vercel
```

#### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Authentification
JWT_SECRET="your-super-secret-key-here"

# Stockage fichiers (optionnel)
BLOB_READ_WRITE_TOKEN="vercel-blob-token"

# Monitoring (optionnel)
SENTRY_DSN="https://your-sentry-dsn"

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID="GA-TRACKING-ID"
```

---

## 🛠️ Scripts utilitaires

L'application inclut de nombreux scripts pour faciliter la gestion.

### Scripts de base de données

```bash
# Migrations
npm run db:migrate     # Créer nouvelle migration
npm run db:push        # Pousser schéma vers DB
npm run db:studio      # Interface graphique Prisma

# Administration
npm run create-admin          # Créer administrateur
npm run check-admin          # Vérifier admin existe
npm run update-admin-email   # Modifier email admin

# Données de test
npm run seed-events          # Événements avec images web
npm run seed-events-local    # Événements avec images locales
npm run clear-events         # Supprimer tous événements
```

### Scripts de développement

```bash
# Développement
npm run dev              # Serveur développement
npm run build           # Build production
npm run start           # Serveur production
npm run lint            # Vérifier code

# Tests et diagnostic
npm run test-db         # Tester connexion DB
npm run check-images    # Vérifier images en DB
```

### Scripts de déploiement

```bash
# Images et médias
npm run upload-images-to-blob    # Upload vers Vercel Blob
npm run assign-images           # Assigner images uniques

# Configuration
npm run seed-social-links       # Liens réseaux sociaux
```

---

## 🔒 Sécurité

### Mesures de sécurité implémentées

1. **Authentification sécurisée**
   - Mots de passe hashés (bcrypt)
   - Tokens JWT signés
   - Expiration automatique
   - Validation stricte

2. **Protection des données**
   - Validation Zod côté serveur
   - Sanitisation des entrées
   - Protection XSS
   - CSRF protection

3. **Contrôle d'accès**
   - Rôles utilisateurs (FAN, ARTIST, ADMIN)
   - Guards sur les routes
   - Middleware d'autorisation
   - API endpoints protégés

4. **Sécurité réseau**
   - HTTPS obligatoire
   - Headers de sécurité
   - Rate limiting
   - CORS configuré

### Bonnes pratiques appliquées

```typescript
// Exemple validation Zod
const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  date: z.date().min(new Date()),
  location: z.string().min(1).max(300),
  price: z.number().positive().optional(),
});

// Sanitisation automatique
const sanitizedInput = DOMPurify.sanitize(userInput);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});
```

---

## 🔧 Maintenance et évolution

### Monitoring et logs

1. **Sentry** : Tracking erreurs production
2. **Console logs** : Développement et debug
3. **Database logs** : Prisma query monitoring
4. **Performance** : Core Web Vitals

### Mises à jour

```bash
# Dépendances
npm audit                # Vérifier vulnérabilités
npm update              # Mettre à jour dépendances
npm outdated            # Voir dépendances obsolètes

# Base de données
npx prisma db push      # Appliquer changements schéma
npx prisma migrate deploy  # Production migrations
```

### Sauvegarde

```bash
# Sauvegarde base de données
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Sauvegarde médias
# Automatique avec Vercel Blob
```

### Évolutions futures suggérées

1. **Fonctionnalités**
   - Système de newsletters
   - Boutique en ligne (merch)
   - Live streaming intégré
   - Chat en temps réel
   - Système de réservations

2. **Technique**
   - Migration vers App Router complet
   - GraphQL API
   - WebSockets pour temps réel
   - Tests automatisés (Jest, Cypress)
   - CI/CD pipeline

3. **Performance**
   - CDN pour médias
   - Cache Redis
   - Database read replicas
   - Edge computing

---

## 📞 Support et Contact

### Documentation technique
- **Prisma Docs** : https://prisma.io/docs
- **Next.js Docs** : https://nextjs.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs

### Ressources utiles
- **TypeScript** : https://typescriptlang.org/docs
- **Framer Motion** : https://framer.com/motion
- **React Query** : https://tanstack.com/query

### Dépannage courant

**Erreur de connexion DB :**
```bash
npm run test-db
# Vérifier DATABASE_URL dans .env
```

**Erreur JWT :**
```bash
# Vérifier JWT_SECRET défini
echo $JWT_SECRET
```

**Images manquantes :**
```bash
npm run check-images
npm run assign-images
```

---

*Documentation générée le : 2024*
*Version du projet : 1.0.0*
*Auteur : Équipe SEC CAM CONG*