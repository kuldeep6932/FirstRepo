import { useEffect, useRef, useState } from 'react'

/**
 * A custom hook: a plain function (name must start with `use`) that calls
 * other hooks (useRef, useState, useEffect) inside it and returns whatever
 * a component needs. It's how React lets you package up reusable stateful
 * behavior — here, "has this element scrolled into view yet?" — instead of
 * copy-pasting the same useRef/useEffect pair into every component that
 * wants a fade-in-on-scroll effect (TimelineItem, Countdown, ...).
 *
 * useRef gives us a handle to a real DOM node so we can hand it to a
 * browser API — IntersectionObserver — that watches when an element enters
 * the viewport, without us listening to `scroll` events and recomputing
 * positions on every pixel scrolled.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once it's been revealed, stop watching — it never needs to
          // hide again, so there's no reason to keep the observer running.
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
