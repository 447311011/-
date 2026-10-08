import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'profile' | 'moment' | 'selfie'

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    // Validation du type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Formats: JPG, PNG, WebP, GIF, MP4' },
        { status: 400 }
      )
    }

    // Validation de la taille
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10 MB)' },
        { status: 400 }
      )
    }

    // Génère un nom de fichier unique
    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${session.user.id}_${Date.now()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', type ?? 'general')

    // Crée le dossier si nécessaire
    await mkdir(uploadDir, { recursive: true })

    // Sauvegarde le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, fileName), buffer)

    const url = `/uploads/${type ?? 'general'}/${fileName}`

    // Si c'est une photo de profil, met à jour la BDD
    if (type === 'profile') {
      const isMain = formData.get('isMain') === 'true'
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        include: { photos: true },
      })

      if (profile) {
        // Si isMain, retire le flag main des autres
        if (isMain) {
          await prisma.profilePhoto.updateMany({
            where: { profileId: profile.id },
            data: { isMain: false },
          })
        }

        await prisma.profilePhoto.create({
          data: {
            profileId: profile.id,
            url,
            isMain: isMain || profile.photos.length === 0,
            order: profile.photos.length,
          },
        })
      }
    }

    // Si c'est un selfie de vérification
    if (type === 'selfie') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { selfieUrl: url },
      })
      // Note: Dans la production, on envoie à une API de vérification IA
    }

    return NextResponse.json({ url, success: true })
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}
