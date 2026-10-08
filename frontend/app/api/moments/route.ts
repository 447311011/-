import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { momentSchema } from '@/lib/validations'
import { COIN_REWARDS } from '@/lib/types'

// GET /api/moments - Feed des moments
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const userId = searchParams.get('userId')

  const userId_ = session.user.id

  // Moments d'un utilisateur spécifique
  const where = userId
    ? { userId, isArchived: false }
    : {
        isArchived: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      }

  const moments = await prisma.moment.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          vipLevel: true,
          selfieVerified: true,
          isOnline: true,
          profile: {
            select: {
              displayName: true,
              photos: {
                where: { isMain: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      },
      likes: {
        where: { userId: userId_ },
        select: { id: true },
        take: 1,
      },
      _count: {
        select: { likes: true, comments: true, views: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const formatted = moments.map(m => ({
    id: m.id,
    userId: m.userId,
    user: {
      id: m.user.id,
      displayName: m.user.profile?.displayName ?? 'Utilisateur',
      mainPhoto: m.user.profile?.photos[0]?.url,
      vipLevel: m.user.vipLevel,
      selfieVerified: m.user.selfieVerified,
      isOnline: m.user.isOnline,
    },
    mediaUrl: m.mediaUrl,
    mediaType: m.mediaType,
    caption: m.caption,
    likeCount: m._count.likes,
    commentCount: m._count.comments,
    viewCount: m._count.views,
    isLiked: m.likes.length > 0,
    createdAt: m.createdAt.toISOString(),
    expiresAt: m.expiresAt?.toISOString(),
  }))

  return NextResponse.json({ moments: formatted, hasMore: moments.length === limit })
}

// POST /api/moments - Créer un moment
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = momentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { caption, mediaUrl, mediaType, expiresIn } = result.data
    const userId = session.user.id

    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : null

    const moment = await prisma.$transaction(async (tx) => {
      const newMoment = await tx.moment.create({
        data: {
          userId,
          mediaUrl,
          mediaType,
          caption,
          expiresAt,
        },
      })

      // Bonus premier moment
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { bonusFirstMoment: true, goldCoins: true },
      })

      if (user && !user.bonusFirstMoment) {
        await tx.user.update({
          where: { id: userId },
          data: {
            goldCoins: { increment: COIN_REWARDS.FIRST_MOMENT },
            xp: { increment: 30 },
            bonusFirstMoment: true,
          },
        })

        await tx.coinTransaction.create({
          data: {
            userId,
            amount: COIN_REWARDS.FIRST_MOMENT,
            type: 'FIRST_MOMENT_BONUS',
            description: 'Bonus premier Moment publié ! 📸',
            balanceAfter: user.goldCoins + COIN_REWARDS.FIRST_MOMENT,
          },
        })
      }

      return newMoment
    })

    return NextResponse.json({ moment }, { status: 201 })
  } catch (error) {
    console.error('Erreur moment:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
