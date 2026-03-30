/**
 * Efficiently converts a Base64 Data URI string into a raw Buffer for database storage.
 * Automatically handles the 'data:image/...;base64,' prefix.
 */
export function base64ToBuffer(base64: string): Buffer {
  if (!base64 || typeof base64 !== 'string') return Buffer.alloc(0)
  
  // Extract actual data from data URL if present
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64
  return Buffer.from(cleanBase64, 'base64')
}

/**
 * Converts a raw Buffer back to a Base64 string for the frontend.
 * Automatically prepends the correct MIME type prefix.
 */
export function bufferToBase64(buffer: any, mimeType: string = 'image/jpeg'): string {
  if (!buffer || !(buffer instanceof Buffer)) {
    // If it's already a string, return it (handles transition period)
    if (typeof buffer === 'string') return buffer
    return ''
  }
  
  const base64 = buffer.toString('base64')
  
  // If the buffer already looks like a base64 string, don't double encode
  if (base64.startsWith('data:')) return base64

  // Re-attach data URI prefix
  if (mimeType.includes('pdf')) return `data:application/pdf;base64,${base64}`
  return `data:${mimeType};base64,${base64}`
}
