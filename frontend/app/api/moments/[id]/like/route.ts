import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const momentId = params.id

  const existing = await prisma.momentLike.findUnique({
    where: { userId_momentId: { userId: session.user.id, momentId } },
  })

  if (existing) return NextResponse.json({ liked: true })

  await prisma.$transaction([
    prisma.momentLike.create({ data: { userId: session.user.id, momentId } }),
    prisma.moment.update({ where: { id: momentId }, data: { likeCount: { increment: 1 } } }),
  ])

  return NextResponse.json({ liked: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const momentId = params.id

  const existing = await prisma.momentLike.findUnique({
    where: { userId_momentId: { userId: session.user.id, momentId } },
  })

  if (!existing) return NextResponse.json({ liked: false })

  await prisma.$transaction([
    prisma.momentLike.delete({ where: { userId_momentId: { userId: session.user.id, momentId } } }),
    prisma.moment.update({ where: { id: momentId }, data: { likeCount: { decrement: 1 } } }),
  ])

  return NextResponse.json({ liked: false })
}
