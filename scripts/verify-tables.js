const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyTables() {
  try {
    console.log('🔍 Vérification des tables...\n')
    
    const settings = await prisma.siteSettings.findMany()
    const media = await prisma.globalMedia.findMany()
    
    console.log('✅ Tables créées avec succès !')
    console.log(`   - site_settings: ${settings.length} enregistrement(s)`)
    console.log(`   - global_media: ${media.length} enregistrement(s)`)
    console.log('\n✅ Migration appliquée correctement !')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('does not exist')) {
      console.error('\n💡 La migration n\'a pas été appliquée. Exécutez : npx prisma migrate deploy')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTables()

