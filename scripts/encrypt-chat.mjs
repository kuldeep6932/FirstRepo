#!/usr/bin/env node
// One-off tool, not part of the app build: turns a raw WhatsApp .txt export
// into an AES-256-GCM encrypted blob that ships in the repo instead of the
// plaintext chat. Nothing here is secret by itself — the password is
// supplied on the command line each time you run it, never hardcoded — so
// re-running this is the only way to update the chat data later (e.g. a
// newer export), and the plaintext .txt never has to touch the repo.
//
// Usage:
//   node scripts/encrypt-chat.mjs <path-to-export.txt> <password> [outputPath]
//
// The output is decrypted client-side in src/utils/chat.ts using the Web
// Crypto API (PBKDF2 + AES-GCM), with the same salt/iterations stored
// alongside the ciphertext — those aren't secret, only the password is.

import { readFileSync, writeFileSync } from 'node:fs'
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto'

const [, , inputPath, password, outputPath = 'src/data/chat.enc.json'] = process.argv

if (!inputPath || !password) {
  console.error('Usage: node scripts/encrypt-chat.mjs <export.txt> <password> [outputPath]')
  process.exit(1)
}

const PBKDF2_ITERATIONS = 150_000
// The two participants this parser knows how to attribute lines to.
// Anything else with a "Name: " prefix WhatsApp didn't generate itself
// (unlikely, but just in case) falls back to a system message instead of
// being misread as a third sender.
const KNOWN_SENDERS = ['KD', 'Pragati']

// WhatsApp's export format: "M/D/YY, H:MM AM/PM - rest". `\s` covers both
// a normal space and the narrow no-break space (U+202F) some exports use
// right before AM/PM.
const HEADER_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s(\d{1,2}:\d{2}\s?[AP]M)\s-\s(.*)$/
const EDITED_SUFFIX = ' <This message was edited>'

function parseWhatsAppExport(text) {
  const lines = text.split(/\r?\n/)
  const messages = []

  for (const line of lines) {
    if (!line) continue
    const header = line.match(HEADER_RE)

    if (!header) {
      // No date/sender prefix means this is the continuation of whatever
      // message came right before it — WhatsApp just wraps long messages
      // onto plain new lines in the export.
      const prev = messages[messages.length - 1]
      if (prev) prev.text += '\n' + line
      continue
    }

    const [, month, day, year, time, rest] = header
    const senderMatch = rest.match(/^([^:]{1,30}?): (.*)$/)
    const sender = senderMatch && KNOWN_SENDERS.includes(senderMatch[1]) ? senderMatch[1] : null
    let text = sender ? senderMatch[2] : rest

    const edited = text.endsWith(EDITED_SUFFIX)
    if (edited) text = text.slice(0, -EDITED_SUFFIX.length)
    const isMedia = text === '<Media omitted>'
    const fullYear = year.length === 2 ? `20${year}` : year

    messages.push({
      date: `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      time,
      // null = a system line (e.g. "You pinned a message"), not something
      // either of you actually typed.
      sender,
      text,
      ...(isMedia ? { isMedia: true } : {}),
      ...(edited ? { edited: true } : {}),
    })
  }

  return messages
}

const raw = readFileSync(inputPath, 'utf8')
const messages = parseWhatsAppExport(raw)
console.log(`Parsed ${messages.length} messages from ${inputPath}`)

const salt = randomBytes(16)
const iv = randomBytes(12)
const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256')

const cipher = createCipheriv('aes-256-gcm', key, iv)
const plaintext = Buffer.from(JSON.stringify(messages), 'utf8')
const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()])
// Web Crypto's AES-GCM expects the auth tag appended to the ciphertext
// (that's what its decrypt() call produces/consumes) — Node keeps them
// separate, so glue them back together here to match.
const ciphertext = Buffer.concat([encrypted, cipher.getAuthTag()])

writeFileSync(
  outputPath,
  JSON.stringify({
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    iterations: PBKDF2_ITERATIONS,
    ciphertext: ciphertext.toString('base64'),
  }),
)
console.log(`Wrote encrypted chat (${messages.length} messages) to ${outputPath}`)
