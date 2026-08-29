import { useState, type FormEvent } from 'react'
import './AccessGate.css'

type AccessGateProps = {
  /** Called once, the moment a choice is locked in: true for Piku (password
   *  verified), false for a guest. */
  onResolved: (isPiku: boolean) => void
}

// Hardcoded on purpose — this isn't real security (anyone could read this
// straight out of the page's source), just a fun "who's asking" gate so
// the love letter stays a surprise for anyone else who gets sent the link.
const PIKU_PASSWORD = 'baingan'
const PASSWORD_HINT = 'Hint: the vegetable you keep telling me to eat 😄'

/**
 * The very first thing anyone sees: a full-screen question before the rest
 * of the page is usable. Picking "Just visiting" resolves straight to
 * guest. Picking "I'm Piku" asks for the password first — get it right and
 * the gate resolves to Piku, unlocking <Letter> further down the page.
 */
export function AccessGate({ onResolved }: AccessGateProps) {
  const [step, setStep] = useState<'choose' | 'password'>('choose')
  const [input, setInput] = useState('')
  const [wrongAttempt, setWrongAttempt] = useState(false)
  // Once a choice is locked in, the gate is done — render nothing rather
  // than an empty overlay sitting on top of the page.
  const [isResolved, setIsResolved] = useState(false)

  if (isResolved) return null

  function chooseGuest() {
    setIsResolved(true)
    onResolved(false)
  }

  function submitPassword(event: FormEvent) {
    event.preventDefault()
    if (input.trim().toLowerCase() === PIKU_PASSWORD) {
      setIsResolved(true)
      onResolved(true)
    } else {
      setWrongAttempt(true)
    }
  }

  return (
    <div className="access-gate" role="dialog" aria-modal="true" aria-label="Who's opening this?">
      <div className="access-gate__card">
        {step === 'choose' ? (
          <>
            <p className="access-gate__question">Who's opening this? 💌</p>
            <div className="access-gate__choices">
              <button type="button" className="access-gate__choice" onClick={() => setStep('password')}>
                I'm Piku 🐰
              </button>
              <button
                type="button"
                className="access-gate__choice access-gate__choice--secondary"
                onClick={chooseGuest}
              >
                Just visiting 👀
              </button>
            </div>
          </>
        ) : (
          <form className="access-gate__form" onSubmit={submitPassword}>
            <p className="access-gate__question">Password, my love?</p>
            <input
              type="password"
              className="access-gate__input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setWrongAttempt(false)
              }}
              autoFocus
              aria-label="Password"
            />
            <p className="access-gate__hint">{PASSWORD_HINT}</p>
            {wrongAttempt && <p className="access-gate__error">That's not it — try again 🥲</p>}
            <button type="submit" className="access-gate__submit">
              Unlock 🔓
            </button>
            <button type="button" className="access-gate__back" onClick={() => setStep('choose')}>
              ← back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
