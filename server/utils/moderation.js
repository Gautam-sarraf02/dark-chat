/**
 * Server-side Moderation System for Dark Chat.
 *
 * Designed to block severe harmful/illegal content (violence threats, exploitation, severe crime instructions)
 * while preserving freedom for casual conversation, slang, and standard adult profanity.
 */

// Common leetspeak and symbol substitutions mapping to basic Latin characters
const LEET_MAP = {
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '|': 'i',
  '3': 'e',
  '4': 'a',
  '@': 'a',
  '5': 's',
  '$': 's',
  '7': 't',
  '+': 't',
  '8': 'b',
  '9': 'g',
  'v': 'u',
  'ph': 'f',
};

/**
 * Normalizes input text to defeat simple evasion techniques:
 * - Strips zero-width and invisible unicode characters
 * - Converts to lowercase
 * - Maps leetspeak/symbol substitutions
 * - Collapses repeated letters (e.g., "kiiiilll" -> "kill")
 * - Removes intra-word spacing/dots/dashes (e.g., "k.i.l.l" -> "kill")
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  // 1. Remove zero-width & invisible unicode chars
  let cleaned = text.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u200E\u200F]/g, '');

  // 2. Lowercase
  cleaned = cleaned.toLowerCase();

  // 3. Normalize unicode accents (é -> e, etc.)
  cleaned = cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 4. Map leetspeak characters
  let deobfuscated = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    deobfuscated += LEET_MAP[char] || char;
  }

  // 5. Collapse excessive repeated characters (e.g., "boooomb" -> "bomb", "kkkkill" -> "kill")
  // Replace 3+ consecutive occurrences with max 1 or 2
  const collapsedRepeats = deobfuscated.replace(/(.)\1{2,}/g, '$1$1');

  // 6. Create a condensed version with spaces/punctuation removed for word-boundary bypasses
  const strippedSeparators = deobfuscated.replace(/[\s\.\-_,\*\\/|~`'"]/g, '');

  return {
    rawLower: cleaned,
    normalized: collapsedRepeats,
    stripped: strippedSeparators,
  };
}

// Patterns specifically targeting severe harm/illegal acts (NOT standard swearing)
const SEVERE_PATTERNS = [
  // Direct death threats / violent harm
  /\b(i\s*will|im\s*gonna|going\s*to)\s*(kill|murder|shoot|slaughter|decapitate|stab)\s*(you|ur\s*family|everyone)\b/i,
  /\b(kill|hang|shoot|slit)\s*(yourself|urself|your\s*throat)\b/i,
  /\b(go\s*(die|kill\s*urself|commit\s*suicide))\b/i,
  
  // Severe crime / terror / mass harm instructions & incitement
  /\b(how\s*to\s*(make|build|detonate)\s*(a\s*)?(bomb|pipe\s*bomb|explosive|molotov|anthrax))\b/i,
  /\b(recipe\s*for\s*(pipe\s*bomb|poison|ricin|cyanide))\b/i,
  /\b(mass\s*shooting|shoot\s*up\s*(a\s*)?(school|mall|synagogue|mosque|church))\b/i,
  
  // Minor sexual exploitation & CSAM terms
  /\b(c\s*p|child\s*porn|underage\s*porn|pedophil|pedo\s*link|lolita\s*leak)\b/i,
  
  // Terrorism incitement
  /\b(join\s*(isis|al\s*qaeda)|praise\s*(isis|osama))\b/i,
];

// Stripped patterns (no spaces/symbols) for hidden evasions
const STRIPPED_PATTERNS = [
  /iwillkillyou/,
  /killyourself/,
  /killurself/,
  /howtomakeabomb/,
  /makepipebomb/,
  /shootupschool/,
  /childporn/,
];

/**
 * Checks a message against the safety & moderation rules.
 * @param {string} content - The message content to evaluate
 * @returns {{ isAllowed: boolean, reason?: string }}
 */
export function checkContentSafety(content) {
  if (!content || typeof content !== 'string') {
    return { isAllowed: true };
  }

  const { normalized, stripped, rawLower } = normalizeText(content);

  // Check normalized text against severe patterns
  for (const pattern of SEVERE_PATTERNS) {
    if (pattern.test(normalized) || pattern.test(rawLower)) {
      return {
        isAllowed: false,
        reason: 'Message violates Dark Chat safety guidelines (violence, threats, or illegal harm).',
      };
    }
  }

  // Check stripped string against evasion patterns
  for (const pattern of STRIPPED_PATTERNS) {
    if (pattern.test(stripped)) {
      return {
        isAllowed: false,
        reason: 'Message violates Dark Chat safety guidelines (violence, threats, or illegal harm).',
      };
    }
  }

  return { isAllowed: true };
}
