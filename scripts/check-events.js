const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkEvents() {
  try {
    const events = await prisma.event.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        date: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('📋 Événements dans la base de données:')
    console.log('─'.repeat(60))
    events.forEach((e, i) => {
      console.log(`${i + 1}. ID: ${e.id}`)
      console.log(`   Titre: ${e.title}`)
      console.log(`   Date: ${e.date.toLocaleDateString('fr-FR')}`)
      console.log(`   URL: /events/${e.id}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEvents()

