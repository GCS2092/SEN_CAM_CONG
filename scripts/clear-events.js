const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearEvents() {
  try {
    console.log('🗑️  Suppression de tous les événements...')
    
    // Compter d'abord les événements
    const count = await prisma.event.count()
    console.log(`📊 Nombre d'événements à supprimer: ${count}`)
    
    if (count === 0) {
      console.log('✅ Aucun événement à supprimer')
      return
    }
    
    // Supprimer tous les événements (les commentaires, likes et performances liés seront supprimés automatiquement grâce à onDelete: Cascade)
    const result = await prisma.event.deleteMany({})
    
    console.log(`✅ ${result.count} événement(s) supprimé(s) avec succès`)
    console.log('ℹ️  Les commentaires, likes et performances liés ont également été supprimés (CASCADE)')
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearEvents()
  .then(() => {
    console.log('✅ Opération terminée')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })

