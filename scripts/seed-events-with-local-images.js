const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Images disponibles dans le dossier uploads
const availableImages = [
  '/uploads/IMG-20251117-WA0001.jpg',
  '/uploads/IMG-20251117-WA0002.jpg',
  '/uploads/IMG-20251117-WA0003.jpg',
  '/uploads/IMG-20251117-WA0004.jpg',
  '/uploads/IMG-20251117-WA0005.jpg',
  '/uploads/IMG-20251117-WA0006.jpg',
  '/uploads/IMG-20251117-WA0007.jpg',
  '/uploads/IMG-20251117-WA0008.jpg',
  '/uploads/1763387416354-ehnj7bzw29c.png',
]

// Événements de test avec données cohérentes
const testEvents = [
  {
    title: "Concert Fusion - Paris",
    description: "Venez découvrir la fusion unique des rythmes du Cameroun, du Sénégal et du Congo ! Une soirée exceptionnelle où les trois cultures se rencontrent pour créer une expérience musicale inoubliable. Ouverture des portes à 19h, début du concert à 20h30.\n\nAu programme :\n- Musique traditionnelle revisitée\n- Rythmes afrobeat et soukous\n- Collaboration avec des artistes invités\n- Ambiance festive garantie !",
    date: new Date("2025-06-15T20:30:00Z"),
    location: "Paris, France",
    venue: "Zénith de Paris",
    imageUrl: availableImages[0],
    externalUrl: "https://www.fnac.com",
    ticketPrice: 25000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Festival Afro-Caribéen - Dakar",
    description: "Performance exceptionnelle au Festival Afro-Caribéen de Dakar. Nous partagerons la scène avec d'autres artistes internationaux dans un cadre magnifique. Une célébration de la musique africaine et de sa diversité.\n\nCe concert marque notre retour au Sénégal, berceau de notre inspiration musicale.",
    date: new Date("2025-08-20T21:00:00Z"),
    location: "Dakar, Sénégal",
    venue: "Place de l'Indépendance",
    imageUrl: availableImages[1],
    externalUrl: "https://www.festival-afro-caribeen.sn",
    ticketPrice: 15000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Concert Intime - Yaoundé",
    description: "Un concert acoustique dans l'ambiance chaleureuse de Yaoundé. Un moment privilégié pour découvrir nos chansons dans une version plus intimiste, avec des arrangements acoustiques qui mettent en valeur la beauté des mélodies traditionnelles.\n\nRetour aux sources dans la capitale camerounaise !",
    date: new Date("2025-07-10T20:00:00Z"),
    location: "Yaoundé, Cameroun",
    venue: "Palais des Congrès",
    imageUrl: availableImages[2],
    externalUrl: null,
    ticketPrice: 12000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Tournée Africaine - Brazzaville",
    description: "Première date de notre tournée africaine à Brazzaville ! Nous sommes ravis de vous retrouver dans cette ville emblématique du Congo pour une soirée mémorable. Un hommage aux rythmes congolais qui ont influencé notre musique.",
    date: new Date("2025-09-05T19:30:00Z"),
    location: "Brazzaville, Congo",
    venue: "Palais des Sports",
    imageUrl: availableImages[3],
    externalUrl: null,
    ticketPrice: 18000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Concert de Gala - Douala",
    description: "Concert de gala à Douala pour célébrer la fusion musicale SEC CAM CONG. Tous les bénéfices seront reversés à une association caritative locale. Une soirée exceptionnelle pour une cause noble.\n\nRejoignez-nous pour cette soirée solidaire !",
    date: new Date("2024-11-20T20:00:00Z"),
    location: "Douala, Cameroun",
    venue: "Salle des Fêtes",
    imageUrl: availableImages[4],
    externalUrl: "https://www.douala-events.cm",
    ticketPrice: 20000, // FCFA
    status: "PAST",
  },
  {
    title: "Festival des Musiques du Monde - Lyon",
    description: "Participation au Festival des Musiques du Monde à Lyon. Un des plus grands festivals de musique en France ! Nous représenterons la richesse musicale de l'Afrique centrale et de l'ouest.",
    date: new Date("2025-07-18T22:00:00Z"),
    location: "Lyon, France",
    venue: "Festival des Musiques du Monde",
    imageUrl: availableImages[5],
    externalUrl: "https://www.festival-musiques-monde.fr",
    ticketPrice: 30000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Concert à l'Olympia - Paris",
    description: "Concert historique à l'Olympia de Paris. Une salle mythique pour une soirée exceptionnelle avec notre répertoire complet. Venez vivre une expérience unique où se mêlent les sonorités du Cameroun, du Sénégal et du Congo.",
    date: new Date("2024-10-15T20:00:00Z"),
    location: "Paris, France",
    venue: "Olympia",
    imageUrl: availableImages[6],
    externalUrl: "https://www.olympiahall.com",
    ticketPrice: 35000, // FCFA
    status: "PAST",
  },
  {
    title: "Soirée Fusion - Marseille",
    description: "Première fois à Marseille ! Nous sommes impatients de découvrir cette ville cosmopolite et de partager notre musique avec le public marseillais. Une soirée qui promet d'être mémorable avec nos plus grands hits et quelques surprises.",
    date: new Date("2025-10-12T20:30:00Z"),
    location: "Marseille, France",
    venue: "Le Dôme",
    imageUrl: availableImages[7],
    externalUrl: null,
    ticketPrice: 22000, // FCFA
    status: "UPCOMING",
  },
  {
    title: "Concert Spécial - Abidjan",
    description: "Concert spécial à Abidjan pour célébrer la diversité musicale africaine. Une soirée où les rythmes du Cameroun, du Sénégal et du Congo se rencontrent dans la capitale ivoirienne. Ambiance garantie !",
    date: new Date("2025-11-25T21:00:00Z"),
    location: "Abidjan, Côte d'Ivoire",
    venue: "Palais de la Culture",
    imageUrl: availableImages[8],
    externalUrl: null,
    ticketPrice: 16000, // FCFA
    status: "UPCOMING",
  },
]

async function seedEvents() {
  try {
    console.log('🌱 Ajout des événements de test avec images locales...\n')

    // Vérifier que les images existent
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    console.log(`📁 Vérification du dossier: ${uploadsDir}\n`)

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
    let imageIndex = 0

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

      // Vérifier que l'image existe
      const imagePath = path.join(process.cwd(), 'public', eventData.imageUrl.replace('/', ''))
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image non trouvée: ${eventData.imageUrl}, utilisation d'une image par défaut`)
        // Utiliser une image disponible
        eventData.imageUrl = availableImages[imageIndex % availableImages.length]
      }

      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          venue: eventData.venue,
          imageUrl: eventData.imageUrl,
          externalUrl: eventData.externalUrl,
          ticketPrice: eventData.ticketPrice,
          status: eventData.status,
          userId: admin.id,
        },
      })

      console.log(`✅ Événement créé: ${event.title}`)
      console.log(`   📅 Date: ${event.date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`)
      console.log(`   📍 Lieu: ${event.location}${event.venue ? ` - ${event.venue}` : ''}`)
      console.log(`   💰 Prix: ${event.ticketPrice ? new Intl.NumberFormat('fr-FR').format(event.ticketPrice) + ' FCFA' : 'Gratuit'}`)
      console.log(`   🖼️  Image: ${event.imageUrl}`)
      console.log(`   📊 Statut: ${event.status}\n`)
      
      created++
      imageIndex++
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

