const ADJECTIVES = [
  'Shadow',
  'Night',
  'Dark',
  'Cyber',
  'Vortex',
  'Obsidian',
  'Phantom',
  'Ghost',
  'Silent',
  'Echo',
  'Neon',
  'Abyss',
  'Nova',
  'Cosmic',
  'Mystic',
  'Stealth',
  'Astral',
  'Iron',
  'Quantum',
  'Zero',
  'Hidden',
  'Coded',
  'Enigma',
  'Midnight',
];

const NOUNS = [
  'User',
  'Fox',
  'Wolf',
  'Rider',
  'Specter',
  'Nomad',
  'Walker',
  'Drifter',
  'Falcon',
  'Viper',
  'Raven',
  'Cipher',
  'Spark',
  'Shade',
  'Stalker',
  'Reaper',
  'Hunter',
  'Pilot',
  'Blade',
  'Watcher',
  'Nexus',
  'Agent',
  'Oracle',
  'Echo',
];

/**
 * Generates a random anonymous username like "ShadowUser4821" or "NightFox7392"
 */
export function generateAnonymousUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${adj}${noun}${num}`;
}
