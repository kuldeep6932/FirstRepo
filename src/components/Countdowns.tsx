import { countdownEvents } from '../data/story'
import { Countdown } from './Countdown'

/**
 * Same pattern as <Timeline>: the *content* (which countdowns exist) lives
 * in data/story.ts as a plain array, and this component just `.map()`s
 * over it. Adding a wedding-anniversary countdown later means adding one
 * object to `countdownEvents` — nothing here or in Countdown.tsx changes.
 */
export function Countdowns() {
  return (
    <>
      {countdownEvents.map((event) => (
        <Countdown key={event.id} label={event.label} targetDate={event.date} />
      ))}
    </>
  )
}
