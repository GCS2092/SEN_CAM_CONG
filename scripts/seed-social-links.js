const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultSocialLinks = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'YouTube',
    description: 'Regardez nos vidéos et clips',
    order: 1,
    active: true,
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com',
    icon: 'Spotify',
    description: 'Écoutez notre musique',
    order: 2,
    active: true,
  },
  {
    name: 'Deezer',
    url: 'https://www.deezer.com',
    icon: 'Deezer',
    description: 'Streaming musical',
    order: 3,
    active: true,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com',
    icon: 'Instagram',
    description: 'Photos et stories',
    order: 4,
    active: true,
  },
]

async function seedSocialLinks() {
  try {
    console.log('🌱 Ajout des liens sociaux par défaut...\n')

    let created = 0
    let skipped = 0

    for (const linkData of defaultSocialLinks) {
      // Vérifier si le lien existe déjà
      const existing = await prisma.socialLink.findUnique({
        where: { name: linkData.name },
      })

      if (existing) {
        console.log(`⏭️  Lien déjà existant: ${linkData.name}`)
        skipped++
        continue
      }

      const link = await prisma.socialLink.create({
        data: linkData,
      })

      console.log(`✅ Lien créé: ${link.name} (${link.url})`)
      created++
    }

    console.log(`\n✨ Terminé !`)
    console.log(`   - ${created} lien(s) créé(s)`)
    console.log(`   - ${skipped} lien(s) ignoré(s) (déjà existants)`)
    console.log(`\n💡 Vous pouvez maintenant modifier ces liens depuis le dashboard admin.`)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedSocialLinks()

