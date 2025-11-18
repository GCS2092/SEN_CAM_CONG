const https = require('https')
const fs = require('fs')
const path = require('path')

// Charger les variables d'environnement
require('dotenv').config()

async function testCloudinary() {
  console.log('🔍 Test de la configuration Cloudinary...\n')

  // Vérifier les variables d'environnement
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'unsigned'

  console.log('📋 Configuration détectée :')
  console.log(`   - Cloud Name: ${cloudName || '❌ MANQUANT'}`)
  console.log(`   - API Key: ${apiKey ? '✅ Configuré' : '❌ MANQUANT'}`)
  console.log(`   - API Secret: ${apiSecret ? '✅ Configuré' : '❌ MANQUANT'}`)
  console.log(`   - Upload Preset: ${uploadPreset}\n`)

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Configuration incomplète !')
    console.error('   Vérifiez vos variables d\'environnement.')
    process.exit(1)
  }

  // Test 1 : Vérifier que le compte Cloudinary est accessible
  console.log('🧪 Test 1 : Vérification de l\'accès au compte...')
  try {
    const accountInfo = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
      },
    })

    if (accountInfo.ok) {
      console.log('   ✅ Compte Cloudinary accessible\n')
    } else {
      const error = await accountInfo.json()
      console.error(`   ❌ Erreur d'accès: ${error.error?.message || accountInfo.statusText}\n`)
    }
  } catch (error) {
    console.error(`   ❌ Erreur de connexion: ${error.message}\n`)
  }

  // Test 2 : Vérifier le preset "unsigned"
  console.log('🧪 Test 2 : Vérification du preset "unsigned"...')
  try {
    const presetInfo = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload_presets/${uploadPreset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
      },
    })

    if (presetInfo.ok) {
      const preset = await presetInfo.json()
      console.log('   ✅ Preset trouvé !')
      console.log(`   - Nom: ${preset.name}`)
      console.log(`   - Signing mode: ${preset.signed ? 'Signed' : 'Unsigned'}`)
      console.log(`   - Folder: ${preset.folder || 'Aucun'}\n`)
      
      if (preset.signed) {
        console.log('   ⚠️  ATTENTION : Le preset est "Signed", pas "Unsigned"')
        console.log('   Vous devez utiliser l\'authentification signée ou créer un preset unsigned.\n')
      }
    } else {
      const error = await presetInfo.json()
      console.error(`   ❌ Preset non trouvé: ${error.error?.message || presetInfo.statusText}`)
      console.error(`   💡 Créez le preset "${uploadPreset}" dans Cloudinary Dashboard\n`)
    }
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}\n`)
  }

  // Test 3 : Test d'upload avec une petite image de test
  console.log('🧪 Test 3 : Test d\'upload (simulation)...')
  
  // Créer une petite image de test (1x1 pixel PNG en base64)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const dataURI = `data:image/png;base64,${testImageBase64}`

  try {
    const formData = new URLSearchParams()
    formData.append('file', dataURI)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'sec-cam-cong-test')

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    )

    const uploadData = await uploadResponse.json()

    if (uploadResponse.ok) {
      console.log('   ✅ Upload réussi !')
      console.log(`   - URL: ${uploadData.secure_url}`)
      console.log(`   - Public ID: ${uploadData.public_id}\n`)
      console.log('✅ Cloudinary fonctionne correctement !\n')
      
      // Supprimer l'image de test
      if (uploadData.public_id) {
        try {
          const deleteResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
              },
              body: new URLSearchParams({
                public_id: uploadData.public_id,
              }).toString(),
            }
          )
          if (deleteResponse.ok) {
            console.log('   🗑️  Image de test supprimée\n')
          }
        } catch (e) {
          // Ignorer les erreurs de suppression
        }
      }
    } else {
      console.error(`   ❌ Upload échoué: ${uploadData.error?.message || uploadResponse.statusText}`)
      console.error(`   Détails:`, uploadData)
      
      if (uploadData.error?.message?.includes('whitelisted')) {
        console.error('\n   💡 SOLUTION :')
        console.error('   1. Allez dans Cloudinary Dashboard → Settings → Security')
        console.error('   2. Activez "Allow unsigned uploads"')
        console.error('   3. OU créez un preset "unsigned" dans Settings → Upload → Upload presets\n')
      }
    }
  } catch (error) {
    console.error(`   ❌ Erreur d'upload: ${error.message}\n`)
  }

  console.log('📝 Résumé :')
  console.log('   Si tous les tests passent ✅, Cloudinary est bien configuré.')
  console.log('   Si des tests échouent ❌, suivez les instructions ci-dessus.\n')
}

testCloudinary().catch(console.error)

