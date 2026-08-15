import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import './Countdown.css'

type CountdownProps = {
  /** What this countdown is for, e.g. "Piku's Birthday" or "Our Anniversary" */
  label: string
  /** ISO date string, e.g. '2026-08-30' */
  targetDate: string
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diffMs = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const totalSeconds = Math.floor(diffMs / 1000)
  return {
    days: Math.floor(totalSeconds / (3600 * 24)),
    hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function Countdown({ label, targetDate }: CountdownProps) {
  // Lazy initializer (the () => ... form) so getTimeLeft only runs once,
  // for the very first render, instead of on every re-render.
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    // useEffect is for anything that reaches OUTSIDE React's normal
    // render-in/render-out flow — here, a timer that keeps running in the
    // background regardless of renders. This function runs once after
    // the first render (because the dependency array [targetDate] below
    // never changes for this page).
    const timerId = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    // The function RETURNED from useEffect is its cleanup. React calls it
    // right before the effect re-runs, and again when Countdown unmounts.
    // Skip this and every re-mount would stack a new interval on top of
    // the last one still ticking — a classic memory leak.
    return () => clearInterval(timerId)
  }, [targetDate])

  const hasArrived =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section ref={ref} className={`countdown reveal ${isVisible ? 'reveal--visible' : ''}`}>
      <h2 className="countdown__heading">Counting Down to {label}</h2>

      {hasArrived ? (
        <p className="countdown__today">It's here! Happy {label}! 🎉</p>
      ) : (
        <div className="countdown__units">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      )}
    </section>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown__unit">
      <span className="countdown__value">{String(value).padStart(2, '0')}</span>
      <span className="countdown__label">{label}</span>
    </div>
  )
}
