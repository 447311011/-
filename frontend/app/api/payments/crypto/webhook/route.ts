import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHmac } from 'crypto'

const WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-cc-webhook-signature')!

  // Vérification HMAC
  const expected = createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
  if (signature !== expected) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  const event = JSON.parse(body) as {
    event: { type: string; data: { metadata: Record<string, string> } }
  }

  // On traite uniquement les charges confirmées
  if (event.event.type !== 'charge:confirmed') {
    return NextResponse.json({ received: true })
  }

  const meta = event.event.data.metadata
  const userId = meta.userId
  if (!userId) return NextResponse.json({ error: 'userId manquant' }, { status: 400 })

  if (meta.type === 'coins') {
    const coins = parseInt(meta.coins)
    const user = await prisma.user.update({
      where: { id: userId },
      data: { goldCoins: { increment: coins } },
      select: { goldCoins: true },
    })

    await prisma.coinTransaction.create({
      data: {
        userId,
        amount: coins,
        type: 'PURCHASE',
        description: `Achat Crypto — ${meta.packageId}`,
        metadata: JSON.stringify({ packageId: meta.packageId, method: 'crypto' }),
        balanceAfter: user.goldCoins,
      },
    })
  }

  if (meta.type === 'vip') {
    const vipExpiresAt = new Date()
    vipExpiresAt.setMonth(vipExpiresAt.getMonth() + 1)
    await prisma.user.update({
      where: { id: userId },
      data: { vipLevel: meta.vipLevel, vipExpiresAt },
    })
  }

  return NextResponse.json({ received: true })
}
