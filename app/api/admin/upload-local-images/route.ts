import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenOrSupabase } from '@/lib/auth'
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

/**
 * API Route pour uploader les images locales vers Vercel Blob Storage
 * Accessible uniquement aux admins
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = await verifyTokenOrSupabase(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé. Admin uniquement.' },
        { status: 403 }
      )
    }

    // Vérifier que BLOB_READ_WRITE_TOKEN est configuré
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN non configuré. Créez un Blob Storage dans Vercel.' },
        { status: 500 }
      )
    }

    const results = {
      uploaded: [] as Array<{ name: string; url: string }>,
      eventsUpdated: 0,
      galleryAdded: 0,
      heroConfigured: false,
      errors: [] as string[],
    }

    // Lire les images du dossier uploads (en production, elles sont dans public/uploads)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json(
        { error: 'Le dossier public/uploads n\'existe pas' },
        { status: 404 }
      )
    }

    const files = fs.readdirSync(uploadsDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        name: file,
        path: path.join(uploadsDir, file),
      }))

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image trouvée dans public/uploads' },
        { status: 404 }
      )
    }

    // Uploader chaque image vers Vercel Blob
    for (const file of files) {
      try {
        const fileBuffer = fs.readFileSync(file.path)
        const extension = path.extname(file.name)
        const filename = `sec-cam-cong/${Date.now()}-${Math.random().toString(36).substring(2, 15)}${extension}`
        
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          contentType: `image/${extension.slice(1)}`,
        })

        results.uploaded.push({
          name: file.name,
          url: blob.url,
        })
      } catch (error: any) {
        results.errors.push(`${file.name}: ${error.message}`)
      }
    }

    if (results.uploaded.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image n\'a pu être uploadée', details: results.errors },
        { status: 500 }
      )
    }

    // 1. Assigner une image à chaque événement (une image par événement)
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'asc' }
    })

    let eventIndex = 0
    for (const event of events) {
      if (eventIndex < results.uploaded.length) {
        const image = results.uploaded[eventIndex]
        await prisma.event.update({
          where: { id: event.id },
          data: { imageUrl: image.url }
        })
        results.eventsUpdated++
        eventIndex++
      }
    }

    // 2. Ajouter toutes les images à la galerie (global_media)
    let order = 0
    for (const image of results.uploaded) {
      await prisma.globalMedia.create({
        data: {
          type: 'IMAGE',
          url: image.url,
          title: image.name.replace(/\.[^/.]+$/, ''),
          category: 'gallery',
          order: order++,
          active: true,
        }
      })
      results.galleryAdded++
    }

    // 3. Configurer l'image de fond Hero (première image)
    if (results.uploaded.length > 0) {
      const heroImage = results.uploaded[0]
      
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
      
      results.heroConfigured = true
    }

    return NextResponse.json({
      success: true,
      message: 'Images uploadées et assignées avec succès',
      results: {
        uploaded: results.uploaded.length,
        eventsUpdated: results.eventsUpdated,
        galleryAdded: results.galleryAdded,
        heroConfigured: results.heroConfigured,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
    })
  } catch (error: any) {
    console.error('Error uploading local images:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'upload des images' },
      { status: 500 }
    )
  }
}

