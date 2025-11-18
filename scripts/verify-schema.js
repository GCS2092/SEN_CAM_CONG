const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifySchema() {
  try {
    console.log('🔍 Vérification de la cohérence du schéma...\n')

    // Vérifier les événements
    const events = await prisma.event.findMany({
      include: {
        user: true,
        performances: true,
        likes: true,
        comments: true,
      },
    })

    console.log(`📅 Événements: ${events.length}`)
    events.forEach(event => {
      console.log(`   - ${event.title}`)
      console.log(`     Date: ${event.date.toLocaleDateString('fr-FR')}`)
      console.log(`     Lieu: ${event.location}`)
      console.log(`     Statut: ${event.status}`)
      console.log(`     Créé par: ${event.user.email}`)
      console.log(`     Performances liées: ${event.performances.length}`)
      console.log(`     Likes: ${event.likes.length}`)
      console.log(`     Commentaires: ${event.comments.length}`)
      console.log('')
    })

    // Vérifier les performances
    const performances = await prisma.performance.findMany({
      include: {
        user: true,
        event: true,
        media: true,
      },
    })

    console.log(`🎵 Performances: ${performances.length}`)
    performances.forEach(perf => {
      console.log(`   - ${perf.title}`)
      console.log(`     Date: ${perf.date.toLocaleDateString('fr-FR')}`)
      console.log(`     Créé par: ${perf.user.email}`)
      console.log(`     Événement lié: ${perf.event ? perf.event.title : 'Aucun'}`)
      console.log(`     Médias: ${perf.media.length}`)
      console.log('')
    })

    // Vérifier les médias
    const media = await prisma.media.findMany({
      include: {
        performance: true,
      },
    })

    console.log(`📸 Médias: ${media.length}`)
    media.forEach(m => {
      console.log(`   - ${m.title || 'Sans titre'} (${m.type})`)
      console.log(`     Performance liée: ${m.performance ? m.performance.title : 'Aucune'}`)
      console.log('')
    })

    // Vérifier les utilisateurs
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            events: true,
            performances: true,
            likes: true,
            comments: true,
          },
        },
      },
    })

    console.log(`👥 Utilisateurs: ${users.length}`)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`)
      console.log(`     Événements: ${user._count.events}`)
      console.log(`     Performances: ${user._count.performances}`)
      console.log(`     Likes: ${user._count.likes}`)
      console.log(`     Commentaires: ${user._count.comments}`)
      console.log('')
    })

    console.log('✅ Vérification terminée !')
    console.log('\n📊 Résumé:')
    console.log(`   - ${events.length} événement(s)`)
    console.log(`   - ${performances.length} performance(s)`)
    console.log(`   - ${media.length} média/médias`)
    console.log(`   - ${users.length} utilisateur(s)`)
    
    // Vérifier les relations
    console.log('\n🔗 Vérification des relations:')
    const eventsWithRelations = events.filter(e => e.performances.length > 0 || e.likes.length > 0 || e.comments.length > 0)
    console.log(`   - ${eventsWithRelations.length} événement(s) avec relations`)
    
    const performancesWithMedia = performances.filter(p => p.media.length > 0)
    console.log(`   - ${performancesWithMedia.length} performance(s) avec médias`)
    
    const performancesWithEvent = performances.filter(p => p.event !== null)
    console.log(`   - ${performancesWithEvent.length} performance(s) liée(s) à un événement`)

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifySchema()

