import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Route de debug — À SUPPRIMER avant la mise en production
export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const profileCount = await prisma.profile.count()
    const completeCount = await prisma.profile.count({ where: { isComplete: true } })
    const photoCount = await prisma.profilePhoto.count()

    const profiles = await prisma.profile.findMany({
      take: 5,
      select: {
        displayName: true,
        isComplete: true,
        gender: true,
        birthDate: true,
        userId: true,
        _count: { select: { photos: true } },
      },
    })

    return NextResponse.json({
      counts: { userCount, profileCount, completeCount, photoCount },
      sampleProfiles: profiles,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
