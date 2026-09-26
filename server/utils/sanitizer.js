import validator from 'validator';

/**
 * Sanitizes and trims user messages.
 * Strips dangerous HTML tags while preserving user text.
 */
export function sanitizeMessageContent(rawContent) {
  if (typeof rawContent !== 'string') return '';
  
  // Trim leading/trailing whitespace
  let clean = rawContent.trim();
  
  // Strip control characters except newline and tab
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Escape HTML entities to prevent script injection
  clean = validator.escape(clean);
  
  // Enforce max length of 2000 chars
  if (clean.length > 2000) {
    clean = clean.slice(0, 2000);
  }
  
  return clean;
}

/**
 * Validates message type and payload
 */
export function validateMessagePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid message payload' };
  }

  const { roomId, type, content } = payload;

  if (!roomId || typeof roomId !== 'string' || roomId.trim().length === 0) {
    return { valid: false, error: 'Missing or invalid roomId' };
  }

  if (!type || !['text', 'sticker'].includes(type)) {
    return { valid: false, error: 'Invalid message type (must be text or sticker)' };
  }

  if (type === 'text') {
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return { valid: false, error: 'Message content cannot be empty' };
    }
    if (content.trim().length > 2000) {
      return { valid: false, error: 'Message exceeds maximum length (2000 characters)' };
    }
  }

  if (type === 'sticker') {
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return { valid: false, error: 'Sticker ID / emoji is required' };
    }
  }

  return { valid: true };
}
