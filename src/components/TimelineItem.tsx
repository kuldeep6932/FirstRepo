import type { Milestone } from '../data/story'
import { useReveal } from '../hooks/useReveal'

type TimelineItemProps = {
  milestone: Milestone
  /** Stagger multiple cards so they don't all fade in at once. */
  revealDelay?: number
}

/**
 * Renders ONE milestone. Timeline (below) will render one of these per
 * entry in the `milestones` array — this component only ever needs to
 * know about a single milestone, passed in as a prop.
 */
export function TimelineItem({ milestone, revealDelay = 0 }: TimelineItemProps) {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`timeline-item reveal ${isVisible ? 'reveal--visible' : ''}`}
      style={{ transitionDelay: `${revealDelay}ms` }}
    >
      <div className="timeline-item__dot" aria-hidden="true" />
      <div className="timeline-item__card">
        <p className="timeline-item__date">{milestone.date}</p>
        <h3 className="timeline-item__title">{milestone.title}</h3>
        <p className="timeline-item__description">{milestone.description}</p>
      </div>
    </article>
  )
}
