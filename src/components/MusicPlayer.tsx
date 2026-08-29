import { useEffect, useRef, useState } from 'react'
import { CANDLES_BLOWN_EVENT, getBackgroundMusicUrl } from '../utils/audio'
import './MusicPlayer.css'

/**
 * A floating toggle button AND a "start itself as soon as possible"
 * attempt. Browsers deliberately block audio-with-sound from starting
 * until the visitor has interacted with the page at least once — that's
 * an anti-annoyance policy enforced by the browser itself, not something
 * any website's code can force past.
 *
 * So this tries the honest thing first (play on mount), and if the
 * browser blocks it, falls back to starting on the very first tap/click/
 * keypress anywhere on the page — for someone who just opened the link
 * and starts scrolling, that happens almost immediately, so in practice
 * it plays "by default" without her needing to find the button. The
 * button stays visible either way, so she can always pause/resume.
 *
 * useRef here holds a reference to the actual <audio> DOM element so we
 * can call the imperative `.play()`/`.pause()` methods on it — React's
 * props/state can describe *that* audio should play, but starting/
 * stopping playback is something only the real DOM element can do.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const musicUrl = getBackgroundMusicUrl()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicUrl) return

    let removeFallbackListeners: (() => void) | undefined

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay was blocked. Listen for the first real user gesture of
        // ANY kind, anywhere on the page, and try again — that's exactly
        // what browsers require before .play() is allowed to succeed.
        const events = ['pointerdown', 'keydown', 'touchstart'] as const
        const tryStart = () => {
          events.forEach((event) => window.removeEventListener(event, tryStart))
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {})
        }
        events.forEach((event) => window.addEventListener(event, tryStart))
        removeFallbackListeners = () => events.forEach((event) => window.removeEventListener(event, tryStart))
      })

    return () => removeFallbackListeners?.()
  }, [musicUrl])

  // Separate effect, separate concern: this one doesn't care WHY playback
  // might already be blocked or already running, it just reacts to
  // BirthdayCelebration's "all candles are out" announcement (see
  // CANDLES_BLOWN_EVENT in utils/audio.ts) by trying to start the music.
  // .play() on an already-playing <audio> is a harmless no-op, so this is
  // safe to fire even if music is already going.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicUrl) return

    function handleCandlesBlown() {
      audio
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }

    window.addEventListener(CANDLES_BLOWN_EVENT, handleCandlesBlown)
    return () => window.removeEventListener(CANDLES_BLOWN_EVENT, handleCandlesBlown)
  }, [musicUrl])

  // No track added yet — render nothing rather than a button that does
  // nothing useful.
  if (!musicUrl) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        type="button"
        className={`music-toggle ${isPlaying ? 'music-toggle--playing' : ''}`}
        onClick={toggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '❚❚' : '♪'}
      </button>
    </>
  )
}
