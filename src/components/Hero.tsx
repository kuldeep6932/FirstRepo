import './Hero.css'

type HeroProps = {
  name: string
  nickname: string
  tagline: string
}

/**
 * The first thing anyone sees when the page loads.
 *
 * Hero itself doesn't know anything about Pragati/Piku/the tagline — it
 * just describes HOW to display whatever it's given. The actual content
 * lives in src/data/story.ts, and App.tsx (Hero's *parent*) decides what
 * to hand down, by passing "props" — like HTML attributes:
 *
 *   <Hero name="Pragati" nickname="Piku" tagline="Happy Birthday..." />
 *
 * Inside this component, React bundles those three attributes into a
 * single object and passes it as the first function argument. Destructuring
 * it — `{ name, nickname, tagline }` — pulls each one out as its own
 * variable, matching the `HeroProps` type above.
 */
export function Hero({ name, nickname, tagline }: HeroProps) {
  return (
    <section className="hero">
      <span className="hero__ornament" aria-hidden="true">
        ❤
      </span>

      {/* Each {expression} below injects a JS value into the rendered
          HTML — this is the core JSX rule: curly braces drop out of
          "markup mode" and back into plain JavaScript. */}
      <p className="hero__tagline">{tagline}</p>

      <h1 className="hero__title">{nickname}</h1>

      <p className="hero__name">{`— ${name}`}</p>
    </section>
  )
}
