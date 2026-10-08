import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateAge, haversineDistance, safeParseJSON } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    console.log('[discovery] userId:', userId)

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 20)
  const minAge = parseInt(searchParams.get('minAge') ?? '18')
  const maxAge = parseInt(searchParams.get('maxAge') ?? '99')

  const userId = session.user.id

  const myProfile = await prisma.profile.findUnique({
    where: { userId },
    select: { latitude: true, longitude: true, interestedIn: true },
  })

  const alreadyInteracted = await prisma.like.findMany({
    where: { fromUserId: userId },
    select: { toUserId: true },
  })

  const blockedUsers = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  })

  const excludedIds = [
    userId,
    ...alreadyInteracted.map(l => l.toUserId),
    ...blockedUsers.map(b => b.blockerId === userId ? b.blockedId : b.blockerId),
  ]
  console.log('[discovery] excludedIds:', excludedIds.length, excludedIds)
  console.log('[discovery] birthDate range:', minBirthDate.toISOString(), '->', maxBirthDate.toISOString())

  const today = new Date()
  const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())
  const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate())

  // Filtre de genre selon interestedIn (BOTH = tout le monde)
  const interestedIn = myProfile?.interestedIn ?? 'BOTH'
  const genderFilter =
    interestedIn === 'MALE' ? { gender: 'MALE' as const } :
    interestedIn === 'FEMALE' ? { gender: 'FEMALE' as const } :
    {}

  const profiles = await prisma.profile.findMany({
    where: {
      userId: { notIn: excludedIds },
      isComplete: true,
      birthDate: { gte: minBirthDate, lte: maxBirthDate },
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
    take: limit * 3,
    orderBy: { user: { vipLevel: 'desc' } },
  })

  console.log('[discovery] profiles found:', profiles.length)
  const myLat = myProfile?.latitude
  const myLon = myProfile?.longitude

  const profileCards = profiles
    .map(profile => {
      const age = profile.birthDate ? calculateAge(profile.birthDate) : 18
      const interests = safeParseJSON<string[]>(profile.interests ?? '[]', [])

      let distanceKm: number | undefined
      if (myLat && myLon && profile.latitude && profile.longitude) {
        distanceKm = haversineDistance(myLat, myLon, profile.latitude, profile.longitude)
      }

      return {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName ?? 'Anonyme',
        age,
        gender: profile.gender,
        city: profile.city,
        country: profile.country,
        bio: profile.bio,
        height: profile.height,
        goal: profile.goal,
        interests,
        photos: profile.photos.map(p => p.url),
        mainPhoto: profile.photos.find(p => p.isMain)?.url ?? profile.photos[0]?.url ?? null,
        isOnline: profile.user.isOnline,
        vipLevel: profile.user.vipLevel,
        selfieVerified: profile.user.selfieVerified,
        level: profile.user.level,
        distanceKm,
      }
    })
    .slice(0, limit)

  return NextResponse.json({ profiles: profileCards, hasMore: profileCards.length === limit })
  } catch (err) {
    console.error('[discovery GET]', err)
    return NextResponse.json({ error: 'Erreur serveur', detail: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { toUserId, type } = await req.json() as { toUserId: string; type: 'LIKE' | 'SUPER_LIKE' | 'PASS' }

  if (!toUserId || !type) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })

  const fromUserId = session.user.id

  if (type === 'SUPER_LIKE') {
    const user = await prisma.user.findUnique({ where: { id: fromUserId }, select: { goldCoins: true } })
    if (!user || user.goldCoins < 50) {
      return NextResponse.json({ error: 'Pas assez de pièces (50 requises)' }, { status: 402 })
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.like.upsert({
      where: { fromUserId_toUserId: { fromUserId, toUserId } },
      create: { fromUserId, toUserId, type },
      update: { type },
    })

    if (type === 'SUPER_LIKE') {
      const user = await tx.user.update({
        where: { id: fromUserId },
        data: { goldCoins: { decrement: 50 } },
        select: { goldCoins: true },
      })
      await tx.coinTransaction.create({
        data: { userId: fromUserId, amount: -50, type: 'SUPER_LIKE_COST', description: 'Super Like', balanceAfter: user.goldCoins },
      })
    }

    if (type !== 'PASS') {
      const reciprocalLike = await tx.like.findFirst({
        where: { fromUserId: toUserId, toUserId: fromUserId, type: { in: ['LIKE', 'SUPER_LIKE'] } },
      })

      if (reciprocalLike) {
        const existingMatch = await tx.match.findFirst({
          where: { OR: [{ user1Id: fromUserId, user2Id: toUserId }, { user1Id: toUserId, user2Id: fromUserId }] },
        })

        if (!existingMatch) {
          const match = await tx.match.create({ data: { user1Id: fromUserId, user2Id: toUserId } })
          await tx.conversation.create({ data: { matchId: match.id, user1Id: fromUserId, user2Id: toUserId } })
          await tx.user.update({ where: { id: fromUserId }, data: { xp: { increment: 20 } } })
          return { matched: true, matchId: match.id }
        }
      }
    }

    return { matched: false }
  })

  return NextResponse.json(result)
}
