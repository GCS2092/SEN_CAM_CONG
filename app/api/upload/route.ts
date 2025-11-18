import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { verifyToken } from '@/lib/auth'

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

    const payload = verifyToken(token)
    // ADMIN et ARTIST peuvent uploader des images
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

    // Si Cloudinary est configuré, l'utiliser
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      return await uploadToCloudinary(file)
    }

    // Sinon, upload local (développement)
    return await uploadLocal(file)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

async function uploadToCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Créer FormData pour Cloudinary
    const cloudinaryFormData = new URLSearchParams()
    cloudinaryFormData.append('file', dataURI)
    cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'unsigned')
    cloudinaryFormData.append('folder', 'sec-cam-cong')
    // Garder la qualité maximale - pas de compression
    cloudinaryFormData.append('quality', 'auto:best')
    cloudinaryFormData.append('fetch_format', 'auto')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: cloudinaryFormData.toString(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur Cloudinary')
    }

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

async function uploadLocal(file: File) {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Sauvegarder le fichier (sans compression pour garder la qualité)
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const url = `/uploads/${filename}`

    return NextResponse.json({
      url,
      filename,
    })
  } catch (error) {
    console.error('Local upload error:', error)
    throw error
  }
}

