import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Stripe from 'stripe'
import { COIN_PACKAGES, VIP_PACKAGES } from '@/lib/payment-packages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { packageId, type } = await req.json() as { packageId: string; type: 'coins' | 'vip' }

  let name: string
  let amount: number
  let metadata: Record<string, string>

  if (type === 'coins') {
    const pkg = COIN_PACKAGES.find(p => p.id === packageId)
    if (!pkg) return NextResponse.json({ error: 'Pack introuvable' }, { status: 400 })
    name = pkg.label
    amount = pkg.priceStripe
    metadata = {
      type: 'coins',
      packageId,
      userId: session.user.id,
      coins: String(pkg.coins + pkg.bonusCoins),
    }
  } else {
    const pkg = VIP_PACKAGES.find(p => p.id === packageId)
    if (!pkg) return NextResponse.json({ error: 'Pack introuvable' }, { status: 400 })
    name = pkg.label
    amount = pkg.priceStripe
    metadata = {
      type: 'vip',
      packageId,
      userId: session.user.id,
      vipLevel: pkg.level,
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'eur', product_data: { name: `Hilunia — ${name}` }, unit_amount: amount }, quantity: 1 }],
    mode: 'payment',
    success_url: `${APP_URL}/boutique/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/boutique/cancel`,
    metadata,
    customer_email: session.user.email ?? undefined,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
