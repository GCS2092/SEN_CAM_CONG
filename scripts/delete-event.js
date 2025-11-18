const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function deleteEvent() {
  try {
    const eventTitle = 'Concert à Lyon - Le Transbordeur'
    
    console.log(`🗑️  Suppression de l'événement: ${eventTitle}\n`)

    // Trouver l'événement
    const event = await prisma.event.findFirst({
      where: {
        title: eventTitle,
      },
    })

    if (!event) {
      console.log(`⚠️  Événement "${eventTitle}" non trouvé.`)
      process.exit(0)
    }

    console.log(`📋 Événement trouvé:`)
    console.log(`   - ID: ${event.id}`)
    console.log(`   - Titre: ${event.title}`)
    console.log(`   - Date: ${event.date.toLocaleDateString('fr-FR')}`)
    console.log(`   - Lieu: ${event.location}\n`)

    // Supprimer l'événement
    await prisma.event.delete({
      where: { id: event.id },
    })

    console.log(`✅ Événement "${eventTitle}" supprimé avec succès !`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

deleteEvent()

