const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const { put } = require('@vercel/blob')

const prisma = new PrismaClient()

async function uploadLocalImagesToBlob() {
  try {
    console.log('🖼️  Upload des images locales vers Vercel Blob Storage...\n')

    // Vérifier que BLOB_READ_WRITE_TOKEN est configuré
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('❌ BLOB_READ_WRITE_TOKEN non configuré !')
      console.error('   Créez d\'abord un Blob Storage dans Vercel Dashboard')
      process.exit(1)
    }

    // Lire les images du dossier uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!fs.existsSync(uploadsDir)) {
      console.error('❌ Le dossier public/uploads n\'existe pas')
      process.exit(1)
    }

    const files = fs.readdirSync(uploadsDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        name: file,
        path: path.join(uploadsDir, file),
        url: `/uploads/${file}`
      }))

    if (files.length === 0) {
      console.error('❌ Aucune image trouvée dans public/uploads')
      process.exit(1)
    }

    console.log(`📋 ${files.length} image(s) trouvée(s)\n`)

    // Uploader chaque image vers Vercel Blob
    const uploadedImages = []
    
    for (const file of files) {
      try {
        console.log(`📤 Upload de ${file.name}...`)
        
        const fileBuffer = fs.readFileSync(file.path)
        const extension = path.extname(file.name)
        const filename = `sec-cam-cong/${Date.now()}-${Math.random().toString(36).substring(2, 15)}${extension}`
        
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          contentType: `image/${extension.slice(1)}`,
        })

        uploadedImages.push({
          name: file.name,
          url: blob.url,
          originalPath: file.url
        })

        console.log(`   ✅ Uploadé: ${blob.url}\n`)
      } catch (error) {
        console.error(`   ❌ Erreur pour ${file.name}: ${error.message}\n`)
      }
    }

    if (uploadedImages.length === 0) {
      console.error('❌ Aucune image n\'a pu être uploadée')
      process.exit(1)
    }

    console.log(`✅ ${uploadedImages.length} image(s) uploadée(s) avec succès\n`)

    // 1. Assigner une image à chaque événement (une image par événement)
    console.log('📅 Assignation des images aux événements...')
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'asc' }
    })

    let eventIndex = 0
    for (const event of events) {
      if (eventIndex < uploadedImages.length) {
        const image = uploadedImages[eventIndex]
        await prisma.event.update({
          where: { id: event.id },
          data: { imageUrl: image.url }
        })
        console.log(`   ✅ ${event.title} → ${image.name}`)
        eventIndex++
      }
    }
    console.log(`✅ ${Math.min(events.length, uploadedImages.length)} événement(s) mis à jour\n`)

    // 2. Ajouter toutes les images à la galerie (global_media)
    console.log('🖼️  Ajout des images à la galerie...')
    let order = 0
    for (const image of uploadedImages) {
      await prisma.globalMedia.create({
        data: {
          type: 'IMAGE',
          url: image.url,
          title: image.name.replace(/\.[^/.]+$/, ''), // Nom sans extension
          category: 'gallery',
          order: order++,
          active: true,
        }
      })
      console.log(`   ✅ ${image.name} ajoutée à la galerie`)
    }
    console.log(`✅ ${uploadedImages.length} image(s) ajoutée(s) à la galerie\n`)

    // 3. Configurer l'image de fond Hero (première image)
    if (uploadedImages.length > 0) {
      console.log('🎨 Configuration de l\'image de fond Hero...')
      const heroImage = uploadedImages[0]
      
      await prisma.siteSettings.upsert({
        where: { key: 'hero_background_image' },
        update: {
          value: heroImage.url,
          type: 'image',
          description: 'Image de fond de la section Hero',
        },
        create: {
          key: 'hero_background_image',
          value: heroImage.url,
          type: 'image',
          description: 'Image de fond de la section Hero',
        },
      })
      
      console.log(`   ✅ Image de fond configurée: ${heroImage.name}`)
      console.log(`   URL: ${heroImage.url}\n`)
    }

    console.log('='.repeat(50))
    console.log('✅ TERMINÉ !')
    console.log('='.repeat(50))
    console.log(`📊 Résumé :`)
    console.log(`   - ${uploadedImages.length} image(s) uploadée(s) sur Vercel Blob`)
    console.log(`   - ${Math.min(events.length, uploadedImages.length)} événement(s) avec image`)
    console.log(`   - ${uploadedImages.length} image(s) dans la galerie`)
    console.log(`   - Image de fond Hero configurée`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

uploadLocalImagesToBlob()

