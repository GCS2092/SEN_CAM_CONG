const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function checkAndCreateAdmin() {
  try {
    const email = 'slovengama@gmail.com'
    
    console.log(`🔍 Vérification de l'admin avec l'email: ${email}\n`)
    
    // Vérifier si l'admin existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('✅ Admin trouvé !')
      console.log(`   - ID: ${existingUser.id}`)
      console.log(`   - Email: ${existingUser.email}`)
      console.log(`   - Nom: ${existingUser.name || 'Non défini'}`)
      console.log(`   - Rôle: ${existingUser.role}`)
      console.log(`   - Créé le: ${existingUser.createdAt.toLocaleString('fr-FR')}\n`)
      
      if (existingUser.role !== 'ADMIN') {
        console.log('⚠️  L\'utilisateur existe mais n\'est pas ADMIN')
        const update = await question('Voulez-vous le promouvoir en ADMIN ? (o/n): ')
        if (update.toLowerCase() === 'o' || update.toLowerCase() === 'oui') {
          await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
          })
          console.log('✅ Utilisateur promu en ADMIN !')
        }
      } else {
        console.log('✅ L\'utilisateur est déjà ADMIN')
        const reset = await question('Voulez-vous réinitialiser le mot de passe ? (o/n): ')
        if (reset.toLowerCase() === 'o' || reset.toLowerCase() === 'oui') {
          const password = await question('Entrez le nouveau mot de passe: ')
          const hashedPassword = await bcrypt.hash(password, 10)
          await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
          })
          console.log('✅ Mot de passe mis à jour !')
        }
      }
    } else {
      console.log('❌ Aucun admin trouvé avec cet email')
      console.log('📝 Création d\'un nouvel admin...\n')
      
      const name = await question('Nom (optionnel): ') || null
      const password = await question('Mot de passe: ')
      
      if (!password || password.length < 6) {
        console.error('❌ Le mot de passe doit contenir au moins 6 caractères')
        process.exit(1)
      }
      
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'ADMIN',
        },
      })
      
      console.log('\n✅ Admin créé avec succès !')
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Nom: ${user.name || 'Non défini'}`)
      console.log(`   - Rôle: ${user.role}\n`)
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

checkAndCreateAdmin()

