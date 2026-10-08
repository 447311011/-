'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MessageCircle, Loader2 } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { timeAgo, truncate, cn } from '@/lib/utils'
import type { Conversation } from '@/lib/types'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messages')
        if (res.ok) {
          const data = await res.json() as { conversations: Conversation[] }
          setConversations(data.conversations)
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchConversations()
  }, [])

  const filtered = conversations.filter(c =>
    c.otherUser.displayName.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-hilunia-border/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-black text-xl text-white">
            Messages
            {totalUnread > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-hilunia-rose text-white text-xs font-bold">
                {totalUnread}
              </span>
            )}
          </h1>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hilunia-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-hilunia-surface border border-hilunia-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-hilunia-text-dim focus:outline-none focus:ring-2 focus:ring-hilunia-violet/40"
          />
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-6 h-6 text-hilunia-violet animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-8">
          <MessageCircle className="w-12 h-12 text-hilunia-text-muted" />
          <div>
            <h3 className="font-bold text-white mb-1">
              {search ? 'Aucun résultat' : 'Aucune conversation'}
            </h3>
            <p className="text-sm text-hilunia-text-muted">
              {search
                ? 'Essaie avec un autre nom'
                : 'Fais des matchs pour commencer à discuter !'}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-hilunia-border/30">
          {filtered.map((conv, i) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ConversationItem conversation={conv} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function ConversationItem({ conversation: conv }: { conversation: Conversation }) {
  const { otherUser, lastMessage, unreadCount } = conv
  const hasUnread = unreadCount > 0

  return (
    <Link
      href={`/messages/${conv.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-hilunia-surface/50 transition-colors active:bg-hilunia-surface"
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={otherUser.mainPhoto}
          name={otherUser.displayName}
          userId={otherUser.id}
          size="lg"
          online={otherUser.isOnline}
          vipLevel={otherUser.vipLevel}
          verified={otherUser.selfieVerified}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={cn('font-semibold text-sm truncate', hasUnread ? 'text-white' : 'text-white/80')}>
            {otherUser.displayName}
          </span>
          {lastMessage && (
            <span className="text-[11px] text-hilunia-text-dim flex-shrink-0 ml-2">
              {timeAgo(lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className={cn('text-xs truncate', hasUnread ? 'text-white/80' : 'text-hilunia-text-muted')}>
            {lastMessage
              ? truncate(lastMessage.content, 40)
              : 'Envoie le premier message ! 👋'}
          </p>
          {hasUnread && (
            <span className="ml-2 min-w-[18px] h-[18px] flex-shrink-0 bg-hilunia-violet rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
