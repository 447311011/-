import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hilunia-bg-dark flex flex-col">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hilunia-violet/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-hilunia-rose/15 rounded-full blur-[100px]" />
      </div>

      {/* Logo */}
      <div className="relative flex justify-center pt-10 pb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-hilunia flex items-center justify-center shadow-glow-violet group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display font-black text-2xl text-gradient">HILUNIA</span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
