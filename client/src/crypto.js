// Encryption utilities using Web Crypto API

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256

/**
 * Generate a random encryption key
 */
export async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: ALGORITHM,
            length: KEY_LENGTH,
        },
        true, // extractable
        ['encrypt', 'decrypt']
    )
}

/**
 * Export key to base64 string for storage
 */
export async function exportKey(key) {
    const exported = await crypto.subtle.exportKey('raw', key)
    return arrayBufferToBase64(exported)
}

/**
 * Import key from base64 string
 */
export async function importKey(keyString) {
    const keyData = base64ToArrayBuffer(keyString)
    return await crypto.subtle.importKey(
        'raw',
        keyData,
        {
            name: ALGORITHM,
            length: KEY_LENGTH,
        },
        true,
        ['encrypt', 'decrypt']
    )
}

/**
 * Encrypt a message
 * @param {string} message - Plain text message
 * @param {CryptoKey} key - Encryption key
 * @returns {Promise<string>} - Encrypted message in format: iv:ciphertext (both base64)
 */
export async function encryptMessage(message, key) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)

    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv: iv,
        },
        key,
        data
    )

    // Return IV and ciphertext as base64, separated by ':'
    const ivBase64 = arrayBufferToBase64(iv)
    const ciphertextBase64 = arrayBufferToBase64(encrypted)

    return `${ivBase64}:${ciphertextBase64}`
}

/**
 * Decrypt a message
 * @param {string} encryptedMessage - Encrypted message in format: iv:ciphertext
 * @param {CryptoKey} key - Decryption key
 * @returns {Promise<string>} - Decrypted plain text
 */
export async function decryptMessage(encryptedMessage, key) {
    try {
        const [ivBase64, ciphertextBase64] = encryptedMessage.split(':')

        if (!ivBase64 || !ciphertextBase64) {
            throw new Error('Invalid encrypted message format')
        }

        const iv = base64ToArrayBuffer(ivBase64)
        const ciphertext = base64ToArrayBuffer(ciphertextBase64)

        const decrypted = await crypto.subtle.decrypt(
            {
                name: ALGORITHM,
                iv: new Uint8Array(iv),
            },
            key,
            ciphertext
        )

        const decoder = new TextDecoder()
        return decoder.decode(decrypted)
    } catch (error) {
        console.error('Decryption failed:', error)
        throw new Error('Failed to decrypt message')
    }
}

/**
 * Check if a message is encrypted
 */
export function isEncrypted(message) {
    // Encrypted messages have format: base64:base64
    return typeof message === 'string' && message.includes(':') && message.split(':').length === 2
}

// Helper functions
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
}
