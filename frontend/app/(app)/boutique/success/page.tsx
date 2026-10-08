'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function BoutiqueSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/moi'), 4000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-hilunia-bg-dark flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-400" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold font-poppins mb-2">Paiement réussi !</h1>
        <p className="text-white/60">Tes pièces ont été créditées sur ton compte.</p>
        <p className="text-white/40 text-sm mt-2">Redirection automatique dans 4 secondes…</p>
      </div>
      <button
        onClick={() => router.replace('/moi')}
        className="px-8 py-3 bg-hilunia-violet rounded-2xl font-semibold"
      >
        Voir mon portefeuille
      </button>
    </div>
  )
}
