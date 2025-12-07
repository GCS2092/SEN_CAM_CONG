# Analyse des problèmes de performance - Événements

## Problèmes identifiés

### 1. Requêtes avec relations multiples
Les requêtes chargent plusieurs relations à chaque fois :
- `user` (avec select)
- `_count` pour likes et comments
- `performances` avec `media` (dans getEvent)

**Impact** : Chaque requête fait plusieurs JOINs, ce qui ralentit l'exécution.

### 2. Recherches textuelles sans index
Les recherches utilisent `contains` avec `mode: 'insensitive'` :
```typescript
{ title: { contains: search, mode: 'insensitive' } }
```

**Impact** : Sans index full-text, PostgreSQL doit scanner toute la table.

### 3. Rate limiting en mémoire
Le rate limiting utilise un store en mémoire (`RateLimitStore`), ce qui :
- Ne fonctionne pas avec plusieurs instances (Vercel)
- Perd les données au redémarrage
- Peut causer des problèmes de synchronisation

### 4. Pas de pagination par défaut
Quand `limit` n'est pas spécifié, la pagination par défaut est de 10, mais certaines requêtes peuvent charger tous les événements.

### 5. Requêtes N+1 potentielles
Dans `getEvent`, on charge `performances` avec `media`, ce qui peut créer des requêtes multiples.

## Solutions proposées

### 1. Optimiser les requêtes avec select minimal
```typescript
// Au lieu de include, utiliser select pour ne charger que ce qui est nécessaire
prisma.event.findMany({
  select: {
    id: true,
    title: true,
    date: true,
    location: true,
    status: true,
    // ... seulement les champs nécessaires
  }
})
```

### 2. Ajouter des index pour les recherches
```prisma
model Event {
  // ... champs existants
  
  @@index([title(ops: Raw("gin_trgm_ops"))]) // Index GIN pour recherche textuelle
  @@index([location(ops: Raw("gin_trgm_ops"))])
  @@index([status, date]) // Index composite pour les filtres courants
}
```

### 3. Utiliser Redis pour le rate limiting
Remplacer le store en mémoire par Redis (disponible sur Vercel via Upstash).

### 4. Implémenter la mise en cache
Utiliser Next.js cache ou Redis pour mettre en cache les listes d'événements.

### 5. Limiter les relations chargées
Ne charger les relations que si nécessaire (ex: ne charger `performances` que sur la page de détail).

## Actions immédiates

1. ✅ **Suppression des événements** - Terminé
2. ⏳ **Optimiser les requêtes GET** - À faire
3. ⏳ **Ajouter des index de recherche** - À faire
4. ⏳ **Implémenter Redis pour rate limiting** - À faire
5. ⏳ **Ajouter la mise en cache** - À faire

