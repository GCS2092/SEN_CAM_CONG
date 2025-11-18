const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function ensureAdmin() {
  try {
    const email = 'slovengama@gmail.com'
    const password = 'Admin123!'
    
    console.log('🔍 Vérification/Création de l\'admin sur la base de données...\n')
    console.log(`📧 Email: ${email}`)
    console.log(`🔐 Mot de passe: ${password}\n`)
    
    // Vérifier si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (user) {
      console.log('✅ Utilisateur trouvé !')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Rôle actuel: ${user.role}`)
      
      // S'assurer qu'il est ADMIN
      if (user.role !== 'ADMIN') {
        console.log('⚠️  Promotion en ADMIN...')
        user = await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        })
        console.log('✅ Promu en ADMIN !')
      }
      
      // Mettre à jour le mot de passe
      console.log('🔐 Mise à jour du mot de passe...')
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      })
      console.log('✅ Mot de passe mis à jour !')
      
    } else {
      console.log('❌ Utilisateur non trouvé. Création...\n')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      
      user = await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
        },
      })
      
      console.log('✅ Admin créé avec succès !')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Rôle: ${user.role}\n`)
    }
    
    // Vérifier que le mot de passe fonctionne
    console.log('🔍 Vérification du mot de passe...')
    const isValid = await bcrypt.compare(password, user.password)
    if (isValid) {
      console.log('✅ Le mot de passe est correct !\n')
    } else {
      console.log('❌ ERREUR: Le mot de passe ne correspond pas !\n')
    }
    
    console.log('='.repeat(50))
    console.log('📋 INFORMATIONS DE CONNEXION')
    console.log('='.repeat(50))
    console.log(`Email: ${email}`)
    console.log(`Mot de passe: ${password}`)
    console.log(`Rôle: ${user.role}`)
    console.log('='.repeat(50))
    console.log('\n✅ Vous pouvez maintenant vous connecter !\n')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    if (error.message) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

ensureAdmin()

