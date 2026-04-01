import zlib from 'zlib'

// ─── TEXT FIELD COMPRESSION (for short strings, description, messages) ───────

/**
 * Compresses a string field to base64-gzip for storage in MongoDB.
 * Used as Mongoose setter for short text fields.
 */
export const compressData = (data: string): string => {
  if (!data || typeof data !== 'string') return data
  // Don't re-compress already compressed data
  if (data.startsWith('gz:')) return data
  try {
    return 'gz:' + zlib.gzipSync(Buffer.from(data, 'utf8')).toString('base64')
  } catch {
    return data
  }
}

/**
 * Decompresses a base64-gzip string field from MongoDB back to plaintext.
 * Used as Mongoose getter for short text fields.
 */
export const decompressData = (data: any): string => {
  if (!data) return data
  if (typeof data !== 'string') return String(data)
  // New format: "gz:<base64>"
  if (data.startsWith('gz:')) {
    try {
      return zlib.gunzipSync(Buffer.from(data.slice(3), 'base64')).toString('utf8')
    } catch {
      return data
    }
  }
  // Legacy format: plain base64-gzip without prefix (old records)
  if (/^[a-zA-Z0-9+/=]{20,}$/.test(data) && !data.includes(' ')) {
    try {
      const result = zlib.gunzipSync(Buffer.from(data, 'base64')).toString('utf8')
      // Only return the decompressed value if it looks like readable text
      if (result && !result.includes('\x00')) return result
    } catch {
      // Not compressed, return as-is
    }
  }
  return data
}

// ─── BINARY FIELD COMPRESSION (for images and PDFs stored as Strings) ────────

/**
 * Compresses a data URI string (image or PDF) into a prefixed base64-gzip string.
 * Returns "gz:<base64>" so we can always detect compressed vs plain data.
 * Used in API routes BEFORE saving to MongoDB.
 */
export const compressDataUri = (dataUri: string): string => {
  if (!dataUri) return ''
  if (dataUri.startsWith('gz:')) return dataUri // already compressed
  try {
    const compressed = zlib.gzipSync(Buffer.from(dataUri, 'utf8'))
    return 'gz:' + compressed.toString('base64')
  } catch {
    return dataUri // fallback: store as-is
  }
}

/**
 * Decompresses a "gz:<base64>" string back to the original data URI.
 * Has fallbacks for plain data URIs and legacy uncompressed data.
 * Used in API routes AFTER reading from MongoDB.
 */
export const decompressDataUri = (data: any): string => {
  if (!data) return ''

  // Handle any non-string types gracefully (e.g., legacy Buffer BSON)
  let str: string
  if (typeof data === 'string') {
    str = data
  } else if (Buffer.isBuffer(data)) {
    // Try to gunzip if it's a raw Buffer (could be legacy compressed buffer)
    try {
      const result = zlib.gunzipSync(data).toString('utf8')
      if (result.startsWith('data:')) return result
    } catch {
      // Not gzipped, try as utf8 string
      str = data.toString('utf8')
    }
    str = data.toString('utf8')
  } else if (data && typeof data === 'object') {
    // bson Binary or similar - try to extract bytes
    const extracted = extractBsonBinaryBuffer(data)
    if (extracted) {
      try {
        const result = zlib.gunzipSync(extracted).toString('utf8')
        if (result.startsWith('data:')) return result
      } catch {
        const s = extracted.toString('utf8')
        if (s.startsWith('data:')) return s
      }
      return ''
    }
    return ''
  } else {
    return ''
  }

  // New compressed format: "gz:<base64>"
  if (str.startsWith('gz:')) {
    try {
      return zlib.gunzipSync(Buffer.from(str.slice(3), 'base64')).toString('utf8')
    } catch {
      return ''
    }
  }

  // Plain data URI (uncompressed, stored directly)
  if (str.startsWith('data:')) {
    return str
  }

  // Unknown format
  return ''
}

/**
 * Helper: Attempts to extract a Buffer from a MongoDB BSON Binary object.
 * Handles different versions of the bson library.
 */
function extractBsonBinaryBuffer(obj: any): Buffer | null {
  if (!obj || typeof obj !== 'object') return null

  // bson v4/v5/v6: Binary has a .buffer property (Uint8Array or Buffer)
  if (obj.buffer) {
    if (Buffer.isBuffer(obj.buffer)) return obj.buffer
    if (obj.buffer instanceof Uint8Array) return Buffer.from(obj.buffer)
  }

  // bson Binary: has a .value() method  
  if (typeof obj.value === 'function') {
    try {
      const val = obj.value(true)
      if (Buffer.isBuffer(val)) return val
      if (val instanceof Uint8Array) return Buffer.from(val)
    } catch { /* ignore */ }
  }

  // JSON-serialized Buffer: { type: 'Buffer', data: [...] }
  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return Buffer.from(obj.data)
  }

  // Generic Uint8Array or TypedArray
  if (obj instanceof Uint8Array) return Buffer.from(obj)

  return null
}

// ─── LEGACY: kept for backward compatibility with old Buffer-based storage ────
// These are no longer used in model setters/getters but kept to avoid import errors

export const compressToBuffer = (data: string): Buffer | null => {
  if (!data) return null
  try { return zlib.gzipSync(Buffer.from(data, 'utf8')) } catch { return null }
}

export const decompressFromBuffer = (data: any): string => {
  return decompressDataUri(data)
}
