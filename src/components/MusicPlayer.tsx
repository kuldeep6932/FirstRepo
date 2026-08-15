import { useRef, useState } from 'react'
import { getBackgroundMusicUrl } from '../utils/audio'
import './MusicPlayer.css'

/**
 * A floating toggle button, not autoplay-on-load. Browsers deliberately
 * block audio from starting with sound until the visitor has interacted
 * with the page (an anti-annoyance rule) — so instead of fighting that,
 * we lean into it: nothing plays until she taps the button herself, and
 * that click IS the "user gesture" browsers require before `.play()` is
 * allowed to succeed.
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
