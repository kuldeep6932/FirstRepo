import { countdownEvents } from '../data/story'
import { Countdown } from './Countdown'

type CountdownsProps = {
  /** Passed straight through to every <Countdown> — see App.tsx. */
  isPiku: boolean
}

/**
 * Same pattern as <Timeline>: the *content* (which countdowns exist) lives
 * in data/story.ts as a plain array, and this component just `.map()`s
 * over it. Adding a wedding-anniversary countdown later means adding one
 * object to `countdownEvents` — nothing here or in Countdown.tsx changes.
 */
export function Countdowns({ isPiku }: CountdownsProps) {
  return (
    <>
      {countdownEvents.map((event) => (
        <Countdown
          key={event.id}
          label={event.label}
          targetDate={event.date}
          message={event.message}
          isPiku={isPiku}
        />
      ))}
    </>
  )
}
