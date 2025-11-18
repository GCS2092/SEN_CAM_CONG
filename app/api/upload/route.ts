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

    // Fonction helper pour upload Vercel Blob
    const uploadToVercelBlob = async (file: File) => {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN non configuré')
      }
      
      const { put } = await import('@vercel/blob')
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `sec-cam-cong/${timestamp}-${randomStr}.${extension}`
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: file.type,
      })
      
      return NextResponse.json({
        url: blob.url,
        filename: filename,
      })
    }

    // Si Cloudinary est configuré, l'utiliser avec fallback
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        return await uploadToCloudinary(file)
      } catch (cloudinaryError: any) {
        // Si Cloudinary échoue, fallback vers Vercel Blob ou local
        console.error('Cloudinary upload failed, trying fallback:', cloudinaryError.message)
        
        // Essayer Vercel Blob si disponible
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          try {
            console.log('Trying Vercel Blob Storage as fallback...')
            return await uploadToVercelBlob(file)
          } catch (blobError: any) {
            console.error('Vercel Blob upload failed:', blobError.message)
          }
        }
        
        // Fallback vers local (développement uniquement)
        if (process.env.NODE_ENV === 'development') {
          console.log('Falling back to local storage (development only)...')
          return await uploadLocal(file)
        }
        
        // En production, si tout échoue, retourner un message d'erreur clair
        return NextResponse.json(
          { 
            error: 'Upload échoué. Cloudinary nécessite un preset configuré. Configurez Vercel Blob Storage ou corrigez Cloudinary.',
            details: cloudinaryError.message
          },
          { status: 500 }
        )
      }
    }

    // Si Vercel Blob est configuré, l'utiliser directement
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const result = await uploadToVercelBlob(file)
        console.log('Vercel Blob upload success:', result)
        return result
      } catch (blobError: any) {
        console.error('Vercel Blob upload error:', blobError.message)
        // Fallback vers local en développement
        if (process.env.NODE_ENV === 'development') {
          return await uploadLocal(file)
        }
        throw blobError
      }
    }

    // Sinon, upload local (développement uniquement)
    if (process.env.NODE_ENV === 'development') {
      return await uploadLocal(file)
    }

    // En production sans Cloudinary ni Blob, erreur
    return NextResponse.json(
      { error: 'Aucun service de stockage configuré. Configurez Cloudinary ou Vercel Blob Storage.' },
      { status: 500 }
    )
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
    // Vérifier la configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'unsigned'

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary config missing:', {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      })
      throw new Error('Configuration Cloudinary incomplète')
    }

    console.log('Cloudinary upload attempt:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cloudName,
      uploadPreset,
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Créer FormData pour Cloudinary
    const cloudinaryFormData = new URLSearchParams()
    cloudinaryFormData.append('file', dataURI)
    cloudinaryFormData.append('upload_preset', uploadPreset)
    cloudinaryFormData.append('folder', 'sec-cam-cong')
    // Garder la qualité maximale - pas de compression
    cloudinaryFormData.append('quality', 'auto:best')
    cloudinaryFormData.append('fetch_format', 'auto')

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    console.log('Uploading to:', uploadUrl)

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: cloudinaryFormData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data,
      })
      throw new Error(data.error?.message || `Erreur Cloudinary: ${response.status} ${response.statusText}`)
    }

    console.log('Cloudinary upload success:', {
      url: data.secure_url,
      publicId: data.public_id,
    })

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    })
  } catch (error: any) {
    console.error('Cloudinary upload error:', {
      message: error.message,
      stack: error.stack,
    })
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

