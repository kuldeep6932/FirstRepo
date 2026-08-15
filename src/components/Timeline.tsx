import { useState } from 'react'
import { milestones } from '../data/story'
import { TimelineItem } from './TimelineItem'
import { Lightbox } from './Lightbox'
import './Timeline.css'

type LightboxState = {
  photos: string[]
  index: number
  title: string
}

/**
 * This is the payoff of keeping content as data (src/data/story.ts):
 * adding a fifth milestone later means adding one object to that array —
 * this component never changes.
 *
 * `.map()` transforms an array into a new array — here, an array of
 * Milestone objects becomes an array of <TimelineItem> elements, one per
 * entry, which React then renders in order.
 *
 * The `key={milestone.id}` prop is required whenever you render a list in
 * React: it's how React tells items apart between re-renders (e.g. if you
 * ever reorder or filter the array) instead of just diffing by position.
 * It must be unique among siblings, which is exactly why every milestone
 * in story.ts has a stable `id`.
 */
export function Timeline() {
  // "Which photo (if any) is open in the lightbox" lives here, one level
  // above every TimelineItem, because only one can be open at a time for
  // the whole timeline — it's not each card's own private state.
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  return (
    <section className="timeline">
      <h2 className="timeline__heading">Our Story So Far</h2>
      <div className="timeline__track">
        {milestones.map((milestone, index) => (
          <TimelineItem
            key={milestone.id}
            milestone={milestone}
            revealDelay={index * 120}
            onOpenPhoto={(photos, photoIndex, title) => setLightbox({ photos, index: photoIndex, title })}
          />
        ))}
      </div>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
          onNavigate={(nextIndex) => setLightbox({ ...lightbox, index: nextIndex })}
        />
      )}
    </section>
  )
}
