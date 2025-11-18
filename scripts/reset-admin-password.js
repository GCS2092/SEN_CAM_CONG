const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    const email = 'slovengama@gmail.com'
    const password = process.argv[2] || 'Admin123!'
    
    console.log(`🔐 Réinitialisation du mot de passe pour: ${email}\n`)
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé. Création...\n')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const newUser = await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
        },
      })
      
      console.log('✅ Admin créé avec succès !')
      console.log(`   - Email: ${newUser.email}`)
      console.log(`   - Mot de passe: ${password}`)
      console.log(`   - Rôle: ${newUser.role}\n`)
    } else {
      console.log('✅ Utilisateur trouvé. Mise à jour du mot de passe...\n')
      
      // S'assurer qu'il est ADMIN
      if (user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        })
        console.log('✅ Rôle mis à jour en ADMIN')
      }
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      })
      
      console.log('✅ Mot de passe mis à jour !')
      console.log(`   - Email: ${email}`)
      console.log(`   - Nouveau mot de passe: ${password}`)
      console.log(`   - Rôle: ADMIN\n`)
    }
    
    console.log('🔑 Vous pouvez maintenant vous connecter avec:')
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: ${password}\n`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()

