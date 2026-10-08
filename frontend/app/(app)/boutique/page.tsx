'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Bitcoin, Coins, Crown, ChevronLeft, Loader2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { COIN_PACKAGES, VIP_PACKAGES } from '@/lib/payment-packages'

type PaymentMethod = 'stripe' | 'crypto'

export default function BoutiquePage() {
  const router = useRouter()
  const [method, setMethod] = useState<PaymentMethod>('stripe')
  const [loading, setLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<'coins' | 'vip'>('coins')

  const handlePurchase = async (packageId: string, type: 'coins' | 'vip') => {
    setLoading(`${type}-${packageId}`)
    try {
      const endpoint = method === 'stripe'
        ? '/api/payments/stripe/session'
        : '/api/payments/crypto/charge'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, type }),
      })

      const data = await res.json() as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        toast.error(data.error ?? 'Erreur de paiement')
        return
      }

      // Redirige vers Stripe Checkout ou Coinbase Commerce
      window.location.href = data.url
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-hilunia-bg-dark pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-hilunia-bg-dark/90 backdrop-blur-sm border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold font-poppins">Boutique</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Sélecteur de méthode de paiement */}
        <div>
          <p className="text-sm text-white/50 mb-3">Mode de paiement</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod('stripe')}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                method === 'stripe'
                  ? 'border-hilunia-violet bg-hilunia-violet/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className={`p-2 rounded-xl ${method === 'stripe' ? 'bg-hilunia-violet/20' : 'bg-white/10'}`}>
                <CreditCard className="w-5 h-5 text-hilunia-violet" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Carte</p>
                <p className="text-xs text-white/40">Visa, CB, Apple Pay</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('crypto')}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                method === 'crypto'
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className={`p-2 rounded-xl ${method === 'crypto' ? 'bg-yellow-400/20' : 'bg-white/10'}`}>
                <Bitcoin className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Crypto</p>
                <p className="text-xs text-white/40">BTC, ETH, USDC</p>
              </div>
            </button>
          </div>
        </div>

        {/* Onglets pièces / VIP */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setTab('coins')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'coins' ? 'bg-hilunia-violet text-white' : 'text-white/50'
            }`}
          >
            <Coins className="w-4 h-4" /> Pièces d&apos;or
          </button>
          <button
            onClick={() => setTab('vip')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'vip' ? 'bg-hilunia-violet text-white' : 'text-white/50'
            }`}
          >
            <Crown className="w-4 h-4" /> Abonnement VIP
          </button>
        </div>

        {/* Packs pièces */}
        {tab === 'coins' && (
          <div className="space-y-3">
            {COIN_PACKAGES.map(pkg => {
              const isLoading = loading === `coins-${pkg.id}`
              return (
                <button
                  key={pkg.id}
                  onClick={() => void handlePurchase(pkg.id, 'coins')}
                  disabled={!!loading}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    pkg.popular
                      ? 'border-hilunia-violet bg-hilunia-violet/10 ring-1 ring-hilunia-violet/40'
                      : 'border-white/10 bg-white/5'
                  } hover:bg-white/10 disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 flex items-center justify-center">
                      <span className="text-2xl">🪙</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{pkg.label}</p>
                        {pkg.badge && (
                          <span className="text-xs bg-hilunia-violet/30 text-hilunia-violet px-2 py-0.5 rounded-full">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{pkg.coins} + {pkg.bonusCoins} bonus</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-hilunia-violet" />
                    ) : (
                      <span className="text-lg font-bold text-hilunia-violet">{pkg.priceEur}€</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Packs VIP */}
        {tab === 'vip' && (
          <div className="space-y-3">
            {VIP_PACKAGES.map(pkg => {
              const isLoading = loading === `vip-${pkg.id}`
              return (
                <button
                  key={pkg.id}
                  onClick={() => void handlePurchase(pkg.id, 'vip')}
                  disabled={!!loading}
                  className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" style={{ color: pkg.color }} />
                      <span className="font-bold" style={{ color: pkg.color }}>{pkg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span className="text-lg font-bold">{pkg.priceEur}€<span className="text-sm text-white/40">/mois</span></span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {pkg.perks.map(perk => (
                      <div key={perk} className="flex items-center gap-2 text-sm text-white/70">
                        <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Info sécurité */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/30 pt-2">
          <span>🔒</span>
          <span>Paiement sécurisé • Aucune donnée bancaire stockée</span>
        </div>
      </div>
    </div>
  )
}
