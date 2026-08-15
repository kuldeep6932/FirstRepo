import { Hero } from './components/Hero'
import { Timeline } from './components/Timeline'
import { Countdowns } from './components/Countdowns'
import { person } from './data/story'
import './App.css'

function App() {
  return (
    <main className="app">
      {/* App reads the data object and hands three of its fields down to
          Hero as separate props — this is "props flowing down": the
          parent (App) decides what data the child (Hero) gets. */}
      <Hero name={person.name} nickname={person.nickname} tagline={person.tagline} />
      {/* Right at the top, no scrolling needed — and ready to grow into
          multiple counters (birthday, anniversary, ...) via story.ts. */}
      <Countdowns />
      <Timeline />
    </main>
  )
}

export default App
