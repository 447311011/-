'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Smile, Image as ImageIcon, Loader2, Phone, Video, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/ui/Avatar'
import { timeAgo, cn } from '@/lib/utils'
import type { Message, Conversation } from '@/lib/types'

interface ConversationDetail extends Conversation {
  messages: Message[]
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${id}`)
        if (res.ok) {
          const data = await res.json() as ConversationDetail
          setConversation(data)
          setMessages(data.messages ?? [])
        } else {
          toast.error('Conversation introuvable')
          router.push('/messages')
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchConversation()
  }, [id, router])

  useEffect(() => {
    scrollToBottom(false)
  }, [messages, scrollToBottom])

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || sending) return

    setInput('')
    setSending(true)

    const tempId = `temp-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      conversationId: id,
      senderId: 'me',
      receiverId: conversation?.otherUser.id ?? '',
      content,
      type: 'TEXT',
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticMsg])
    scrollToBottom()

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id, content }),
      })

      const data = await res.json() as { message?: Message; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Erreur envoi')
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setInput(content)
        return
      }

      if (data.message) {
        setMessages(prev => prev.map(m => m.id === tempId ? data.message! : m))
      }
    } catch {
      toast.error('Erreur réseau')
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setInput(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-hilunia-violet animate-spin" />
      </div>
    )
  }

  if (!conversation) return null

  const { otherUser } = conversation

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-3 py-2.5 flex items-center gap-3">
        <Link href="/messages" className="p-1.5 rounded-xl hover:bg-hilunia-surface transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <Link href={`/profil/${otherUser.id}`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar
            src={otherUser.mainPhoto}
            name={otherUser.displayName}
            userId={otherUser.id}
            size="sm"
            online={otherUser.isOnline}
            vipLevel={otherUser.vipLevel}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{otherUser.displayName}</p>
            <p className="text-[11px] text-hilunia-text-muted">
              {otherUser.isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-hilunia-surface transition-colors">
            <Phone className="w-4 h-4 text-hilunia-text-muted" />
          </button>
          <button className="p-2 rounded-xl hover:bg-hilunia-surface transition-colors">
            <Video className="w-4 h-4 text-hilunia-text-muted" />
          </button>
          <button className="p-2 rounded-xl hover:bg-hilunia-surface transition-colors">
            <MoreVertical className="w-4 h-4 text-hilunia-text-muted" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Avatar
              src={otherUser.mainPhoto}
              name={otherUser.displayName}
              userId={otherUser.id}
              size="2xl"
              online={otherUser.isOnline}
              vipLevel={otherUser.vipLevel}
            />
            <div>
              <h3 className="font-bold text-white mb-1">{otherUser.displayName}</h3>
              <p className="text-sm text-hilunia-text-muted">C&apos;est un nouveau match 🎉</p>
              <p className="text-xs text-hilunia-text-dim mt-1">Envoie le premier message !</p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} otherUser={otherUser} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 glass border-t border-hilunia-border/50 px-3 py-3">
        <div className="flex items-end gap-2">
          <button className="p-2.5 rounded-2xl hover:bg-hilunia-surface transition-colors flex-shrink-0">
            <Smile className="w-5 h-5 text-hilunia-text-muted" />
          </button>
          <button className="p-2.5 rounded-2xl hover:bg-hilunia-surface transition-colors flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-hilunia-text-muted" />
          </button>

          <div className="flex-1 bg-hilunia-surface border border-hilunia-border rounded-3xl px-4 py-2.5 flex items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void sendMessage()
                }
              }}
              placeholder="Message..."
              className="flex-1 bg-transparent text-sm text-white placeholder-hilunia-text-dim focus:outline-none"
              maxLength={2000}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => void sendMessage()}
            disabled={!input.trim() || sending}
            className={cn(
              'p-2.5 rounded-2xl flex-shrink-0 transition-all',
              input.trim()
                ? 'bg-gradient-hilunia shadow-glow-violet'
                : 'bg-hilunia-surface opacity-50'
            )}
          >
            {sending
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Send className="w-5 h-5 text-white" />
            }
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function MessageList({ messages, otherUser }: {
  messages: Message[]
  otherUser: { id: string; displayName: string; mainPhoto?: string | null; vipLevel: string }
}) {
  let lastDate = ''

  return (
    <>
      {messages.map((msg) => {
        const isMe = msg.senderId === 'me' || (msg.senderId !== otherUser.id)
        const msgDate = new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
        const showDate = msgDate !== lastDate
        lastDate = msgDate

        return (
          <div key={msg.id}>
            {showDate && (
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-hilunia-border/40" />
                <span className="text-xs text-hilunia-text-dim px-2">{msgDate}</span>
                <div className="flex-1 h-px bg-hilunia-border/40" />
              </div>
            )}
            <MessageBubble msg={msg} isMe={isMe} otherUser={otherUser} />
          </div>
        )
      })}
    </>
  )
}

function MessageBubble({ msg, isMe, otherUser }: {
  msg: Message
  isMe: boolean
  otherUser: { id: string; displayName: string; mainPhoto?: string | null; vipLevel: string }
}) {
  const isTemp = msg.id.startsWith('temp-')

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-2 mb-1', isMe ? 'justify-end' : 'justify-start')}
    >
      {!isMe && (
        <Avatar
          src={otherUser.mainPhoto}
          name={otherUser.displayName}
          userId={otherUser.id}
          size="xs"
          vipLevel={otherUser.vipLevel}
        />
      )}

      <div className={cn('max-w-[75%]', isMe ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
        {msg.mediaUrl && msg.type === 'IMAGE' && (
          <div className="rounded-2xl overflow-hidden">
            <Image src={msg.mediaUrl} alt="Photo" width={200} height={200} className="object-cover" />
          </div>
        )}

        {msg.content && (
          <div
            className={cn(
              'px-3.5 py-2 rounded-2xl text-sm leading-relaxed',
              isMe
                ? 'bg-gradient-hilunia text-white rounded-br-sm'
                : 'bg-hilunia-surface border border-hilunia-border/50 text-white rounded-bl-sm',
              isTemp && 'opacity-70'
            )}
          >
            {msg.content}
          </div>
        )}

        <span className={cn('text-[10px] text-hilunia-text-dim px-1', isMe ? 'text-right' : 'text-left')}>
          {timeAgo(msg.createdAt)}
          {isMe && !isTemp && (
            <span className="ml-1">{msg.isRead ? '✓✓' : '✓'}</span>
          )}
        </span>
      </div>
    </motion.div>
  )
}
