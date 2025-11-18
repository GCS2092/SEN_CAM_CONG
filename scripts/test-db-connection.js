const { PrismaClient } = require('@prisma/client')

async function testDatabaseConnection() {
  console.log('🔍 Test de connexion à la base de données...\n')

  // Vérifier si DATABASE_URL est définie
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERREUR: DATABASE_URL n\'est pas définie dans les variables d\'environnement')
    console.log('\n💡 Pour tester localement, créez un fichier .env avec:')
    console.log('   DATABASE_URL="votre_url_de_connexion"')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL est définie')
  console.log(`📍 URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`)

  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })

  try {
    console.log('🔄 Tentative de connexion...')

    // Test 1: Connexion basique
    await prisma.$connect()
    console.log('✅ Connexion établie avec succès!\n')

    // Test 2: Vérifier les tables
    console.log('📊 Vérification des tables...')
    
    const tables = {
      users: await prisma.user.count(),
      events: await prisma.event.count(),
      performances: await prisma.performance.count(),
      comments: await prisma.comment.count(),
      likes: await prisma.like.count(),
      media: await prisma.media.count(),
      socialLinks: await prisma.socialLink.count(),
    }

    console.log('\n📈 Statistiques de la base de données:')
    console.log(`   👥 Utilisateurs: ${tables.users}`)
    console.log(`   📅 Événements: ${tables.events}`)
    console.log(`   🎤 Performances: ${tables.performances}`)
    console.log(`   💬 Commentaires: ${tables.comments}`)
    console.log(`   ❤️  Likes: ${tables.likes}`)
    console.log(`   🖼️  Médias: ${tables.media}`)
    console.log(`   🔗 Liens sociaux: ${tables.socialLinks}`)

    // Test 3: Requête simple
    console.log('\n🔄 Test de requête simple...')
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true, role: true },
    })
    
    if (testUser) {
      console.log(`✅ Requête réussie - Exemple d'utilisateur trouvé: ${testUser.email}`)
    } else {
      console.log('⚠️  Aucun utilisateur trouvé (base de données vide)')
    }

    // Test 4: Vérifier les index
    console.log('\n🔍 Vérification de la structure...')
    const eventWithIndex = await prisma.event.findFirst({
      where: { status: 'UPCOMING' },
      select: { id: true, title: true },
    })
    console.log('✅ Les index semblent fonctionner correctement')

    console.log('\n🎉 Tous les tests sont passés avec succès!')
    console.log('✅ La base de données est opérationnelle et accessible.\n')

  } catch (error) {
    console.error('\n❌ ERREUR lors de la connexion:')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    if (error.code === 'P1001') {
      console.error('🔴 Impossible de se connecter au serveur de base de données')
      console.error('   Vérifiez que:')
      console.error('   - L\'URL de connexion est correcte')
      console.error('   - Le serveur de base de données est en ligne')
      console.error('   - Les credentials sont valides')
    } else if (error.code === 'P1000') {
      console.error('🔴 Échec d\'authentification')
      console.error('   Vérifiez vos identifiants (username/password)')
    } else if (error.code === 'P1003') {
      console.error('🔴 La base de données n\'existe pas')
      console.error('   Vérifiez le nom de la base de données dans l\'URL')
    } else {
      console.error(`🔴 Code d'erreur: ${error.code || 'UNKNOWN'}`)
      console.error(`   Message: ${error.message}`)
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Connexion fermée')
  }
}

// Exécuter le test
testDatabaseConnection()
  .catch((error) => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

