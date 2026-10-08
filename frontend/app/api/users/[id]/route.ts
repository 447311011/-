import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeParseJSON } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const userId = params.id

  const blocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: session.user.id, blockedId: userId },
        { blockerId: userId, blockedId: session.user.id },
      ],
    },
  })

  if (blocked) return NextResponse.json({ error: 'Profil non disponible' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { id: userId, isBanned: false },
    select: {
      id: true,
      vipLevel: true,
      selfieVerified: true,
      isOnline: true,
      lastSeen: true,
      profile: {
        select: {
          displayName: true,
          birthDate: true,
          gender: true,
          bio: true,
          city: true,
          country: true,
          height: true,
          goal: true,
          interests: true,
          photos: { where: { isMain: false }, select: { url: true }, orderBy: { order: 'asc' } },
          mainPhoto: { where: { isMain: true }, select: { url: true }, take: 1 },
        },
      },
    },
  })

  if (!user || !user.profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const p = user.profile
  const allPhotos = [
    ...(p.mainPhoto.map(ph => ph.url)),
    ...(p.photos.map(ph => ph.url)),
  ]

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: p.displayName,
      birthDate: p.birthDate?.toISOString(),
      gender: p.gender,
      bio: p.bio,
      city: p.city,
      country: p.country,
      height: p.height,
      goal: p.goal,
      interests: safeParseJSON<string[]>(p.interests ?? '[]', []),
      photos: allPhotos,
      vipLevel: user.vipLevel,
      selfieVerified: user.selfieVerified,
      isOnline: user.isOnline,
    },
  })
}
