const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const testEvents = [
  {
    title: "Concert au Zénith de Paris",
    description: "Venez assister à notre grand concert au Zénith de Paris ! Une soirée inoubliable avec tous nos plus grands hits et quelques surprises. Ouverture des portes à 19h, début du concert à 20h30.",
    date: new Date("2024-07-15T20:30:00Z"),
    location: "Paris",
    venue: "Zénith de Paris",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    externalUrl: "https://www.fnac.com",
    status: "UPCOMING",
  },
  {
    title: "Festival de Jazz de Montreux",
    description: "Performance exceptionnelle au Festival de Jazz de Montreux. Nous partagerons la scène avec d'autres artistes internationaux dans un cadre magnifique au bord du lac Léman.",
    date: new Date("2024-08-20T21:00:00Z"),
    location: "Montreux, Suisse",
    venue: "Montreux Jazz Festival",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    externalUrl: "https://www.montreuxjazz.com",
    status: "UPCOMING",
  },
  {
    title: "Concert Intime à la Cigale",
    description: "Un concert acoustique dans l'ambiance chaleureuse de la Cigale. Un moment privilégié pour découvrir nos chansons dans une version plus intimiste.",
    date: new Date("2024-06-10T20:00:00Z"),
    location: "Paris",
    venue: "La Cigale",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7fba25c4c4f?w=1200&q=80",
    externalUrl: "https://www.lacigale.fr",
    status: "UPCOMING",
  },
  {
    title: "Tournée Européenne - Berlin",
    description: "Première date de notre tournée européenne à Berlin ! Nous sommes ravis de vous retrouver dans cette ville emblématique pour une soirée mémorable.",
    date: new Date("2024-09-05T19:30:00Z"),
    location: "Berlin, Allemagne",
    venue: "Tempodrom",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    status: "UPCOMING",
  },
  {
    title: "Concert au Bataclan",
    description: "Retour sur la scène du Bataclan pour un concert exceptionnel. Tous les bénéfices seront reversés à une association caritative.",
    date: new Date("2024-05-20T20:00:00Z"),
    location: "Paris",
    venue: "Le Bataclan",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    externalUrl: "https://www.bataclan.fr",
    status: "PAST",
  },
  {
    title: "Festival des Vieilles Charrues",
    description: "Participation au Festival des Vieilles Charrues à Carhaix. Un des plus grands festivals de musique en France !",
    date: new Date("2024-07-18T22:00:00Z"),
    location: "Carhaix-Plouguer",
    venue: "Festival des Vieilles Charrues",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    externalUrl: "https://www.vieillescharrues.asso.fr",
    status: "UPCOMING",
  },
  {
    title: "Concert à l'Olympia",
    description: "Concert historique à l'Olympia de Paris. Une salle mythique pour une soirée exceptionnelle avec notre répertoire complet.",
    date: new Date("2024-03-15T20:00:00Z"),
    location: "Paris",
    venue: "Olympia",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7fba25c4c4f?w=1200&q=80",
    externalUrl: "https://www.olympiahall.com",
    status: "PAST",
  },
  {
    title: "Concert à Lyon - Le Transbordeur",
    description: "Première fois au Transbordeur de Lyon ! Nous sommes impatients de découvrir cette salle et de partager notre musique avec le public lyonnais.",
    date: new Date("2024-10-12T20:30:00Z"),
    location: "Lyon",
    venue: "Le Transbordeur",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    status: "UPCOMING",
  },
]

async function seedEvents() {
  try {
    console.log('🌱 Ajout des événements de test...\n')

    // Récupérer le premier admin
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!admin) {
      console.error('❌ Aucun administrateur trouvé. Créez d\'abord un admin avec: npm run create-admin')
      process.exit(1)
    }

    console.log(`✅ Admin trouvé: ${admin.email}\n`)

    let created = 0
    let skipped = 0

    for (const eventData of testEvents) {
      // Vérifier si l'événement existe déjà (par titre et date)
      const existing = await prisma.event.findFirst({
        where: {
          title: eventData.title,
          date: eventData.date,
        },
      })

      if (existing) {
        console.log(`⏭️  Événement déjà existant: ${eventData.title}`)
        skipped++
        continue
      }

      const event = await prisma.event.create({
        data: {
          ...eventData,
          userId: admin.id,
        },
      })

      console.log(`✅ Événement créé: ${event.title} (${event.date.toLocaleDateString('fr-FR')})`)
      created++
    }

    console.log(`\n✨ Terminé !`)
    console.log(`   - ${created} événement(s) créé(s)`)
    console.log(`   - ${skipped} événement(s) ignoré(s) (déjà existants)`)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedEvents()

