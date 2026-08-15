import type { Milestone } from '../data/story'
import { useReveal } from '../hooks/useReveal'
import { getPhotoUrl } from '../utils/photos'

type TimelineItemProps = {
  milestone: Milestone
  /** Stagger multiple cards so they don't all fade in at once. */
  revealDelay?: number
  /** Timeline (the parent) owns "which photo is open", since only one
   *  lightbox can be open at a time across the whole page. */
  onOpenPhoto: (photoUrls: string[], index: number, title: string) => void
}

/**
 * Renders ONE milestone. Timeline (below) will render one of these per
 * entry in the `milestones` array — this component only ever needs to
 * know about a single milestone, passed in as a prop.
 */
export function TimelineItem({ milestone, revealDelay = 0, onOpenPhoto }: TimelineItemProps) {
  const { ref, isVisible } = useReveal<HTMLElement>()

  // milestone.photos is just filenames (see story.ts) — resolve each to
  // the real URL Vite generated, and drop any that don't resolve.
  const photoUrls = milestone.photos
    .map((filename) => getPhotoUrl(filename))
    .filter((url): url is string => Boolean(url))

  return (
    <article
      ref={ref}
      className={`timeline-item reveal ${isVisible ? 'reveal--visible' : ''}`}
      style={{ transitionDelay: `${revealDelay}ms` }}
    >
      <div className="timeline-item__dot" aria-hidden="true" />
      <div className="timeline-item__card">
        {photoUrls.length > 0 && (
          <div className="timeline-item__photos">
            {photoUrls.map((url, index) => (
              <button
                key={url}
                type="button"
                className="timeline-item__photo-button"
                onClick={() => onOpenPhoto(photoUrls, index, milestone.title)}
              >
                <img src={url} alt={milestone.title} className="timeline-item__photo" />
              </button>
            ))}
          </div>
        )}
        <p className="timeline-item__date">{milestone.date}</p>
        <h3 className="timeline-item__title">{milestone.title}</h3>
        <p className="timeline-item__description">{milestone.description}</p>
      </div>
    </article>
  )
}
