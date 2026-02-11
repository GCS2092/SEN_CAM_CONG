// Script de test pour vérifier la connexion Prisma à la base de données
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Test de connexion Prisma...\n')
  
  // Vérifie la DATABASE_URL
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL n\'est pas définie dans les variables d\'environnement')
    console.log('\n💡 Pour tester en local, crée un fichier .env.local avec:')
    console.log('   DATABASE_URL="postgresql://..."')
    process.exit(1)
  }
  
  // Analyse de l'URL
  console.log('📋 Analyse de DATABASE_URL:')
  try {
    const url = new URL(dbUrl.replace(/^postgresql:/, 'postgres:'))
    console.log(`   - Host: ${url.hostname}`)
    console.log(`   - Port: ${url.port || '5432 (défaut)'}`)
    console.log(`   - Database: ${url.pathname.replace('/', '')}`)
    console.log(`   - User: ${url.username}`)
    console.log(`   - Password: ${url.password ? '***' + url.password.slice(-2) : 'NON DÉFINI'}`)
    console.log(`   - SSL Mode: ${url.searchParams.get('sslmode') || 'non spécifié'}`)
    console.log(`   - Pooler: ${url.hostname.includes('pooler') ? 'Oui' : 'Non'}`)
  } catch (e) {
    console.log(`   ⚠️  Format d'URL invalide: ${e.message}`)
  }
  console.log()

  try {
    // Test 1: Connexion basique
    console.log('1️⃣ Test de connexion basique...')
    await prisma.$connect()
    console.log('✅ Connexion réussie!\n')

    // Test 2: Compter les utilisateurs
    console.log('2️⃣ Test de lecture de la table users...')
    const userCount = await prisma.user.count()
    console.log(`✅ Lecture réussie! Nombre d'utilisateurs: ${userCount}\n`)

    // Test 3: Chercher l'utilisateur slovengama@gmail.com
    console.log('3️⃣ Recherche de l\'utilisateur slovengama@gmail.com...')
    const user = await prisma.user.findUnique({
      where: { email: 'slovengama@gmail.com' },
      select: {
        id: true,
        email: true,
        role: true,
        supabaseAuthId: true,
        createdAt: true,
      },
    })
    
    if (user) {
      console.log('✅ Utilisateur trouvé!')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Role: ${user.role}`)
      console.log(`   - Supabase Auth ID: ${user.supabaseAuthId || 'Non lié'}`)
      console.log(`   - Créé le: ${user.createdAt}`)
    } else {
      console.log('⚠️  Utilisateur slovengama@gmail.com non trouvé dans la table users')
    }
    console.log()

    // Test 4: Lister tous les utilisateurs (pour debug)
    console.log('4️⃣ Liste de tous les utilisateurs:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        supabaseAuthId: true,
      },
      take: 10,
    })
    
    if (allUsers.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé dans la table')
    } else {
      allUsers.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role}) - Supabase: ${u.supabaseAuthId ? 'Oui' : 'Non'}`)
      })
    }
    console.log()

    console.log('✅ Tous les tests sont passés! Prisma peut se connecter à la base de données.\n')

  } catch (error) {
    console.error('❌ Erreur lors du test:')
    console.error(`   Type: ${error.constructor.name}`)
    console.error(`   Message: ${error.message}`)
    
    if (error.code) {
      console.error(`   Code: ${error.code}`)
    }
    
    if (error.meta) {
      console.error(`   Meta:`, error.meta)
    }
    
    console.error('\n💡 Solutions possibles:')
    console.error('   1. Vérifie que le mot de passe est correct dans DATABASE_URL')
    console.error('   2. Si le mot de passe contient des caractères spéciaux, encode-les (ex: @ devient %40)')
    console.error('   3. Essaie avec la connection string "Session mode" (pooler) au lieu de "Direct connection"')
    console.error('   4. Vérifie dans Supabase → Settings → Database que le mot de passe est bien celui que tu utilises')
    console.error('\n📝 Format attendu:')
    console.error('   Direct: postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres?sslmode=require')
    console.error('   Pooler: postgresql://postgres.xxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true')
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Connexion fermée.')
  }
}

testConnection()
  .catch((error) => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })
