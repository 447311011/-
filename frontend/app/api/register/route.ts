import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { isAdult } from '@/lib/utils'
import { COIN_REWARDS } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation des données
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, birthDate } = result.data

    // Vérification de l'âge (18 ans minimum)
    if (!isAdult(birthDate)) {
      return NextResponse.json(
        { error: 'Tu dois avoir 18 ans ou plus pour t\'inscrire sur Hilunia.' },
        { status: 403 }
      )
    }

    // Vérifie si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé.' },
        { status: 409 }
      )
    }

    // Hachage du mot de passe
    const passwordHash = await bcrypt.hash(password, 12)

    // Création de l'utilisateur avec bonus de bienvenue
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          goldCoins: COIN_REWARDS.WELCOME,
        },
      })

      // Enregistrement de la transaction de bienvenue
      await tx.coinTransaction.create({
        data: {
          userId: newUser.id,
          amount: COIN_REWARDS.WELCOME,
          type: 'WELCOME_BONUS',
          description: 'Bonus de bienvenue sur Hilunia !',
          balanceAfter: COIN_REWARDS.WELCOME,
        },
      })

      // Création du profil vide (à compléter par l'utilisateur)
      await tx.profile.create({
        data: {
          userId: newUser.id,
          displayName: email.split('@')[0], // Temporaire
          birthDate: new Date(birthDate),
          gender: 'MALE', // À mettre à jour lors de la complétion du profil
          isComplete: false,
        },
      })

      return newUser
    })

    // TODO: Envoyer email de vérification

    return NextResponse.json(
      {
        message: 'Compte créé avec succès ! Bienvenue sur Hilunia.',
        userId: user.id,
        welcomeCoins: COIN_REWARDS.WELCOME,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Réessaie.' },
      { status: 500 }
    )
  }
}
