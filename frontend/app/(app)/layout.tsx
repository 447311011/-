import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import BottomNav from '@/components/layout/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user as Record<string, unknown>

  // Redirige vers la complétion du profil si non terminé
  // (sauf si déjà sur la page de profil)
  return (
    <div className="min-h-screen bg-hilunia-bg-dark">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav unreadMessages={0} />
    </div>
  )
}
