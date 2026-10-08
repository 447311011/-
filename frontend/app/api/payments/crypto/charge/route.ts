import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { COIN_PACKAGES, VIP_PACKAGES } from '@/lib/payment-packages'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY!

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { packageId, type } = await req.json() as { packageId: string; type: 'coins' | 'vip' }

  let name: string
  let priceEur: number
  let metadata: Record<string, string>

  if (type === 'coins') {
    const pkg = COIN_PACKAGES.find(p => p.id === packageId)
    if (!pkg) return NextResponse.json({ error: 'Pack introuvable' }, { status: 400 })
    name = `Hilunia — ${pkg.label}`
    priceEur = pkg.priceEur
    metadata = { type: 'coins', packageId, userId: session.user.id, coins: String(pkg.coins + pkg.bonusCoins) }
  } else {
    const pkg = VIP_PACKAGES.find(p => p.id === packageId)
    if (!pkg) return NextResponse.json({ error: 'Pack introuvable' }, { status: 400 })
    name = `Hilunia — ${pkg.label}`
    priceEur = pkg.priceEur
    metadata = { type: 'vip', packageId, userId: session.user.id, vipLevel: pkg.level }
  }

  const res = await fetch('https://api.commerce.coinbase.com/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22',
    },
    body: JSON.stringify({
      name,
      description: `Achat Hilunia — ${name}`,
      local_price: { amount: String(priceEur), currency: 'EUR' },
      pricing_type: 'fixed_price',
      redirect_url: `${APP_URL}/boutique/success`,
      cancel_url: `${APP_URL}/boutique/cancel`,
      metadata,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('[crypto/charge]', err)
    return NextResponse.json({ error: 'Erreur Coinbase Commerce' }, { status: 500 })
  }

  const { data } = await res.json() as { data: { hosted_url: string } }
  return NextResponse.json({ url: data.hosted_url })
}
