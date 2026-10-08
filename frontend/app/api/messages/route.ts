import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { messageSchema } from '@/lib/validations'
import { safeParseJSON } from '@/lib/utils'

// GET /api/messages - Liste des conversations
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const userId = session.user.id
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')

  // Messages d'une conversation spécifique
  if (conversationId) {
    // Vérifie que l'utilisateur a accès
    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    })

    if (!conv) {
      return NextResponse.json({ error: 'Conversation non trouvée' }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    })

    // Marque les messages comme lus
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    })

    return NextResponse.json({ messages })
  }

  // Liste de toutes les conversations
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        where: { deletedAt: null },
      },
      user1: {
        select: {
          id: true,
          isOnline: true,
          lastSeenAt: true,
          vipLevel: true,
          selfieVerified: true,
          profile: {
            select: {
              displayName: true,
              photos: {
                where: { isMain: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      },
      user2: {
        select: {
          id: true,
          isOnline: true,
          lastSeenAt: true,
          vipLevel: true,
          selfieVerified: true,
          profile: {
            select: {
              displayName: true,
              photos: {
                where: { isMain: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Compte les non-lus par conversation
  const unreadCounts = await prisma.message.groupBy({
    by: ['conversationId'],
    where: { receiverId: userId, isRead: false },
    _count: true,
  })

  const unreadMap = new Map(unreadCounts.map(u => [u.conversationId, u._count]))

  const formatted = conversations.map(conv => {
    const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1
    const profile = otherUser.profile
    const mainPhoto = profile?.photos[0]?.url

    return {
      id: conv.id,
      matchId: conv.matchId,
      otherUser: {
        id: otherUser.id,
        displayName: profile?.displayName ?? 'Utilisateur',
        mainPhoto,
        isOnline: otherUser.isOnline,
        lastSeenAt: otherUser.lastSeenAt.toISOString(),
        vipLevel: otherUser.vipLevel,
        selfieVerified: otherUser.selfieVerified,
      },
      lastMessage: conv.messages[0] ?? null,
      unreadCount: unreadMap.get(conv.id) ?? 0,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    }
  })

  return NextResponse.json({ conversations: formatted })
}

// POST /api/messages - Envoyer un message
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = messageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { content, type = 'TEXT', mediaUrl, replyToId } = result.data
    const { conversationId } = body as { conversationId: string }

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId requis' }, { status: 400 })
    }

    const userId = session.user.id

    // Vérifie accès à la conversation
    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    })

    if (!conv) {
      return NextResponse.json({ error: 'Conversation non trouvée' }, { status: 404 })
    }

    const receiverId = conv.user1Id === userId ? conv.user2Id : conv.user1Id

    // Crée le message
    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          receiverId,
          content,
          type: type ?? 'TEXT',
          mediaUrl,
          replyToId,
        },
      })

      // Met à jour la conversation
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      return msg
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Erreur message:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
