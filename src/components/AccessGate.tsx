import { useState, type FormEvent } from 'react'
import { decryptChat, type ChatMessage } from '../utils/chat'
import './AccessGate.css'

export type AccessResult = { isPiku: false } | { isPiku: true; chatMessages: ChatMessage[] }

type AccessGateProps = {
  /** Called once, the moment a choice is locked in. */
  onResolved: (result: AccessResult) => void
}

const PASSWORD_HINT = 'Hint: the vegetable you keep telling me to eat 😄'

/**
 * The very first thing anyone sees: a full-screen question before the rest
 * of the page is usable. Picking "Just visiting" resolves straight to
 * guest. Picking "I'm Piku" asks for the password — there's no hardcoded
 * password to compare against anywhere in this file; getting it right is
 * *how* src/data/chat.enc.json (the encrypted WhatsApp export — see
 * src/utils/chat.ts) decrypts. Wrong password just means decryption fails,
 * same as it would for anyone poking at the file directly in dev tools.
 */
export function AccessGate({ onResolved }: AccessGateProps) {
  const [step, setStep] = useState<'choose' | 'password'>('choose')
  const [input, setInput] = useState('')
  const [wrongAttempt, setWrongAttempt] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  // Once a choice is locked in, the gate is done — render nothing rather
  // than an empty overlay sitting on top of the page.
  const [isResolved, setIsResolved] = useState(false)

  if (isResolved) return null

  function chooseGuest() {
    setIsResolved(true)
    onResolved({ isPiku: false })
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault()
    setIsChecking(true)
    // Lazy import: guests (and anyone who hasn't tried "I'm Piku" yet)
    // never fetch this — it's a multi-megabyte file, code-split into its
    // own chunk by Vite, only requested the moment someone actually
    // attempts the password.
    const { default: encryptedChat } = await import('../data/chat.enc.json')
    // Normalized the same way scripts/encrypt-chat.mjs's input was, so
    // "Baingan"/"BAINGAN"/"baingan " all derive the identical key.
    const password = input.trim().toLowerCase()
    const chatMessages = await decryptChat(password, encryptedChat)
    setIsChecking(false)

    if (chatMessages) {
      setIsResolved(true)
      onResolved({ isPiku: true, chatMessages })
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
            <button type="submit" className="access-gate__submit" disabled={isChecking}>
              {isChecking ? 'Unlocking…' : 'Unlock 🔓'}
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
