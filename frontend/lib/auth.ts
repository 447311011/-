import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      // Rafraîchit les données utilisateur
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            goldCoins: true,
            diamonds: true,
            gameTokens: true,
            vipLevel: true,
            isAdmin: true,
            isBanned: true,
            selfieVerified: true,
            level: true,
            profile: {
              select: {
                displayName: true,
                isComplete: true,
                photos: {
                  where: { isMain: true },
                  select: { url: true },
                  take: 1,
                },
              },
            },
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.goldCoins = dbUser.goldCoins
          token.diamonds = dbUser.diamonds
          token.gameTokens = dbUser.gameTokens
          token.vipLevel = dbUser.vipLevel
          token.isAdmin = dbUser.isAdmin
          token.isBanned = dbUser.isBanned
          token.selfieVerified = dbUser.selfieVerified
          token.level = dbUser.level
          token.displayName = dbUser.profile?.displayName ?? null
          token.profileComplete = dbUser.profile?.isComplete ?? false
          token.mainPhoto = dbUser.profile?.photos[0]?.url ?? null
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        ;(session.user as Record<string, unknown>).goldCoins = token.goldCoins
        ;(session.user as Record<string, unknown>).diamonds = token.diamonds
        ;(session.user as Record<string, unknown>).gameTokens = token.gameTokens
        ;(session.user as Record<string, unknown>).vipLevel = token.vipLevel
        ;(session.user as Record<string, unknown>).isAdmin = token.isAdmin
        ;(session.user as Record<string, unknown>).isBanned = token.isBanned
        ;(session.user as Record<string, unknown>).selfieVerified = token.selfieVerified
        ;(session.user as Record<string, unknown>).level = token.level
        ;(session.user as Record<string, unknown>).displayName = token.displayName
        ;(session.user as Record<string, unknown>).profileComplete = token.profileComplete
        ;(session.user as Record<string, unknown>).mainPhoto = token.mainPhoto
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnApp = nextUrl.pathname.startsWith('/accueil') ||
        nextUrl.pathname.startsWith('/moments') ||
        nextUrl.pathname.startsWith('/salons') ||
        nextUrl.pathname.startsWith('/messages') ||
        nextUrl.pathname.startsWith('/moi') ||
        nextUrl.pathname.startsWith('/profil') ||
        nextUrl.pathname.startsWith('/admin')

      if (isOnApp) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            profile: {
              select: { displayName: true },
            },
          },
        })

        if (!user) return null
        if (user.isBanned) throw new Error('Compte suspendu')

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) return null

        // Mise à jour du statut en ligne
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isOnline: true,
            lastSeenAt: new Date(),
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName ?? user.email,
        }
      },
    }),
  ],
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
