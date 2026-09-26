export const STICKER_CATEGORIES = [
  { id: 'reactions', label: 'Reactions' },
  { id: 'vibes', label: 'Vibes' },
  { id: 'dark', label: 'Dark Mode' },
  { id: 'gestures', label: 'Gestures' },
  { id: 'gaming', label: 'Cyber' },
];

export const STICKERS = [
  // Reactions
  { id: 'stk_fire', category: 'reactions', label: 'Fire', emoji: '🔥', preview: '🔥' },
  { id: 'stk_skull', category: 'reactions', label: 'Dead', emoji: '💀', preview: '💀' },
  { id: 'stk_mindblown', category: 'reactions', label: 'Mind Blown', emoji: '🤯', preview: '🤯' },
  { id: 'stk_sob', category: 'reactions', label: 'Crying', emoji: '😭', preview: '😭' },
  { id: 'stk_rofl', category: 'reactions', label: 'Dead Laughing', emoji: '🤣', preview: '🤣' },
  { id: 'stk_eyes', category: 'reactions', label: 'Sus Eyes', emoji: '👀', preview: '👀' },
  { id: 'stk_claping', category: 'reactions', label: 'Bravo', emoji: '👏', preview: '👏' },
  { id: 'stk_100', category: 'reactions', label: 'Keep it 100', emoji: '💯', preview: '💯' },

  // Vibes
  { id: 'stk_sunglasses', category: 'vibes', label: 'Chill', emoji: '😎', preview: '😎' },
  { id: 'stk_coffee', category: 'vibes', label: 'Late Night Coffee', emoji: '☕', preview: '☕' },
  { id: 'stk_moon', category: 'vibes', label: 'Night Owl', emoji: '🌙', preview: '🌙' },
  { id: 'stk_party', category: 'vibes', label: 'Party', emoji: '🥳', preview: '🥳' },
  { id: 'stk_melting', category: 'vibes', label: 'Melting', emoji: '🫠', preview: '🫠' },
  { id: 'stk_sparkles', category: 'vibes', label: 'Magic', emoji: '✨', preview: '✨' },
  { id: 'stk_heart_dark', category: 'vibes', label: 'Black Heart', emoji: '🖤', preview: '🖤' },
  { id: 'stk_peace', category: 'vibes', label: 'Peace', emoji: '✌️', preview: '✌️' },

  // Dark Mode / Anonymous
  { id: 'stk_ghost', category: 'dark', label: 'Ghosting', emoji: '👻', preview: '👻' },
  { id: 'stk_mask', category: 'dark', label: 'Incognito', emoji: '🎭', preview: '🎭' },
  { id: 'stk_ninja', category: 'dark', label: 'Stealth Ninja', emoji: '🥷', preview: '🥷' },
  { id: 'stk_detective', category: 'dark', label: 'Spy', emoji: '🕵️‍♂️', preview: '🕵️‍♂️' },
  { id: 'stk_bat', category: 'dark', label: 'Midnight Bat', emoji: '🦇', preview: '🦇' },
  { id: 'stk_alien', category: 'dark', label: 'Extraterrestrial', emoji: '👽', preview: '👽' },
  { id: 'stk_shushing', category: 'dark', label: 'Top Secret', emoji: '🤫', preview: '🤫' },
  { id: 'stk_crystal', category: 'dark', label: 'Oracle', emoji: '🔮', preview: '🔮' },

  // Gestures
  { id: 'stk_wave', category: 'gestures', label: 'Hey', emoji: '👋', preview: '👋' },
  { id: 'stk_salute', category: 'gestures', label: 'Salute', emoji: '🫡', preview: '🫡' },
  { id: 'stk_rock', category: 'gestures', label: 'Rock On', emoji: '🤘', preview: '🤘' },
  { id: 'stk_facepalm', category: 'gestures', label: 'Facepalm', emoji: '🤦‍♂️', preview: '🤦‍♂️' },
  { id: 'stk_shrug', category: 'gestures', label: 'IDK', emoji: '🤷‍♂️', preview: '🤷‍♂️' },
  { id: 'stk_fistbump', category: 'gestures', label: 'Fist Bump', emoji: '👊', preview: '👊' },
  { id: 'stk_pray', category: 'gestures', label: 'Bless', emoji: '🙏', preview: '🙏' },
  { id: 'stk_chef', category: 'gestures', label: 'Chef Kiss', emoji: '🤌', preview: '🤌' },

  // Cyber / Gaming
  { id: 'stk_robot', category: 'gaming', label: 'Bot', emoji: '🤖', preview: '🤖' },
  { id: 'stk_gamepad', category: 'gaming', label: 'Gamer', emoji: '🎮', preview: '🎮' },
  { id: 'stk_matrix', category: 'gaming', label: 'Cyber Matrix', emoji: '💾', preview: '💾' },
  { id: 'stk_zap', category: 'gaming', label: 'Overcharge', emoji: '⚡', preview: '⚡' },
  { id: 'stk_dice', category: 'gaming', label: 'Roll Chance', emoji: '🎲', preview: '🎲' },
  { id: 'stk_trophy', category: 'gaming', label: 'Victory', emoji: '🏆', preview: '🏆' },
  { id: 'stk_comet', category: 'gaming', label: 'Speed', emoji: '☄️', preview: '☄️' },
  { id: 'stk_rocket', category: 'gaming', label: 'Launch', emoji: '🚀', preview: '🚀' },
];

export function getStickerById(id) {
  return STICKERS.find((s) => s.id === id) || null;
}
