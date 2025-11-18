const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('🔐 Création d\'un compte administrateur\n')

    const email = await question('Email: ')
    if (!email) {
      console.log('❌ Email requis')
      process.exit(1)
    }

    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('⚠️  Cet email existe déjà. Mise à jour du rôle en ADMIN...')
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })
      console.log('✅ Utilisateur mis à jour avec le rôle ADMIN')
      process.exit(0)
    }

    const name = await question('Nom (optionnel): ') || null
    const password = await question('Mot de passe: ')
    if (!password) {
      console.log('❌ Mot de passe requis')
      process.exit(1)
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    })

    console.log('\n✅ Administrateur créé avec succès!')
    console.log(`   Email: ${admin.email}`)
    console.log(`   ID: ${admin.id}`)
    console.log(`   Rôle: ${admin.role}\n`)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createAdmin()

