import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../utils/chat'
import './ChatViewer.css'

type ChatViewerProps = {
  messages: ChatMessage[]
}

// How many messages render at once. Your export has 60,000+ messages —
// rendering all of them as DOM nodes in one go would be slow to paint and
// heavy to scroll, especially on a phone. Instead this starts at the most
// recent chunk (like opening a real chat) and grows backward on request.
const CHUNK_SIZE = 300

/**
 * Floating button + full-screen modal, same shape as MusicPlayer's toggle
 * and Timeline's <Lightbox>: a fixed button that's always there, and an
 * overlay that only exists while open. Only ever rendered when the Piku
 * password decrypted successfully (see App.tsx), so there's no separate
 * "locked" state to handle here — if this component exists, the messages
 * are real.
 */
export function ChatViewer({ messages }: ChatViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(Math.min(CHUNK_SIZE, messages.length))
  const scrollRef = useRef<HTMLDivElement>(null)

  // Jump to the bottom (the most recent message) the moment it opens,
  // same as opening a real chat app.
  useEffect(() => {
    if (isOpen) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [isOpen])

  function loadEarlier() {
    const el = scrollRef.current
    const previousHeight = el?.scrollHeight ?? 0
    setVisibleCount((count) => Math.min(count + CHUNK_SIZE, messages.length))
    // Revealing older messages ABOVE the current scroll position pushes
    // everything down — without this, the view would jump to the top
    // instead of staying put on what you were already reading.
    requestAnimationFrame(() => {
      if (el) el.scrollTop += el.scrollHeight - previousHeight
    })
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open our chat history"
      >
        💬
      </button>
    )
  }

  const visibleMessages = messages.slice(-visibleCount)
  const hasMore = visibleCount < messages.length
  let lastDate: string | null = null

  return (
    <div className="chat-viewer" role="dialog" aria-modal="true" aria-label="Our chat history">
      <header className="chat-viewer__header">
        <p className="chat-viewer__title">Our Chat 💕</p>
        <button type="button" className="chat-viewer__close" onClick={() => setIsOpen(false)} aria-label="Close">
          ×
        </button>
      </header>

      <div className="chat-viewer__scroll" ref={scrollRef}>
        {hasMore && (
          <button type="button" className="chat-viewer__load-more" onClick={loadEarlier}>
            ↑ Load earlier messages
          </button>
        )}

        {visibleMessages.map((message, index) => {
          const showDateSeparator = message.date !== lastDate
          lastDate = message.date

          return (
            <div key={index}>
              {showDateSeparator && (
                <div className="chat-viewer__date-separator">
                  <span>{formatDate(message.date)}</span>
                </div>
              )}
              <ChatBubble message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (!message.sender) {
    // A WhatsApp system line ("You pinned a message"), not something
    // either of you typed — shown like WhatsApp itself shows it, centered
    // and quiet rather than in a speech bubble.
    return <p className="chat-bubble chat-bubble--system">{message.text}</p>
  }

  // Pragati is the one unlocking this with her own password, so her
  // messages sit on the right — same side WhatsApp puts "your" own
  // messages on when you open your own chat.
  const isRight = message.sender === 'Pragati'

  return (
    <div className={`chat-bubble-row ${isRight ? 'chat-bubble-row--right' : ''}`}>
      <div className={`chat-bubble ${isRight ? 'chat-bubble--right' : 'chat-bubble--left'}`}>
        {message.isMedia ? (
          <p className="chat-bubble__media">📎 Media (not included in the export)</p>
        ) : (
          <p className="chat-bubble__text">{message.text}</p>
        )}
        <span className="chat-bubble__time">
          {message.time}
          {message.edited && ' · edited'}
        </span>
      </div>
    </div>
  )
}

function formatDate(isoDate: string): string {
  // isoDate is 'YYYY-MM-DD' — parsed as UTC midnight by `new Date()`, so
  // format in UTC too, otherwise a negative-offset timezone could roll it
  // back to the previous day.
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
