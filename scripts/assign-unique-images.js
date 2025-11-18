const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Liste des images disponibles dans /public/uploads
// On exclut IMG-20251117-WA0001.jpg car elle est utilisée pour le Hero
const availableImages = [
  '/uploads/IMG-20251117-WA0002.jpg',
  '/uploads/IMG-20251117-WA0003.jpg',
  '/uploads/IMG-20251117-WA0004.jpg',
  '/uploads/IMG-20251117-WA0005.jpg',
  '/uploads/IMG-20251117-WA0006.jpg',
  '/uploads/IMG-20251117-WA0007.jpg',
  '/uploads/IMG-20251117-WA0008.jpg',
  '/uploads/1763387416354-ehnj7bzw29c.png',
]

async function assignUniqueImages() {
  try {
    console.log('🖼️  Attribution d\'images uniques aux événements...\n')

    // Récupérer tous les événements
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (events.length === 0) {
      console.log('⚠️  Aucun événement trouvé dans la base de données.')
      console.log('   Créez d\'abord des événements avec: npm run seed-events')
      process.exit(0)
    }

    console.log(`📋 ${events.length} événement(s) trouvé(s)\n`)

    // Vérifier qu'on a assez d'images
    if (events.length > availableImages.length) {
      console.log(`⚠️  Attention: Vous avez ${events.length} événements mais seulement ${availableImages.length} images disponibles.`)
      console.log(`   Les événements supplémentaires garderont leur image actuelle ou n'en auront pas.\n`)
    }

    let updated = 0
    let skipped = 0
    const usedImages = new Set()

    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      
      // Si on a encore des images disponibles, en assigner une
      if (i < availableImages.length) {
        const imageUrl = availableImages[i]
        
        // Vérifier que cette image n'a pas déjà été assignée (sécurité)
        if (usedImages.has(imageUrl)) {
          console.log(`⚠️  Image déjà utilisée: ${imageUrl} pour ${event.title}`)
          skipped++
          continue
        }

        await prisma.event.update({
          where: { id: event.id },
          data: { imageUrl },
        })

        usedImages.add(imageUrl)
        console.log(`✅ ${event.title}`)
        console.log(`   → Image: ${imageUrl}\n`)
        updated++
      } else {
        // Plus d'images disponibles, on garde l'image actuelle ou on laisse null
        if (event.imageUrl) {
          console.log(`⏭️  ${event.title}`)
          console.log(`   → Image conservée: ${event.imageUrl}\n`)
        } else {
          console.log(`⏭️  ${event.title}`)
          console.log(`   → Aucune image disponible (toutes les images sont déjà utilisées)\n`)
        }
        skipped++
      }
    }

    console.log(`\n✨ Terminé !`)
    console.log(`   - ${updated} événement(s) mis à jour avec une image unique`)
    console.log(`   - ${skipped} événement(s) non modifié(s)`)
    console.log(`\n📸 Images utilisées:`)
    usedImages.forEach(img => console.log(`   - ${img}`))
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

assignUniqueImages()

