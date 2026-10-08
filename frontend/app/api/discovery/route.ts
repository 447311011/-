import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateAge, haversineDistance, safeParseJSON } from '@/lib/utils'

// GET /api/discovery - Récupère les profils à découvrir
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const minAge = parseInt(searchParams.get('minAge') ?? '18')
  const maxAge = parseInt(searchParams.get('maxAge') ?? '99')
  const maxDistance = parseInt(searchParams.get('maxDistance') ?? '500')
  const gender = searchParams.get('gender')

  const userId = session.user.id

  // Récupère le profil de l'utilisateur connecté
  const myProfile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      latitude: true,
      longitude: true,
      interestedIn: true,
      gender: true,
    },
  })

  // Récupère les IDs des utilisateurs déjà likés/passés
  const alreadyInteracted = await prisma.like.findMany({
    where: { fromUserId: userId },
    select: { toUserId: true },
  })

  // Récupère les IDs des utilisateurs bloqués
  const blockedUsers = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  })

  const excludedIds = [
    userId,
    ...alreadyInteracted.map(l => l.toUserId),
    ...blockedUsers.map(b => b.blockerId === userId ? b.blockedId : b.blockerId),
  ]

  // Calcule la date min/max pour le filtre d'âge
  const today = new Date()
  const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())
  const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate())

  // Filtre de genre
  let genderFilter: object = {}
  const interestedIn = gender ?? myProfile?.interestedIn ?? 'BOTH'
  if (interestedIn === 'MALE') {
    genderFilter = { gender: 'MALE' }
  } else if (interestedIn === 'FEMALE') {
    genderFilter = { gender: 'FEMALE' }
  }
  // BOTH et ALL = pas de filtre de genre

  const profiles = await prisma.profile.findMany({
    where: {
      userId: { notIn: excludedIds },
      isComplete: true,
      birthDate: {
        gte: minBirthDate,
        lte: maxBirthDate,
      },
      ...genderFilter,
    },
    include: {
      photos: { orderBy: { order: 'asc' }, take: 6 },
      user: {
        select: {
          id: true,
          isOnline: true,
          lastSeenAt: true,
          vipLevel: true,
          selfieVerified: true,
          level: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit * 3, // Récupère plus pour filtrer par distance
    orderBy: [
      { user: { vipLevel: 'desc' } }, // Les VIP en premier
      { lastActiveAt: 'desc' },
    ],
  })

  // Transforme et filtre par distance
  const myLat = myProfile?.latitude
  const myLon = myProfile?.longitude

  const profileCards = profiles
    .map(profile => {
      const age = calculateAge(profile.birthDate)
      const interests = safeParseJSON<string[]>(profile.interests, [])
      const languages = safeParseJSON<string[]>(profile.languages, [])

      let distanceKm: number | undefined
      if (myLat && myLon && profile.latitude && profile.longitude) {
        distanceKm = haversineDistance(myLat, myLon, profile.latitude, profile.longitude)
      }

      return {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        age,
        gender: profile.gender,
        city: profile.city,
        country: profile.country,
        countryCode: profile.countryCode,
        bio: profile.bio,
        height: profile.height,
        goal: profile.goal,
        interests,
        languages,
        photos: profile.photos.map(p => p.url),
        mainPhoto: profile.photos.find(p => p.isMain)?.url ?? profile.photos[0]?.url,
        isOnline: profile.user.isOnline,
        lastSeenAt: profile.user.lastSeenAt.toISOString(),
        vipLevel: profile.user.vipLevel,
        selfieVerified: profile.user.selfieVerified,
        level: profile.user.level,
        distanceKm,
      }
    })
    .filter(p => !maxDistance || !p.distanceKm || p.distanceKm <= maxDistance)
    .slice(0, limit)

  return NextResponse.json({
    profiles: profileCards,
    total: profileCards.length,
    hasMore: profileCards.length === limit,
    page,
  })
}

// POST /api/discovery - Like ou passe un profil
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { toUserId, type } = await req.json() as { toUserId: string; type: 'LIKE' | 'SUPER_LIKE' | 'PASS' }

    if (!toUserId || !type) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const fromUserId = session.user.id

    // Coût du Super Like
    if (type === 'SUPER_LIKE') {
      const user = await prisma.user.findUnique({
        where: { id: fromUserId },
        select: { goldCoins: true },
      })

      if (!user || user.goldCoins < 50) {
        return NextResponse.json(
          { error: 'Pas assez de pièces pour un Super Like (50 pièces requises)' },
          { status: 402 }
        )
      }
    }

    // Crée ou met à jour le Like
    const result = await prisma.$transaction(async (tx) => {
      await tx.like.upsert({
        where: { fromUserId_toUserId: { fromUserId, toUserId } },
        create: { fromUserId, toUserId, type },
        update: { type },
      })

      // Débit pour Super Like
      if (type === 'SUPER_LIKE') {
        const user = await tx.user.update({
          where: { id: fromUserId },
          data: { goldCoins: { decrement: 50 } },
          select: { goldCoins: true },
        })
        await tx.coinTransaction.create({
          data: {
            userId: fromUserId,
            amount: -50,
            type: 'SUPER_LIKE_COST',
            description: 'Super Like envoyé',
            balanceAfter: user.goldCoins,
          },
        })
      }

      // Vérifie s'il y a un match (si l'autre a aussi liké)
      if (type !== 'PASS') {
        const reciprocalLike = await tx.like.findFirst({
          where: {
            fromUserId: toUserId,
            toUserId: fromUserId,
            type: { in: ['LIKE', 'SUPER_LIKE'] },
          },
        })

        if (reciprocalLike) {
          // Match ! Crée le match et la conversation
          const existingMatch = await tx.match.findFirst({
            where: {
              OR: [
                { user1Id: fromUserId, user2Id: toUserId },
                { user1Id: toUserId, user2Id: fromUserId },
              ],
            },
          })

          if (!existingMatch) {
            const match = await tx.match.create({
              data: {
                user1Id: fromUserId,
                user2Id: toUserId,
              },
            })

            // Crée la conversation liée au match
            await tx.conversation.create({
              data: {
                matchId: match.id,
                user1Id: fromUserId,
                user2Id: toUserId,
              },
            })

            // Bonus premier match
            await tx.user.update({
              where: { id: fromUserId },
              data: { xp: { increment: 20 } },
            })

            return { matched: true, matchId: match.id }
          }
        }
      }

      return { matched: false }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur like:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
