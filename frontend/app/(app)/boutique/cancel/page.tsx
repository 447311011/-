'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'

export default function BoutiqueCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-hilunia-bg-dark flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
        <XCircle className="w-12 h-12 text-red-400" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold font-poppins mb-2">Paiement annulé</h1>
        <p className="text-white/60">Tu as annulé la transaction. Rien n&apos;a été débité.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => router.replace('/boutique')}
          className="px-6 py-3 bg-hilunia-violet rounded-2xl font-semibold"
        >
          Réessayer
        </button>
        <button
          onClick={() => router.replace('/accueil')}
          className="px-6 py-3 bg-white/10 rounded-2xl font-semibold"
        >
          Accueil
        </button>
      </div>
    </div>
  )
}
