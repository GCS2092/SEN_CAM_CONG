import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenOrSupabase } from '@/lib/auth'
import { put } from '@vercel/blob'

/**
 * Alternative à Cloudinary : Utilise Vercel Blob Storage
 * 
 * Avantages :
 * - Gratuit jusqu'à 1GB
 * - Intégré à Vercel
 * - Pas besoin de service externe
 * - Simple à configurer
 * 
 * Configuration :
 * 1. Allez dans Vercel Dashboard → Storage → Create Database → Blob
 * 2. Copiez le BLOB_READ_WRITE_TOKEN
 * 3. Ajoutez-le dans Vercel Environment Variables
 */

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const payload = await verifyTokenOrSupabase(token)
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'ARTIST')) {
      return NextResponse.json(
        { error: 'Accès refusé. Admin ou Artiste uniquement.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Vérifier que BLOB_READ_WRITE_TOKEN est configuré
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN non configuré. Configurez Vercel Blob Storage.' },
        { status: 500 }
      )
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `sec-cam-cong/${timestamp}-${randomStr}.${extension}`

    // Convertir File en Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url,
      filename: filename,
    })
  } catch (error: any) {
    console.error('Vercel Blob upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

