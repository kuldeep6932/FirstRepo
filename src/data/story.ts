// This file holds all the *content* of the site — your story, as data.
//
// Why keep it separate from the components? Because a component's job is to
// describe HOW something looks, not WHAT it says. When they're separate, you
// (or Piku!) can add a new memory or fix a typo here without touching any
// component code, and later a <Timeline> component can just `.map()` over
// this array instead of us hand-writing one JSX block per milestone.

export type Milestone = {
  /** Stable id, used as the React `key` when we render a list of these. */
  id: string
  /** Display date, kept as free text so "April 2026" reads naturally. */
  date: string
  title: string
  description: string
  /** Filenames only (e.g. "first-date.jpeg") — files live in
   *  src/assets/photos/. The actual URL gets resolved later by
   *  src/utils/photos.ts, so this file never needs an import statement. */
  photos: string[]
}

export const milestones: Milestone[] = [
  {
    id: 'the-beginning',
    date: 'April 2026',
    title: 'The Beginning',
    description:
      "We started talking, and somehow never stopped. Every day was full of long conversations we both looked forward to.",
    photos: ['the-beginning.jpg'],
  },
  {
    id: 'meeting-the-families',
    date: 'May 2026',
    title: 'Meeting the Families',
    description:
      'Our families met each other for the first time — the moment things started feeling real.',
    photos: ['meeting-the-families.jpeg'],
  },
  {
    id: 'the-proposal',
    date: 'July 2026',
    title: 'Forever Begins',
    description: 'We got engaged, and promised each other forever. 💍',
    photos: ['the-proposal.jpeg'],
  },
  {
    id: 'first-date',
    date: 'July 2026',
    title: 'Our First Date',
    description:
      'A long drive and an even longer lunch — our very first date, just the two of us.',
    photos: ['first-date.jpeg'],
  }
]

export const person = {
  name: 'Pragati',
  nickname: 'Piku',
  tagline: 'Happy Birthday in advance, Piku 💕',
}

export type CountdownEvent = {
  /** Stable id, used as the React `key` when we render a list of these. */
  id: string
  /** What the countdown is *for* — shown as "Counting Down to {label}". */
  label: string
  /** ISO date of the (next) occurrence. */
  date: string
}

/**
 * Every countdown on the site lives here as one entry. Want to add a
 * countdown to your wedding anniversary once you're married? Add one more
 * object below — <Countdowns> (src/components/Countdowns.tsx) already
 * `.map()`s over this array, so no component code needs to change.
 */
export const countdownEvents: CountdownEvent[] = [
  {
    id: 'piku-birthday-2026',
    label: "Piku's Birthday",
    date: '2026-08-30',
  },
]
