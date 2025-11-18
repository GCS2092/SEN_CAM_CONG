const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...\n')
    
    // Test de connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie!\n')
    
    // Vérifier les tables
    console.log('📊 Vérification des tables...\n')
    
    const tables = {
      users: await prisma.user.count(),
      events: await prisma.event.count(),
      performances: await prisma.performance.count(),
      media: await prisma.media.count(),
      likes: await prisma.like.count(),
      comments: await prisma.comment.count(),
    }
    
    console.log('Tables trouvées:')
    console.log(`  - Users: ${tables.users} enregistrement(s)`)
    console.log(`  - Events: ${tables.events} enregistrement(s)`)
    console.log(`  - Performances: ${tables.performances} enregistrement(s)`)
    console.log(`  - Media: ${tables.media} enregistrement(s)`)
    console.log(`  - Likes: ${tables.likes} enregistrement(s)`)
    console.log(`  - Comments: ${tables.comments} enregistrement(s)`)
    
    console.log('\n✅ Toutes les tables sont présentes et accessibles!')
    console.log('✅ La base de données est prête à être utilisée!\n')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

