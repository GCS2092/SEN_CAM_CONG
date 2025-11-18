const fs = require('fs')
const path = require('path')

console.log('🔍 Vérification de la cohérence entre schéma Prisma et formulaires...\n')

// Lire le schéma Prisma
const schemaPath = path.join(__dirname, '../prisma/schema.prisma')
const schema = fs.readFileSync(schemaPath, 'utf-8')

// Extraire les modèles Event et Performance
const eventModel = schema.match(/model Event\s*\{[\s\S]*?\n\s*@@map\("events"\)/)?.[0] || ''
const performanceModel = schema.match(/model Performance\s*\{[\s\S]*?\n\s*@@map\("performances"\)/)?.[0] || ''

console.log('📋 SCHÉMA PRISMA - MODEL Event:')
console.log('─'.repeat(50))
const eventFields = eventModel.match(/\s+(\w+)\s+(\w+(\?|\[\])?)/g) || []
eventFields.forEach(field => {
  const match = field.match(/\s+(\w+)\s+(\S+)/)
  if (match && !['id', 'createdAt', 'updatedAt', 'userId', 'comments', 'likes', 'performances', 'user'].includes(match[1])) {
    const isOptional = match[2].includes('?')
    const isRequired = !isOptional
    console.log(`   ${match[1]}: ${match[2]} ${isRequired ? '(REQUIS)' : '(optionnel)'}`)
  }
})

console.log('\n📋 SCHÉMA PRISMA - MODEL Performance:')
console.log('─'.repeat(50))
const perfFields = performanceModel.match(/\s+(\w+)\s+(\w+(\?|\[\])?)/g) || []
perfFields.forEach(field => {
  const match = field.match(/\s+(\w+)\s+(\S+)/)
  if (match && !['id', 'createdAt', 'updatedAt', 'userId', 'eventId', 'media', 'event', 'user'].includes(match[1])) {
    const isOptional = match[2].includes('?')
    const isRequired = !isOptional
    console.log(`   ${match[1]}: ${match[2]} ${isRequired ? '(REQUIS)' : '(optionnel)'}`)
  }
})

// Lire les formulaires
const eventFormPath = path.join(__dirname, '../app/admin/events/new/page.tsx')
const perfFormPath = path.join(__dirname, '../app/admin/performances/new/page.tsx')

const eventForm = fs.readFileSync(eventFormPath, 'utf-8')
const perfForm = fs.readFileSync(perfFormPath, 'utf-8')

console.log('\n📝 FORMULAIRE Event (new):')
console.log('─'.repeat(50))
const eventFormData = eventForm.match(/formData.*?\{[\s\S]*?\}/)?.[0] || ''
const eventFormFields = eventFormData.match(/(\w+):/g) || []
eventFormFields.forEach(field => {
  const fieldName = field.replace(':', '')
  if (fieldName !== 'formData' && fieldName !== 'setFormData') {
    const isRequired = eventForm.includes(`id="${fieldName}"`) && eventForm.includes(`required`)
    console.log(`   ${fieldName}: ${isRequired ? '(REQUIS ✓)' : '(optionnel)'}`)
  }
})

console.log('\n📝 FORMULAIRE Performance (new):')
console.log('─'.repeat(50))
const perfFormData = perfForm.match(/formData.*?\{[\s\S]*?\}/)?.[0] || ''
const perfFormFields = perfFormData.match(/(\w+):/g) || []
perfFormFields.forEach(field => {
  const fieldName = field.replace(':', '')
  if (fieldName !== 'formData' && fieldName !== 'setFormData' && fieldName !== 'events') {
    const isRequired = perfForm.includes(`id="${fieldName}"`) && perfForm.includes(`required`)
    console.log(`   ${fieldName}: ${isRequired ? '(REQUIS ✓)' : '(optionnel)'}`)
  }
})

// Vérifier les API routes
const eventApiPath = path.join(__dirname, '../app/api/events/route.ts')
const perfApiPath = path.join(__dirname, '../app/api/performances/route.ts')

const eventApi = fs.readFileSync(eventApiPath, 'utf-8')
const perfApi = fs.readFileSync(perfApiPath, 'utf-8')

console.log('\n🔌 API ROUTE /api/events (POST):')
console.log('─'.repeat(50))
const eventApiBody = eventApi.match(/body\s*=\s*await request\.json\(\)[\s\S]*?const\s+\{[\s\S]*?\}\s*=\s*body/)?.[0] || ''
const eventApiFields = eventApiBody.match(/(\w+)/g) || []
const eventApiRequired = eventApi.match(/if\s*\(!.*?\)/g) || []
console.log('   Champs extraits du body:', eventApiFields.slice(eventApiFields.indexOf('body') + 1, eventApiFields.indexOf('body') + 10).join(', '))
console.log('   Validation:', eventApiRequired.length > 0 ? 'Présente ✓' : 'Manquante')

console.log('\n🔌 API ROUTE /api/performances (POST):')
console.log('─'.repeat(50))
const perfApiBody = perfApi.match(/body\s*=\s*await request\.json\(\)[\s\S]*?const\s+\{[\s\S]*?\}\s*=\s*body/)?.[0] || ''
const perfApiFields = perfApiBody.match(/(\w+)/g) || []
const perfApiRequired = perfApi.match(/if\s*\(!.*?\)/g) || []
console.log('   Champs extraits du body:', perfApiFields.slice(perfApiFields.indexOf('body') + 1, perfApiFields.indexOf('body') + 10).join(', '))
console.log('   Validation:', perfApiRequired.length > 0 ? 'Présente ✓' : 'Manquante')

console.log('\n✅ Vérification terminée !')
console.log('\n📊 RÉSUMÉ DE COHÉRENCE:')
console.log('─'.repeat(50))

// Vérifications spécifiques
const checks = []

// Event: title requis
if (eventForm.includes('title') && eventForm.includes('required')) {
  checks.push('✅ Event.title est marqué comme requis dans le formulaire')
} else {
  checks.push('❌ Event.title devrait être requis')
}

// Event: location requis
if (eventForm.includes('location') && eventForm.includes('required')) {
  checks.push('✅ Event.location est marqué comme requis dans le formulaire')
} else {
  checks.push('❌ Event.location devrait être requis')
}

// Event: date requis
if (eventForm.includes('date') && eventForm.includes('required')) {
  checks.push('✅ Event.date est marqué comme requis dans le formulaire')
} else {
  checks.push('❌ Event.date devrait être requis')
}

// Performance: title requis
if (perfForm.includes('title') && perfForm.includes('required')) {
  checks.push('✅ Performance.title est marqué comme requis dans le formulaire')
} else {
  checks.push('❌ Performance.title devrait être requis')
}

// Performance: date requis
if (perfForm.includes('date') && perfForm.includes('required')) {
  checks.push('✅ Performance.date est marqué comme requis dans le formulaire')
} else {
  checks.push('❌ Performance.date devrait être requis')
}

// Performance: location optionnel (correct)
if (perfForm.includes('location') && !perfForm.includes('required')) {
  checks.push('✅ Performance.location est correctement optionnel')
} else if (!perfForm.includes('location')) {
  checks.push('⚠️  Performance.location manquant dans le formulaire')
}

checks.forEach(check => console.log(`   ${check}`))

console.log('\n')

