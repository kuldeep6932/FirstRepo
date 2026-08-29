/**
 * Same trick as src/utils/photos.ts: import.meta.glob eagerly imports
 * every matching file and hands back its real (Vite-processed) URL, so
 * dropping a music file into src/assets/audio/ is enough — no import
 * statement or filename to type anywhere else.
 *
 * We only ever expect ONE track here (unlike photos, which are per
 * milestone), so we just grab whichever file shows up first.
 */
const modules = import.meta.glob('../assets/audio/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export function getBackgroundMusicUrl(): string | undefined {
  const paths = Object.keys(modules)
  return paths.length > 0 ? modules[paths[0]] : undefined
}

/**
 * Window event name used to say "the candles are all blown out" without
 * BirthdayCelebration and MusicPlayer needing to know about each other —
 * see the dispatch in BirthdayCelebration.tsx and the listener in
 * MusicPlayer.tsx.
 */
export const CANDLES_BLOWN_EVENT = 'candles-blown'
