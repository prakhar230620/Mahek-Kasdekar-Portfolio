import zlib from 'zlib'

const ZLIB_PREFIX = 'cmp:'
const BROTLI_PREFIX = 'br:'

/**
 * Compresses a string value using Brotli at Maximum Quality (level 11).
 * Brotli is significantly more efficient than Zlib for text content.
 */
export function compressData(value: string): string {
  if (!value || typeof value !== 'string') return value
  if (value.startsWith(BROTLI_PREFIX) || value.startsWith(ZLIB_PREFIX)) return value

  try {
    const compressed = zlib.brotliCompressSync(Buffer.from(value, 'utf-8'), {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      },
    }).toString('base64')
    
    return BROTLI_PREFIX + compressed
  } catch (error) {
    console.error('Brotli Compression Error:', error)
    // Fallback to zlib if Brotli fails
    const compressed = zlib.deflateSync(value).toString('base64')
    return ZLIB_PREFIX + compressed
  }
}

/**
 * Decompresses either Brotli or Zlib compressed strings back to their original value.
 */
export function decompressData(value: string): string {
  if (!value || typeof value !== 'string') return value
  
  if (value.startsWith(BROTLI_PREFIX)) {
    try {
      const rawBase64 = value.substring(BROTLI_PREFIX.length)
      const decompressed = zlib.brotliDecompressSync(Buffer.from(rawBase64, 'base64')).toString('utf-8')
      return decompressed
    } catch (error) {
      console.error('Brotli Decompression Error:', error)
      return value
    }
  }

  if (value.startsWith(ZLIB_PREFIX)) {
    try {
      const rawBase64 = value.substring(ZLIB_PREFIX.length)
      const decompressed = zlib.inflateSync(Buffer.from(rawBase64, 'base64')).toString('utf-8')
      return decompressed
    } catch (error) {
      console.error('Zlib Decompression Error:', error)
      return value
    }
  }

  return value
}

/**
 * MAXIMUM EFFICIENCY BINARY STORAGE:
 * Compresses a Base64 string into a raw Buffer using Brotli (Level 11).
 * Brotli provides the absolute best lossless compression available in Node.js.
 */
export function compressToBuffer(base64: string): Buffer | string {
  if (!base64 || typeof base64 !== 'string') return base64
  
  try {
    // Extract actual data from data URL if present
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64
    const binaryData = Buffer.from(cleanBase64, 'base64')

    // Use Brotli with max quality
    const compressed = zlib.brotliCompressSync(binaryData, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      },
    })
    
    return compressed
  } catch (error) {
    console.error('Brotli Buffer Compression Error:', error)
    return Buffer.from(base64.includes(',') ? base64.split(',')[1] : base64, 'base64')
  }
}

/**
 * Converts a raw Buffer back to a Base64 string for the frontend.
 * Automatically detects if the buffer is Brotli or Zlib compressed.
 */
export function decompressFromBuffer(buffer: any, mimeType: string = 'image/jpeg'): string {
  if (!buffer || !(buffer instanceof Buffer)) return buffer
  
  try {
    let decompressed: Buffer
    try {
      // Try Brotli first
      decompressed = zlib.brotliDecompressSync(buffer)
    } catch {
      // Fallback to Zlib for old data
      decompressed = zlib.inflateSync(buffer)
    }
    
    const base64 = decompressed.toString('base64')
    
    // Re-attach data URI prefix
    if (mimeType.includes('pdf')) return `data:application/pdf;base64,${base64}`
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Buffer Expansion Error:', error)
    return `data:${mimeType};base64,${buffer.toString('base64')}`
  }
}
