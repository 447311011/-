import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB

// type: 'profile' | 'moment' | 'selfie' | 'room'
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const userId = session.user.id

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string) ?? 'profile'
  const isMain = formData.get('isMain') === 'true'

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
  }

  const mimeType = file.type
  const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: 'Format non supporté. Accepté: JPG, PNG, WebP, GIF, MP4, WebM' },
      { status: 400 }
    )
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'Image trop lourde (max 10 MB)' }, { status: 400 })
  }
  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return NextResponse.json({ error: 'Vidéo trop lourde (max 100 MB)' }, { status: 400 })
  }

  // Profile photos: max 6
  if (type === 'profile') {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true, _count: { select: { photos: true } } },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
    }
    if (profile._count.photos >= 6) {
      return NextResponse.json({ error: 'Maximum 6 photos atteint' }, { status: 400 })
    }
  }

  // Save file to public/uploads/userId/
  const ext = extname(file.name) || (isImage ? '.jpg' : '.mp4')
  const filename = `${randomUUID()}${ext}`
  const userDir = join(process.cwd(), 'public', 'uploads', userId)
  await mkdir(userDir, { recursive: true })
  const filePath = join(userDir, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  const publicUrl = `/uploads/${userId}/${filename}`

  // Persist to DB depending on type
  if (type === 'profile') {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true, _count: { select: { photos: true } } },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
    }

    const order = profile._count.photos
    const makeMain = isMain || order === 0

    // If making this the new main, unset previous main
    if (makeMain) {
      await prisma.profilePhoto.updateMany({
        where: { profileId: profile.id, isMain: true },
        data: { isMain: false },
      })
    }

    const photo = await prisma.profilePhoto.create({
      data: {
        profileId: profile.id,
        url: publicUrl,
        isMain: makeMain,
        order,
      },
    })

    return NextResponse.json({ url: publicUrl, photoId: photo.id, isMain: makeMain })
  }

  if (type === 'selfie') {
    await prisma.user.update({
      where: { id: userId },
      data: { selfieUrl: publicUrl },
    })
    return NextResponse.json({ url: publicUrl })
  }

  // For 'moment' and 'room', just return the URL — caller handles DB
  return NextResponse.json({ url: publicUrl, mediaType: isVideo ? 'VIDEO' : 'IMAGE' })
}

// DELETE a profile photo
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const userId = session.user.id
  const { photoId } = await req.json() as { photoId: string }
  if (!photoId) return NextResponse.json({ error: 'photoId requis' }, { status: 400 })

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const photo = await prisma.profilePhoto.findFirst({
    where: { id: photoId, profileId: profile.id },
  })
  if (!photo) return NextResponse.json({ error: 'Photo introuvable' }, { status: 404 })

  await prisma.profilePhoto.delete({ where: { id: photoId } })

  // If deleted photo was main, promote the first remaining photo
  if (photo.isMain) {
    const next = await prisma.profilePhoto.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    })
    if (next) {
      await prisma.profilePhoto.update({
        where: { id: next.id },
        data: { isMain: true },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
