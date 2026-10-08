import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reportSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json() as unknown
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })

  const { reportedId, reason, description } = parsed.data

  if (reportedId === session.user.id) {
    return NextResponse.json({ error: 'Vous ne pouvez pas vous signaler vous-même' }, { status: 400 })
  }

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      reportedId,
      reason,
      description: description ?? null,
    },
  })

  return NextResponse.json({ success: true })
}
