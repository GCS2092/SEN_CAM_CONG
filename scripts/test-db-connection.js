const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...\n')
    
    // Test 1 : Connexion simple
    console.log('Test 1 : Connexion à la base de données...')
    await prisma.$connect()
    console.log('✅ Connexion réussie !\n')
    
    // Test 2 : Requête simple
    console.log('Test 2 : Requête simple (count users)...')
    const userCount = await prisma.user.count()
    console.log(`✅ ${userCount} utilisateur(s) trouvé(s)\n`)
    
    // Test 3 : Vérifier les tables
    console.log('Test 3 : Vérification des tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    console.log('✅ Tables trouvées :')
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`)
    })
    console.log()
    
    // Test 4 : Vérifier les nouvelles tables
    console.log('Test 4 : Vérification des nouvelles tables...')
    try {
      const siteSettingsCount = await prisma.siteSettings.count()
      console.log(`✅ site_settings : ${siteSettingsCount} enregistrement(s)`)
    } catch (e) {
      console.error(`❌ site_settings : Table non trouvée - ${e.message}`)
    }
    
    try {
      const globalMediaCount = await prisma.globalMedia.count()
      console.log(`✅ global_media : ${globalMediaCount} enregistrement(s)`)
    } catch (e) {
      console.error(`❌ global_media : Table non trouvée - ${e.message}`)
    }
    console.log()
    
    // Test 5 : Test de requête complexe
    console.log('Test 5 : Test de requête complexe (events avec relations)...')
    const events = await prisma.event.findMany({
      take: 1,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
    console.log(`✅ ${events.length} événement(s) récupéré(s) avec relations\n`)
    
    console.log('='.repeat(50))
    console.log('✅ TOUS LES TESTS SONT PASSÉS !')
    console.log('='.repeat(50))
    console.log('\n📊 Résumé :')
    console.log(`   - Connexion : ✅`)
    console.log(`   - Utilisateurs : ${userCount}`)
    console.log(`   - Tables : ${tables.length}`)
    console.log(`   - Base de données : Opérationnelle\n`)
    
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message)
    
    if (error.message.includes('Can\'t reach database server')) {
      console.error('\n💡 SOLUTION :')
      console.error('   1. Vérifiez que vous utilisez l\'External Database URL (pas Internal)')
      console.error('   2. L\'URL doit contenir le domaine complet : .oregon-postgres.render.com')
      console.error('   3. L\'URL doit contenir le port :5432')
      console.error('   4. Vérifiez que la base de données Render n\'est pas en pause')
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 SOLUTION :')
      console.error('   Exécutez : npx prisma migrate deploy')
    } else {
      console.error('\n💡 Vérifiez votre DATABASE_URL dans le fichier .env')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
