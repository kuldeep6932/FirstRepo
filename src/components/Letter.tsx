import { useState } from 'react'
import './Letter.css'

type LetterProps = {
  /** One paragraph/line per entry — see letterLines in src/data/story.ts. */
  lines: string[]
  /** Whether the Piku password (see AccessGate.tsx) was verified. Guests
   *  see the same sealed envelope, but tapping it just explains it's
   *  locked instead of opening. */
  unlocked: boolean
}

/**
 * A sealed envelope that opens into a short letter. Same "make them do
 * something to get the payoff" idea as the candles in BirthdayCelebration:
 * instead of just printing the text, it's tucked behind a tap — and, for
 * anyone but Piku, it stays sealed no matter how many times they tap it.
 */
export function Letter({ lines, unlocked }: LetterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [triedWhileLocked, setTriedWhileLocked] = useState(false)

  function handleTap() {
    if (unlocked) {
      setIsOpen(true)
    } else {
      setTriedWhileLocked(true)
    }
  }

  if (!isOpen) {
    return (
      <div className="letter-wrap">
        <button
          type="button"
          className="envelope"
          onClick={handleTap}
          aria-label={unlocked ? 'Open the letter' : "This letter is just for Piku"}
        >
          <span className="envelope__flap" aria-hidden="true" />
          <span className="envelope__seal" aria-hidden="true">
            {unlocked ? '❤' : '🔒'}
          </span>
          <span className="envelope__label">{unlocked ? 'Tap to open your letter' : 'Just for Piku 💕'}</span>
        </button>
        {!unlocked && triedWhileLocked && <p className="letter__locked-note">This one's just for Piku 💕</p>}
      </div>
    )
  }

  return (
    <div className="letter">
      {lines.map((line, index) => (
        <p key={index} className="letter__line">
          {line}
        </p>
      ))}
      <button type="button" className="letter__reseal" onClick={() => setIsOpen(false)}>
        Seal it again 💌
      </button>
    </div>
  )
}
