import { useEffect } from 'react'
import './Lightbox.css'

type LightboxProps = {
  /** Already-resolved image URLs (see src/utils/photos.ts), not filenames. */
  photos: string[]
  index: number
  title: string
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

/**
 * The overlay that shows one enlarged photo. Lives once at the Timeline
 * level (not one per card) because only one photo can be open at a time —
 * "which photo, if any, is open" is state that belongs to the whole
 * timeline, not to any single TimelineItem.
 */
export function Lightbox({ photos, index, title, onClose, onNavigate }: LightboxProps) {
  const hasMultiple = photos.length > 1

  useEffect(() => {
    // Same shape as the Countdown effect: subscribe to something outside
    // React (here, keyboard events on the whole window) and clean it up.
    // Without the cleanup, opening/closing the lightbox repeatedly would
    // stack up duplicate listeners.
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (hasMultiple && event.key === 'ArrowRight') onNavigate((index + 1) % photos.length)
      if (hasMultiple && event.key === 'ArrowLeft') {
        onNavigate((index - 1 + photos.length) % photos.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, photos.length, hasMultiple, onClose, onNavigate])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {hasMultiple && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Previous photo"
          onClick={(event) => {
            event.stopPropagation()
            onNavigate((index - 1 + photos.length) % photos.length)
          }}
        >
          ‹
        </button>
      )}

      {/* stopPropagation so clicking the photo itself doesn't also trigger
          the backdrop's onClose click, right below it. */}
      <img src={photos[index]} alt={title} className="lightbox__image" onClick={(e) => e.stopPropagation()} />

      {hasMultiple && (
        <button
          className="lightbox__nav lightbox__nav--next"
          aria-label="Next photo"
          onClick={(event) => {
            event.stopPropagation()
            onNavigate((index + 1) % photos.length)
          }}
        >
          ›
        </button>
      )}

      <p className="lightbox__caption">
        {title}
        {hasMultiple ? ` — ${index + 1}/${photos.length}` : ''}
      </p>
    </div>
  )
}
