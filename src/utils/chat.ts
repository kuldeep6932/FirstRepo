export type ChatMessage = {
  /** 'YYYY-MM-DD' */
  date: string
  /** Original WhatsApp time string, e.g. "2:35 PM" */
  time: string
  /** null = a WhatsApp system line ("You pinned a message"), not something
   *  either of you typed. */
  sender: 'KD' | 'Pragati' | null
  text: string
  isMedia?: boolean
  edited?: boolean
}

type EncryptedChat = {
  salt: string
  iv: string
  iterations: number
  ciphertext: string
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * Turns a password into the same AES key scripts/encrypt-chat.mjs used to
 * encrypt the chat (PBKDF2 with the salt/iteration count stored alongside
 * the ciphertext — those aren't secret, only the password is), then
 * decrypts. Returns null for ANY failure — wrong password, corrupted data,
 * whatever — since AES-GCM's built-in auth tag means decrypt() only
 * succeeds at all when the key was right; there's no separate password
 * check anywhere, this call *is* the check.
 */
export async function decryptChat(password: string, encrypted: EncryptedChat): Promise<ChatMessage[] | null> {
  try {
    const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
      'deriveKey',
    ])
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: base64ToBytes(encrypted.salt) as BufferSource,
        iterations: encrypted.iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    )
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(encrypted.iv) as BufferSource },
      key,
      base64ToBytes(encrypted.ciphertext) as BufferSource,
    )
    return JSON.parse(new TextDecoder().decode(plainBuf))
  } catch {
    return null
  }
}
