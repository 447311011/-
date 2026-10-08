import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { roomSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const language = searchParams.get('language')

  const rooms = await prisma.chatRoom.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
      ...(language ? { language } : {}),
    },
    include: {
      host: {
        select: {
          id: true,
          profile: { select: { displayName: true, mainPhoto: { where: { isMain: true }, select: { url: true }, take: 1 } } },
        },
      },
      members: { select: { userId: true } },
    },
    orderBy: [{ members: { _count: 'desc' } }, { createdAt: 'desc' }],
    take: 30,
  })

  const formatted = rooms.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    language: r.language,
    isPrivate: r.isPrivate,
    maxMembers: r.maxMembers,
    memberCount: r.members.length,
    host: {
      id: r.host.id,
      displayName: r.host.profile?.displayName ?? 'Anonyme',
      mainPhoto: r.host.profile?.mainPhoto?.[0]?.url ?? null,
    },
  }))

  return NextResponse.json({ rooms: formatted })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json() as unknown
  const parsed = roomSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })

  const { name, description, category, language, isPrivate, maxMembers } = parsed.data

  const room = await prisma.chatRoom.create({
    data: {
      hostId: session.user.id,
      name,
      description,
      category: category ?? 'GENERAL',
      language: language ?? 'fr',
      isPrivate: isPrivate ?? false,
      maxMembers: maxMembers ?? 20,
      members: {
        create: {
          userId: session.user.id,
          role: 'HOST',
        },
      },
    },
  })

  return NextResponse.json({ room }, { status: 201 })
}
