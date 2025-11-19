const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function checkImages() {
  try {
    console.log('🔍 Vérification des images dans la base de données...\n')

    // Vérifier les événements
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    })

    console.log(`📅 Événements: ${events.length}`)
    events.forEach((event) => {
      console.log(`  - ${event.title}`)
      console.log(`    ID: ${event.id}`)
      console.log(`    Image URL: ${event.imageUrl || '❌ AUCUNE IMAGE'}`)
      if (event.imageUrl) {
        const isVercelBlob = event.imageUrl.includes('blob.vercel-storage.com')
        const isCloudinary = event.imageUrl.includes('cloudinary.com')
        const isLocal = event.imageUrl.startsWith('/uploads/')
        console.log(`    Type: ${isVercelBlob ? '✅ Vercel Blob' : isCloudinary ? '✅ Cloudinary' : isLocal ? '⚠️ Local' : '❓ Autre'}`)
      }
      console.log('')
    })

    // Vérifier les médias
    const media = await prisma.media.findMany({
      where: {
        type: 'IMAGE',
      },
      select: {
        id: true,
        title: true,
        url: true,
      },
      take: 10,
    })

    console.log(`🖼️  Médias (images, limité à 10): ${media.length}`)
    media.forEach((item) => {
      console.log(`  - ${item.title || 'Sans titre'}`)
      console.log(`    ID: ${item.id}`)
      console.log(`    URL: ${item.url || '❌ AUCUNE URL'}`)
      if (item.url) {
        const isVercelBlob = item.url.includes('blob.vercel-storage.com')
        const isCloudinary = item.url.includes('cloudinary.com')
        const isLocal = item.url.startsWith('/uploads/')
        console.log(`    Type: ${isVercelBlob ? '✅ Vercel Blob' : isCloudinary ? '✅ Cloudinary' : isLocal ? '⚠️ Local' : '❓ Autre'}`)
      }
      console.log('')
    })

    // Vérifier les paramètres du site
    const heroBg = await prisma.siteSettings.findUnique({
      where: {
        key: 'hero_background_image',
      },
    })

    console.log(`🎨 Image de fond Hero:`)
    if (heroBg) {
      console.log(`  URL: ${heroBg.value || '❌ AUCUNE URL'}`)
      if (heroBg.value) {
        const isVercelBlob = heroBg.value.includes('blob.vercel-storage.com')
        const isCloudinary = heroBg.value.includes('cloudinary.com')
        const isLocal = heroBg.value.startsWith('/uploads/')
        console.log(`  Type: ${isVercelBlob ? '✅ Vercel Blob' : isCloudinary ? '✅ Cloudinary' : isLocal ? '⚠️ Local' : '❓ Autre'}`)
      }
    } else {
      console.log(`  ❌ Aucun paramètre trouvé`)
    }

    console.log('\n✅ Vérification terminée')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkImages()

