import { useEffect, useMemo, useRef, useState } from 'react'
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
// Extra messages revealed above a search result, so there's something to
// scroll up into instead of the loaded window ending right at it.
const JUMP_BUFFER = 100
// Search re-scans the full array on every query change — cheap on its own,
// but capped anyway so a one-letter query doesn't render a 20,000-row list.
const MAX_RESULTS = 200
const HIGHLIGHT_DURATION_MS = 2000

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
  const [isSearching, setIsSearching] = useState(false)
  const [rawQuery, setRawQuery] = useState('')
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Debounced separately from the input's own value: typing stays instant,
  // the (cheap, but still a full 60,000-message scan) search itself waits
  // until you pause for a moment.
  useEffect(() => {
    const timeoutId = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 200)
    return () => clearTimeout(timeoutId)
  }, [rawQuery])

  const searchResults = useMemo(() => {
    if (!query) return []
    const results: { index: number; message: ChatMessage }[] = []
    // Walk backward so the most recent matches — probably the more
    // relevant ones — are what fills up the capped result list first.
    for (let i = messages.length - 1; i >= 0 && results.length < MAX_RESULTS; i--) {
      if (messages[i].text.toLowerCase().includes(query)) {
        results.push({ index: i, message: messages[i] })
      }
    }
    return results
  }, [query, messages])

  // Jump to the bottom (the most recent message) the moment it opens,
  // same as opening a real chat app.
  useEffect(() => {
    if (isOpen) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [isOpen])

  // Runs after jumpToMessage below reveals enough messages for the target
  // to actually exist in the DOM — scrolls it into view and fades the
  // highlight back out a couple seconds later.
  useEffect(() => {
    if (highlightIndex === null) return
    document.getElementById(`chat-msg-${highlightIndex}`)?.scrollIntoView({ block: 'center' })
    const timeoutId = setTimeout(() => setHighlightIndex(null), HIGHLIGHT_DURATION_MS)
    return () => clearTimeout(timeoutId)
  }, [highlightIndex, visibleCount])

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

  function jumpToMessage(index: number) {
    setIsSearching(false)
    setRawQuery('')
    setQuery('')
    // Reveal enough of the window that `index` falls inside
    // messages.slice(-visibleCount), plus a little more above it to scroll
    // into.
    setVisibleCount((count) => Math.max(count, Math.min(messages.length - index + JUMP_BUFFER, messages.length)))
    setHighlightIndex(index)
  }

  function closeSearch() {
    setIsSearching(false)
    setRawQuery('')
    setQuery('')
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
  const startIndex = messages.length - visibleMessages.length
  let lastDate: string | null = null

  return (
    <div className="chat-viewer" role="dialog" aria-modal="true" aria-label="Our chat history">
      <header className="chat-viewer__header">
        {isSearching ? (
          <>
            <button type="button" className="chat-viewer__back" onClick={closeSearch} aria-label="Back to chat">
              ←
            </button>
            <input
              type="text"
              className="chat-viewer__search-input"
              placeholder="Search our chat…"
              value={rawQuery}
              onChange={(event) => setRawQuery(event.target.value)}
              autoFocus
              aria-label="Search our chat"
            />
          </>
        ) : (
          <>
            <p className="chat-viewer__title">Our Chat 💕</p>
            <div className="chat-viewer__header-actions">
              <button
                type="button"
                className="chat-viewer__icon-button"
                onClick={() => setIsSearching(true)}
                aria-label="Search our chat"
              >
                🔍
              </button>
              <button
                type="button"
                className="chat-viewer__icon-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </>
        )}
      </header>

      {isSearching ? (
        <SearchResults query={query} results={searchResults} onSelect={jumpToMessage} />
      ) : (
        <div className="chat-viewer__scroll" ref={scrollRef}>
          {hasMore && (
            <button type="button" className="chat-viewer__load-more" onClick={loadEarlier}>
              ↑ Load earlier messages
            </button>
          )}

          {visibleMessages.map((message, i) => {
            const absoluteIndex = startIndex + i
            const showDateSeparator = message.date !== lastDate
            lastDate = message.date

            return (
              <div key={absoluteIndex} id={`chat-msg-${absoluteIndex}`}>
                {showDateSeparator && (
                  <div className="chat-viewer__date-separator">
                    <span>{formatDate(message.date)}</span>
                  </div>
                )}
                <ChatBubble message={message} highlighted={absoluteIndex === highlightIndex} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SearchResults({
  query,
  results,
  onSelect,
}: {
  query: string
  results: { index: number; message: ChatMessage }[]
  onSelect: (index: number) => void
}) {
  if (!query) {
    return <p className="chat-viewer__search-hint">Type to search across every message.</p>
  }
  if (results.length === 0) {
    return <p className="chat-viewer__search-hint">No messages found for "{query}".</p>
  }

  return (
    <div className="chat-viewer__results">
      <p className="chat-viewer__results-count">
        {results.length === MAX_RESULTS ? `First ${MAX_RESULTS} matches` : `${results.length} match${results.length === 1 ? '' : 'es'}`}
      </p>
      {results.map(({ index, message }) => (
        <button
          type="button"
          key={index}
          className="chat-viewer__result"
          onClick={() => onSelect(index)}
        >
          <span className="chat-viewer__result-meta">
            {message.sender ?? 'System'} · {formatDate(message.date)}, {message.time}
          </span>
          <span className="chat-viewer__result-snippet">{highlightSnippet(message.text, query)}</span>
        </button>
      ))}
    </div>
  )
}

// A short window of text around the match, rather than the whole message —
// some of these run to several paragraphs, and the results list only needs
// enough to recognize which one this is.
const SNIPPET_RADIUS = 40

function highlightSnippet(text: string, query: string) {
  const matchIndex = text.toLowerCase().indexOf(query)
  if (matchIndex === -1) return text

  const start = Math.max(0, matchIndex - SNIPPET_RADIUS)
  const end = Math.min(text.length, matchIndex + query.length + SNIPPET_RADIUS)

  return (
    <>
      {start > 0 && '…'}
      {text.slice(start, matchIndex)}
      <mark>{text.slice(matchIndex, matchIndex + query.length)}</mark>
      {text.slice(matchIndex + query.length, end)}
      {end < text.length && '…'}
    </>
  )
}

function ChatBubble({ message, highlighted }: { message: ChatMessage; highlighted: boolean }) {
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
      <div
        className={`chat-bubble ${isRight ? 'chat-bubble--right' : 'chat-bubble--left'} ${highlighted ? 'chat-bubble--highlighted' : ''}`}
      >
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
