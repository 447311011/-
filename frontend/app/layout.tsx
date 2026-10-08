import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hilunia — Connecte-toi avec le monde',
    template: '%s | Hilunia',
  },
  description:
    'Hilunia est la plateforme de rencontre et d\'amitié mondiale, sécurisée et authentique. Disponible dans 150+ pays.',
  keywords: ['rencontre', 'amitié', 'chat vocal', 'dating', 'hilunia', 'connexion'],
  authors: [{ name: 'Hilunia' }],
  creator: 'Hilunia',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://hilunia.com',
    title: 'Hilunia — Connecte-toi avec le monde',
    description: 'La rencontre authentique, sécurisée et mondiale.',
    siteName: 'Hilunia',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hilunia',
    description: 'La rencontre authentique, sécurisée et mondiale.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#14101F',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} dark`}>
      <body className="bg-hilunia-bg-dark text-white antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1E1836',
              color: '#ffffff',
              border: '1px solid #2D2550',
              borderRadius: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#7C5CFF',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4FA3',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
