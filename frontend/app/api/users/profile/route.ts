import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'
import { COIN_REWARDS } from '@/lib/types'
import { safeParseJSON } from '@/lib/utils'

// GET /api/users/profile - Récupère le profil de l'utilisateur connecté
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      photos: { orderBy: { order: 'asc' } },
      user: {
        select: {
          goldCoins: true,
          diamonds: true,
          gameTokens: true,
          vipLevel: true,
          selfieVerified: true,
          level: true,
          xp: true,
          isOnline: true,
          lastSeenAt: true,
        },
      },
    },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
  }

  return NextResponse.json({
    ...profile,
    interests: safeParseJSON<string[]>(profile.interests, []),
    languages: safeParseJSON<string[]>(profile.languages, []),
  })
}

// PUT /api/users/profile - Met à jour le profil
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = profileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { displayName, gender, interestedIn, goal, bio, city, country, height, interests, languages } = result.data

    // Vérifie si le profil devient complet
    const isNowComplete = !!(displayName && gender && bio && (interests?.length ?? 0) > 0)

    const updatedProfile = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.update({
        where: { userId: session.user.id },
        data: {
          displayName,
          gender,
          interestedIn: interestedIn ?? 'BOTH',
          goal,
          bio,
          city,
          country,
          height: height || null,
          interests: JSON.stringify(interests ?? []),
          languages: JSON.stringify(languages ?? []),
          isComplete: isNowComplete,
        },
        include: {
          photos: { orderBy: { order: 'asc' } },
        },
      })

      // Bonus pour la première complétion de profil
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { bonusProfileDone: true, goldCoins: true },
      })

      if (isNowComplete && user && !user.bonusProfileDone) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            goldCoins: { increment: COIN_REWARDS.PROFILE_COMPLETE },
            xp: { increment: 50 },
            bonusProfileDone: true,
          },
        })

        await tx.coinTransaction.create({
          data: {
            userId: session.user.id,
            amount: COIN_REWARDS.PROFILE_COMPLETE,
            type: 'PROFILE_COMPLETE_BONUS',
            description: 'Bonus profil complété ! 🎉',
            balanceAfter: user.goldCoins + COIN_REWARDS.PROFILE_COMPLETE,
          },
        })
      }

      return profile
    })

    return NextResponse.json({
      ...updatedProfile,
      interests: safeParseJSON<string[]>(updatedProfile.interests, []),
      languages: safeParseJSON<string[]>(updatedProfile.languages, []),
      bonusEarned: isNowComplete ? COIN_REWARDS.PROFILE_COMPLETE : 0,
    })
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
