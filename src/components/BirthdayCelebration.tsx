import { useEffect, useMemo, useState } from 'react'
import { letterLines } from '../data/story'
import { CANDLES_BLOWN_EVENT } from '../utils/audio'
import { Letter } from './Letter'
import './BirthdayCelebration.css'

type BirthdayCelebrationProps = {
  /** e.g. "Piku's Birthday" — used for the aria labels and the heading. */
  label: string
  /** The heartfelt bit, revealed once every candle is blown out. */
  message: string
  /** Whether the Piku password was verified — passed straight to <Letter>. */
  isPiku: boolean
}

const CANDLE_COUNT = 5

/**
 * What used to be a single static line ("It's here! Happy X! 🎉") is now a
 * tiny game: a cake with lit candles. Clicking a flame blows it out, same
 * as the real thing. Once the last one is out, confetti rains down and the
 * actual birthday message appears — so there's a small "make a wish"
 * moment before the payoff instead of everything showing up at once.
 */
export function BirthdayCelebration({ label, message, isPiku }: BirthdayCelebrationProps) {
  // One boolean per candle: true = still lit. Starting state is "all lit",
  // same idea as the countdown starting at the full time remaining.
  const [litCandles, setLitCandles] = useState<boolean[]>(() => Array(CANDLE_COUNT).fill(true))
  const allBlownOut = litCandles.every((lit) => !lit)

  // MusicPlayer (src/components/MusicPlayer.tsx) doesn't know this
  // component exists, and vice versa — instead of wiring them together
  // with shared state, this just announces "the candles are out" on the
  // window, the same way the browser announces clicks/keypresses. Anything
  // that cares (right now, just MusicPlayer) can listen for it.
  useEffect(() => {
    if (allBlownOut) {
      window.dispatchEvent(new Event(CANDLES_BLOWN_EVENT))
    }
  }, [allBlownOut])

  function blowOutCandle(index: number) {
    // Functional update — same reason as Countdown's setTimeLeft: we're
    // deriving the next array from the previous one, not from a variable
    // that might be stale by the time this runs.
    setLitCandles((prev) => prev.map((lit, i) => (i === index ? false : lit)))
  }

  function relight() {
    setLitCandles(Array(CANDLE_COUNT).fill(true))
  }

  return (
    <div className="celebration">
      <p className="celebration__prompt">
        {allBlownOut ? `It's here! Happy ${label}! 🎉` : 'Make a wish, then blow out every candle ✨'}
      </p>

      <div className="cake" role="group" aria-label={`Birthday cake for ${label} — tap each candle to blow it out`}>
        <div className="cake__candles">
          {litCandles.map((lit, index) => (
            <button
              key={index}
              type="button"
              className="candle"
              onClick={() => blowOutCandle(index)}
              disabled={!lit}
              aria-label={lit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} is out`}
            >
              <span className={`candle__flame ${lit ? '' : 'candle__flame--out'}`} aria-hidden="true" />
              <span className="candle__stick" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="cake__layer cake__layer--top" aria-hidden="true" />
        <div className="cake__layer cake__layer--middle" aria-hidden="true" />
        <div className="cake__layer cake__layer--base" aria-hidden="true" />
      </div>

      {allBlownOut && (
        <>
          <Confetti />
          <p className="celebration__message">{message}</p>
          <Letter lines={letterLines} unlocked={isPiku} />
          <button type="button" className="celebration__replay" onClick={relight}>
            Light them again 🕯️
          </button>
        </>
      )}
    </div>
  )
}

const CONFETTI_COLORS = ['#c9184a', '#f7c6d9', '#ffd166', '#8ac6d1', '#fffaf5']
const CONFETTI_COUNT = 70

/**
 * Purely decorative, so it's the one place here using Math.random() — a
 * fixed-position field of divs, each given a random horizontal spot, fall
 * speed and delay, then let loose with a CSS animation (see
 * BirthdayCelebration.css) instead of anything hand-animated in JS.
 *
 * useMemo so the random layout is only rolled once per reveal, not
 * regenerated (and re-triggering every animation) on every re-render.
 */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.6 + Math.random() * 1.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      })),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti__piece"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            // Baked into the starting transform; the falling keyframes
            // (see CSS) add further rotation on top of this offset.
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
