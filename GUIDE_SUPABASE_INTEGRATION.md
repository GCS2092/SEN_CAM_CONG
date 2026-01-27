# Guide d'intégration Supabase pour SEC CAM CONG

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration Supabase](#configuration-supabase)
3. [Migration des données](#migration-des-données)
4. [Configuration du projet](#configuration-du-projet)
5. [Modification des API Routes](#modification-des-api-routes)
6. [Authentification Supabase](#authentification-supabase)
7. [Gestion des médias](#gestion-des-médias)
8. [Mise à jour des composants](#mise-à-jour-des-composants)
9. [Déploiement](#déploiement)
10. [Migration progressive](#migration-progressive)

---

## 🎯 Vue d'ensemble

Ce guide vous accompagne dans la migration de votre backend actuel (Prisma + PostgreSQL) vers **Supabase** tout en conservant votre frontend Next.js.

### Avantages de Supabase
- **Backend-as-a-Service** : Pas de gestion serveur
- **Base de données PostgreSQL** : Compatible avec votre schéma actuel
- **Authentification intégrée** : Auth sociale, magic links, etc.
- **Stockage de fichiers** : Gestion médias native
- **API temps réel** : WebSockets intégrés
- **Dashboard admin** : Interface de gestion

### Architecture cible

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Supabase     │    │   Supabase      │
│   Next.js       │◄──►│   API Gateway   │◄──►│   PostgreSQL    │
│   (Inchangé)    │    │   + Auth        │    │   + Storage     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔧 Configuration Supabase

### 1. Création du projet Supabase

```bash
# Créer un compte sur https://supabase.com
# Créer un nouveau projet
# Noter les informations de connexion :
# - Project URL
# - API Key (anon/public)
# - API Key (service_role/secret)
```

### 2. Configuration des tables

Dans le **SQL Editor** de Supabase, exécutez le script suivant :

```sql
-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Types énumérés
CREATE TYPE user_role AS ENUM ('FAN', 'ARTIST', 'ADMIN');
CREATE TYPE event_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- Table Users (utilise auth.users comme base)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role user_role DEFAULT 'FAN',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Events
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  ticket_url TEXT,
  price DECIMAL(10,2),
  status event_status DEFAULT 'UPCOMING',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Performances
CREATE TABLE public.performances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  setlist TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Media
CREATE TABLE public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type media_type NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Likes
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Table Comments
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_performances_updated_at BEFORE UPDATE ON public.performances
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### 3. Politiques RLS (Row Level Security)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politiques Events (lecture publique, écriture admin/artist)
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admin and Artist can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'ARTIST')
    )
  );

-- Politiques similaires pour les autres tables...
-- (Adaptez selon vos besoins de sécurité)
```

---

## 📦 Configuration du projet

### 1. Installation des dépendances Supabase

```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react
```

### 2. Variables d'environnement

Mettez à jour votre fichier `.env.local` :

```env
# Supprimer les anciennes variables Prisma
# DATABASE_URL=...
# JWT_SECRET=...

# Ajouter les variables Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Conserver les autres
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
SENTRY_DSN=your-sentry-dsn
```

### 3. Configuration client Supabase

Créez `lib/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'FAN' | 'ARTIST' | 'ADMIN'
          avatar: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'FAN' | 'ARTIST' | 'ADMIN'
          avatar?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'FAN' | 'ARTIST' | 'ADMIN'
          avatar?: string | null
          bio?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string
          image_url: string | null
          ticket_url: string | null
          price: number | null
          status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string | null
          date: string
          location: string
          image_url?: string | null
          ticket_url?: string | null
          price?: number | null
          status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
          featured?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          date?: string
          location?: string
          image_url?: string | null
          ticket_url?: string | null
          price?: number | null
          status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
          featured?: boolean
        }
      }
      // Ajoutez les autres tables...
    }
  }
}

// Client pour composants côté client
export const createClientSupabase = () =>
  createClientComponentClient<Database>()

// Client pour composants côté serveur
export const createServerSupabase = () =>
  createServerComponentClient<Database>({ cookies })

// Client admin (pour API routes)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

---

## 🔄 Modification des API Routes

### 1. Authentification

Remplacez `app/api/auth/login/route.ts` :

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      user: data.user,
      profile,
      session: data.session
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
```

### 2. Événements

Remplacez `app/api/events/route.ts` :

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const status = searchParams.get('status')
  const featured = searchParams.get('featured')

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    let query = supabase
      .from('events')
      .select(`
        *,
        likes(count),
        comments(count)
      `)
      .order('date', { ascending: true })
      .range((page - 1) * limit, page * limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: events, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      events,
      totalCount: count,
      hasMore: page * limit < (count || 0)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Vérifier l'authentification et les permissions
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['ADMIN', 'ARTIST'].includes(profile.role)) {
    return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
  }

  try {
    const eventData = await request.json()

    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
```

---

## 🔐 Authentification Supabase

### 1. Mise à jour du layout principal

Modifiez `app/layout.tsx` :

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthProvider from '@/components/AuthProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body>
        <AuthProvider session={session}>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BottomNav />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Provider d'authentification

Créez `components/AuthProvider.tsx` :

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, User } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Database['public']['Tables']['profiles']['Row'] | null
  session: Session | null
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({
  children,
  session: initialSession
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [user, setUser] = useState<User | null>(initialSession?.user || null)
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true)
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
        setLoading(false)
      } else {
        setProfile(null)
      }
    }

    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [user, supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## 📁 Gestion des médias

### 1. Configuration du storage Supabase

Dans le dashboard Supabase, créez un bucket pour vos médias :

```sql
-- Créer le bucket 'media'
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Politique pour lecture publique
CREATE POLICY "Media files are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
```

### 2. Composant d'upload

Modifiez `components/ImageUpload.tsx` :

```typescript
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from './AuthProvider'

interface ImageUploadProps {
  onUpload: (url: string) => void
  bucket?: string
  folder?: string
}

export default function ImageUpload({ 
  onUpload, 
  bucket = 'media', 
  folder = 'uploads' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUpload(data.publicUrl)
    } catch (error) {
      alert('Error uploading image!')
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <label htmlFor="single" className="block text-sm font-medium">
        Upload Image
      </label>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
      />
      <label
        htmlFor="single"
        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        {uploading ? 'Uploading...' : 'Choose Image'}
      </label>
    </div>
  )
}
```

---

## 🔄 Mise à jour des composants

### 1. Hook personnalisé pour les événements

Créez `hooks/useEvents.ts` :

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase'

type Event = Database['public']['Tables']['events']['Row'] & {
  likes: { count: number }[]
  comments: { count: number }[]
}

export function useEvents(options?: {
  status?: string
  featured?: boolean
  limit?: number
}) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from('events')
          .select(`
            *,
            likes(count),
            comments(count)
          `)
          .order('date', { ascending: true })

        if (options?.status) {
          query = query.eq('status', options.status)
        }

        if (options?.featured !== undefined) {
          query = query.eq('featured', options.featured)
        }

        if (options?.limit) {
          query = query.limit(options.limit)
        }

        const { data, error } = await query

        if (error) throw error

        setEvents(data || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [options?.status, options?.featured, options?.limit])

  const refetch = () => {
    setLoading(true)
    // Re-trigger useEffect
  }

  return { events, loading, error, refetch }
}
```

### 2. Mise à jour du composant EventsSection

Modifiez `components/EventsSection.tsx` :

```typescript
'use client'

import { useEvents } from '@/hooks/useEvents'
import EventCard from './EventCard'
import { Skeleton } from './ui/Skeleton'

interface EventsSectionProps {
  title?: string
  featured?: boolean
  limit?: number
  status?: string
}

export default function EventsSection({
  title = "Événements à venir",
  featured,
  limit = 6,
  status = "UPCOMING"
}: EventsSectionProps) {
  const { events, loading, error } = useEvents({
    status,
    featured,
    limit
  })

  if (error) {
    return (
      <div className="text-center text-red-600">
        Erreur lors du chargement des événements : {error}
      </div>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {title}
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Aucun événement trouvé.
          </div>
        )}
      </div>
    </section>
  )
}
```

---

## 🚀 Déploiement

### 1. Variables d'environnement production

Sur votre plateforme de déploiement (Vercel, Render, etc.), ajoutez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Configuration DNS (optionnel)

Pour utiliser un domaine personnalisé avec Supabase :

1. Dans les paramètres Supabase, configurez l'URL personnalisée
2. Ajoutez les enregistrements DNS nécessaires
3. Mettez à jour `NEXT_PUBLIC_SUPABASE_URL`

---

## 🔄 Migration progressive

### Plan de migration en étapes

1. **Phase 1 : Préparation**
   - Configurer Supabase
   - Migrer le schéma de base de données
   - Tester les connexions

2. **Phase 2 : Migration des données**
   - Exporter les données existantes
   - Importer dans Supabase
   - Vérifier l'intégrité

3. **Phase 3 : Migration du code**
   - Remplacer Prisma par Supabase client
   - Migrer API route par API route
   - Tester chaque fonctionnalité

4. **Phase 4 : Authentification**
   - Migrer vers Supabase Auth
   - Tester tous les workflows
   - Mise à jour des guards

5. **Phase 5 : Médias**
   - Configurer Supabase Storage
   - Migrer les fichiers existants
   - Tester l'upload

6. **Phase 6 : Tests et déploiement**
   - Tests complets
   - Déploiement staging
   - Déploiement production

### Script de migration des données

```javascript
// scripts/migrate-to-supabase.js
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrateUsers() {
  console.log('Migration des utilisateurs...')
  
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'temp-password-to-reset', // L'utilisateur devra reset
      email_confirm: true
    })

    if (authError) {
      console.error('Erreur création user:', authError)
      continue
    }

    // Créer le profil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      })

    if (profileError) {
      console.error('Erreur création profil:', profileError)
    }
  }
  
  console.log(`${users.length} utilisateurs migrés`)
}

async function migrateEvents() {
  console.log('Migration des événements...')
  
  const events = await prisma.event.findMany()
  
  const { error } = await supabase
    .from('events')
    .insert(events.map(event => ({
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      image_url: event.imageUrl,
      ticket_url: event.ticketUrl,
      price: event.price,
      status: event.status,
      featured: event.featured
    })))

  if (error) {
    console.error('Erreur migration événements:', error)
  } else {
    console.log(`${events.length} événements migrés`)
  }
}

// Exécuter les migrations
async function main() {
  try {
    await migr