import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { goldCoins: true, gameTokens: true, diamonds: true },
    }),
    prisma.coinTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

  return NextResponse.json({ ...user, transactions })
}

// Daily login bonus
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lastDailyBonus: true, goldCoins: true },
  })

  if (!user) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const now = new Date()
  const lastBonus = user.lastDailyBonus

  if (lastBonus) {
    const hoursSince = (now.getTime() - lastBonus.getTime()) / (1000 * 60 * 60)
    if (hoursSince < 20) {
      return NextResponse.json({ error: 'Bonus déjà réclamé aujourd\'hui', nextIn: Math.ceil(20 - hoursSince) }, { status: 400 })
    }
  }

  const DAILY_AMOUNT = 30

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        goldCoins: { increment: DAILY_AMOUNT },
        lastDailyBonus: now,
        xp: { increment: 10 },
      },
    }),
    prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        amount: DAILY_AMOUNT,
        type: 'DAILY_LOGIN',
        description: 'Bonus de connexion quotidienne',
        balanceAfter: user.goldCoins + DAILY_AMOUNT,
      },
    }),
  ])

  return NextResponse.json({ earned: DAILY_AMOUNT })
}
