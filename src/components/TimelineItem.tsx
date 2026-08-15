import type { Milestone } from '../data/story'

type TimelineItemProps = {
  milestone: Milestone
}

/**
 * Renders ONE milestone. Timeline (below) will render one of these per
 * entry in the `milestones` array — this component only ever needs to
 * know about a single milestone, passed in as a prop.
 */
export function TimelineItem({ milestone }: TimelineItemProps) {
  return (
    <article className="timeline-item">
      <div className="timeline-item__dot" aria-hidden="true" />
      <div className="timeline-item__card">
        <p className="timeline-item__date">{milestone.date}</p>
        <h3 className="timeline-item__title">{milestone.title}</h3>
        <p className="timeline-item__description">{milestone.description}</p>
      </div>
    </article>
  )
}
