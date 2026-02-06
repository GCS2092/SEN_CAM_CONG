// Données de fallback pour éviter les erreurs de base de données
export const fallbackEvents = [
  {
    id: "1",
    title: "Concert d'ouverture - Paris",
    description: "Première représentation de notre tournée européenne avec un mélange unique de sonorités sénégalaises, camerounaises et congolaises.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans 30 jours
    location: "Paris, France",
    venue: "Olympia",
    imageUrl: "/placeholder.svg",
    ticketUrl: "https://example.com/tickets",
    price: 45,
    status: "UPCOMING",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Festival Afro-Fusion - Londres",
    description: "Une soirée exceptionnelle célébrant la diversité musicale africaine dans un cadre intimiste.",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Dans 45 jours
    location: "Londres, UK",
    venue: "Royal Festival Hall",
    imageUrl: "/placeholder.svg",
    ticketUrl: "https://example.com/tickets",
    price: 55,
    status: "UPCOMING",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Soirée Acoustique - Bruxelles",
    description: "Concert acoustique mettant en valeur les instruments traditionnels africains dans une version moderne.",
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Dans 60 jours
    location: "Bruxelles, Belgique",
    venue: "Ancienne Belgique",
    imageUrl: "/placeholder.svg",
    ticketUrl: "https://example.com/tickets",
    price: 40,
    status: "UPCOMING",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Grande Finale - Amsterdam",
    description: "Concert final de notre tournée avec invités spéciaux et surprises musicales.",
    date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // Dans 75 jours
    location: "Amsterdam, Pays-Bas",
    venue: "Concertgebouw",
    imageUrl: "/placeholder.svg",
    ticketUrl: "https://example.com/tickets",
    price: 65,
    status: "UPCOMING",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const fallbackPerformances = [
  {
    id: "1",
    title: "Festival des Cultures Africaines",
    venue: "Parc de la Villette, Paris",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 60 jours
    description: "Performance exceptionnelle devant 15,000 spectateurs lors du plus grand festival africain d'Europe.",
    imageUrl: "/placeholder.svg",
    videoUrl: "https://youtube.com/watch?v=example",
    setlist: "Ouverture Sénégalaise, Rythmes du Cameroun, Finale Congolaise",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Concert Privé - Ambassade du Sénégal",
    venue: "Ambassade du Sénégal, Paris",
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 90 jours
    description: "Performance exclusive pour célébrer l'indépendance du Sénégal avec des dignitaires internationaux.",
    imageUrl: "/placeholder.svg",
    videoUrl: "https://youtube.com/watch?v=example",
    setlist: "Hymnes Traditionnels, Fusion Moderne, Danse Sabar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "World Music Festival - Berlin",
    venue: "Tempodrom, Berlin",
    date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 120 jours
    description: "Collaboration internationale avec des musiciens de 12 pays différents.",
    imageUrl: "/placeholder.svg",
    videoUrl: "https://youtube.com/watch?v=example",
    setlist: "Ouverture Multiculturelle, Solo Kora, Grand Finale",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Soirée Caritative - Dakar",
    venue: "Centre Culturel Blaise Senghor, Dakar",
    date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 150 jours
    description: "Concert caritatif pour soutenir l'éducation musicale dans les écoles sénégalaises.",
    imageUrl: "/placeholder.svg",
    videoUrl: "https://youtube.com/watch?v=example",
    setlist: "Musique pour l'Éducation, Chants Traditionnels, Espoir Futur",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const fallbackMedia = [
  {
    id: "1",
    title: "Photo de Groupe - Studio",
    type: "IMAGE",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    description: "Photo officielle du groupe en studio d'enregistrement",
    tags: ["groupe", "studio", "officiel"],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Concert Live - Paris",
    type: "IMAGE",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    description: "Performance live lors du concert parisien",
    tags: ["concert", "live", "paris"],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Instruments Traditionnels",
    type: "IMAGE",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg",
    description: "Collection d'instruments traditionnels africains utilisés par le groupe",
    tags: ["instruments", "traditionnel", "africain"],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const fallbackSiteSettings = {
  hero_background_image: { value: "/placeholder.svg" },
  hero_title: { value: "SEN CAM CONG" },
  hero_subtitle: { value: "La fusion musicale du Sénégal, du Cameroun et du Congo" }
};

// Fonction utilitaire pour paginer les résultats
export function paginateArray<T>(array: T[], page: number = 1, limit: number = 10): {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);
  const totalCount = array.length;
  const totalPages = Math.ceil(totalCount / limit);
  const hasMore = page < totalPages;

  return {
    items,
    totalCount,
    hasMore,
    totalPages
  };
}

// Fonction utilitaire pour filtrer les événements
export function filterEvents(
  events: typeof fallbackEvents,
  status?: string,
  featured?: boolean
): typeof fallbackEvents {
  return events.filter(event => {
    if (status && event.status !== status) return false;
    if (featured !== undefined && event.featured !== featured) return false;
    return true;
  });
}

// Fonction utilitaire pour trier par date
export function sortByDate<T extends { date: string }>(items: T[], ascending: boolean = true): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
