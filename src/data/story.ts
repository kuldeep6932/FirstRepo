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
  name: '🐰 🤍🐰',
  nickname: 'Piku',
  tagline: 'Happy Birthday in advance 💕',
}

export type CountdownEvent = {
  /** Stable id, used as the React `key` when we render a list of these. */
  id: string
  /** What the countdown is *for* — shown as "Counting Down to {label}". */
  label: string
  /** ISO date of the (next) occurrence. */
  date: string
  /** Revealed once every candle on the cake has been blown out. */
  message: string
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
    message: 'Happy Birthday, Piku! 💕',
  },
]

/**
 * Lines of the letter revealed by <Letter> (src/components/Letter.tsx) once
 * the candles are blown out. One string per paragraph/line — just a
 * starting point, edit freely as you write more.
 */
export const letterLines: string[] = [
  '## ❤️ To My Dear Piku,',
  "Pata hai Piku, mujhe nahi pata tha ki meri life ki sabse beautiful story itni unexpectedly start hogi. ❤️",
  "February mein didi ki shaadi ke baad, jab maine tumhari photo dikhe thi. Sach bolu toh uss moment par hi, kch to hua tha. I don't know how to explain it, but I fell for you even tumhh janne sai pahle.",
  "Phir ek din hum Instagram par mil gaye. 😄",
  'Starting mai mujhe laga tha, "Kya baat karenge?"',
  "But fir we started talking… first day se hi aisa lga jaise hum ek dusre ko jaante hain kafi time sai.",
  "Aisa kch ajeeb ni lga. Bas baatein hoti gayi… aur pata hi nahi chala kab tum meri everyday life ka itna important part ban gayi.",
  "Bs 1-2 din mai I realise — I want to marry you.",
  "Aur aaj bhi mujhe lagta hai ki tumhe choose karna, tumhare saath life spend karne ka decision lena, meri life ka best decision hoga.",
  "And then came July",
  "We got engaged. 💍",
  "But Sachi Piku, engagement ke baad ek cheez aur zyada realize hui hai.",
  "Mujhe aadat hogai to have you in my life… and now I don't know how to imagine it without you.",
  "kuch acha hota hai na, toh sabse pehle mann karta hai tumhe batau.",
  "Kuch bura hota hai, toh mann karta hai tum mere paas raho.",
  "Koi funny cheez hoti hai, I want to share it with you.",
  "Koi tension hoti hai, I want to talk to you.",
  "Aur jab kuch bhi nahi hota… tab bhi bas tumse baat karne ka mann karta hai.",
  "So you're not just someone I'm going to marry.",
  "Someone I want to share my happiest moments with, my worst days with, my stupid thoughts with, my dreams with… basically, everything with.",
  "I don't know baby future exactly kaisa hoga. Life mai ups and downs aainge, hum kabhi ladenge, kabhi ek dusre ko pareshan karenge 😛, kabhi mai tumhe manaunga aur kabhi tum mujhe.",
  "But ek cheez kaafi sure hai…",
  "I want all of it with you.",
  "You're becoming my person. ❤️",
  "I want to grow with you.",
  "I want to travel with you.",
  "I want to laugh with you.",
  "I want to build a home with you.",
  "I want to celebrate the little things with you.",
  "And most importantly, I want you by my side through all the big and small moments of life.",
  "And maybe this is the simplest way I can say everything I feel…",
  "Piku, I am in love with you. ❤️",
  "Thank you for coming into my life so unexpectedly and making it feel so much more complete.",
  "Happy Birthday to the girl who started as a photo and biodata",
  "…and is slowly becoming everything ❤️",
  "And I can't wait to see where this beautiful journey takes us. And yeah lets get marriad soon you know na wait ni hota mujhse 💍❤️",
  "I love you, Piku."

]
