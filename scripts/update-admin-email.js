const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdminEmail() {
  try {
    console.log('🔐 Mise à jour de l\'email administrateur...\n')

    // Trouver l'admin avec l'ancien email
    const admin = await prisma.user.findFirst({
      where: { 
        role: 'ADMIN',
        email: 'slovengama@mail.com'
      },
    })

    if (!admin) {
      console.error('❌ Aucun administrateur trouvé avec l\'email: slovengama@mail.com')
      process.exit(1)
    }

    console.log(`✅ Admin trouvé: ${admin.email}`)
    console.log(`   ID: ${admin.id}`)
    console.log(`   Nom: ${admin.name || 'N/A'}\n`)

    // Vérifier si le nouvel email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: 'slovengama@gmail.com' },
    })

    if (existingUser && existingUser.id !== admin.id) {
      console.error('❌ Un utilisateur avec l\'email slovengama@gmail.com existe déjà')
      process.exit(1)
    }

    // Mettre à jour l'email
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: { email: 'slovengama@gmail.com' },
    })

    console.log('✅ Email mis à jour avec succès !')
    console.log(`   Ancien email: slovengama@mail.com`)
    console.log(`   Nouvel email: ${updatedAdmin.email}`)
    console.log(`   ID: ${updatedAdmin.id}`)
    console.log(`   Rôle: ${updatedAdmin.role}`)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminEmail()

