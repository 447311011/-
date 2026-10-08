import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = session.metadata!
  const userId = meta.userId

  if (!userId) return NextResponse.json({ error: 'userId manquant' }, { status: 400 })

  if (meta.type === 'coins') {
    const coins = parseInt(meta.coins)
    const amountEur = (session.amount_total ?? 0) / 100

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
        description: `Achat Stripe — ${meta.packageId} (${amountEur}€)`,
        metadata: JSON.stringify({ sessionId: session.id, packageId: meta.packageId }),
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

// Stripe envoie du raw body — désactiver le parsing automatique de Next.js
export const config = { api: { bodyParser: false } }
