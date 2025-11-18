const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function applyMigration() {
  try {
    console.log('🔄 Application de la migration sur la base de données de production...\n')
    
    // Vérifier la connexion
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie\n')

    // Appliquer la migration
    console.log('📦 Application de la migration...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    
    console.log('\n✅ Migration appliquée avec succès !\n')
    
    // Vérifier que les tables existent
    console.log('🔍 Vérification des tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('site_settings', 'global_media')
    `
    
    console.log('Tables trouvées:', tables)
    
    if (tables.length === 2) {
      console.log('\n✅ Les tables site_settings et global_media existent !')
    } else {
      console.log('\n⚠️  Certaines tables manquent. Vérifiez les migrations.')
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('P2021')) {
      console.error('\n💡 La table n\'existe pas. Exécutez : npx prisma migrate deploy')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

applyMigration()

