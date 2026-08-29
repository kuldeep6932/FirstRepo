import { useState } from 'react'
import { Hero } from './components/Hero'
import { Timeline } from './components/Timeline'
import { Countdowns } from './components/Countdowns'
import { MusicPlayer } from './components/MusicPlayer'
import { AccessGate } from './components/AccessGate'
import { person } from './data/story'
import './App.css'

function App() {
  // null until the gate is answered, then true for Piku (password
  // verified) or false for a guest. Lives here — not inside AccessGate
  // itself — because it needs to reach <Letter>, several components below
  // <Countdowns>, not just the gate that sets it.
  const [isPiku, setIsPiku] = useState<boolean | null>(null)

  return (
    <main className="app">
      {/* Full-screen overlay on top of everything below, until answered —
          see src/components/AccessGate.tsx. Renders nothing once resolved. */}
      <AccessGate onResolved={setIsPiku} />
      {/* App reads the data object and hands three of its fields down to
          Hero as separate props — this is "props flowing down": the
          parent (App) decides what data the child (Hero) gets. */}
      <Hero name={person.name} nickname={person.nickname} tagline={person.tagline} />
      {/* Right at the top, no scrolling needed — and ready to grow into
          multiple counters (birthday, anniversary, ...) via story.ts. */}
      <Countdowns isPiku={isPiku === true} />
      <Timeline />
      {/* Fixed-position floating button — renders nothing until a music
          file is dropped into src/assets/audio/. */}
      <MusicPlayer />
    </main>
  )
}

export default App
