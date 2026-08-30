import { useState } from 'react'
import { Hero } from './components/Hero'
import { Timeline } from './components/Timeline'
import { Countdowns } from './components/Countdowns'
import { MusicPlayer } from './components/MusicPlayer'
import { AccessGate, type AccessResult } from './components/AccessGate'
import { ChatViewer } from './components/ChatViewer'
import { person } from './data/story'
import './App.css'

function App() {
  // null until the gate is answered. Lives here — not inside AccessGate
  // itself — because it needs to reach <Letter> (via <Countdowns>) and
  // <ChatViewer>, both several components away from the gate that sets it.
  const [access, setAccess] = useState<AccessResult | null>(null)
  const isPiku = access?.isPiku === true

  return (
    <main className="app">
      {/* Full-screen overlay on top of everything below, until answered —
          see src/components/AccessGate.tsx. Renders nothing once resolved. */}
      <AccessGate onResolved={setAccess} />
      {/* App reads the data object and hands three of its fields down to
          Hero as separate props — this is "props flowing down": the
          parent (App) decides what data the child (Hero) gets. */}
      <Hero name={person.name} nickname={person.nickname} tagline={person.tagline} />
      {/* Right at the top, no scrolling needed — and ready to grow into
          multiple counters (birthday, anniversary, ...) via story.ts. */}
      <Countdowns isPiku={isPiku} />
      <Timeline />
      {/* Fixed-position floating button — renders nothing until a music
          file is dropped into src/assets/audio/. */}
      <MusicPlayer />
      {/* Only exists once the password has actually decrypted the chat —
          see AccessGate.tsx — so there's no separate "locked" state here. */}
      {isPiku && <ChatViewer messages={access.chatMessages} />}
    </main>
  )
}

export default App
