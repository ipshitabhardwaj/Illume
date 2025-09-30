// Living poem system - creates variations of words for dynamic poetry
interface WordVariation {
  [key: string]: string[];
}

const wordSynonyms: WordVariation = {
  'stars': ['stars', 'celestial lights', 'distant suns', 'cosmic embers'],
  'secrets': ['secrets', 'mysteries', 'whispers', 'hidden truths'],
  'silence': ['silence', 'stillness', 'quiet', 'hush'],
  'darkness': ['darkness', 'shadow', 'night', 'void'],
  'dreams': ['dreams', 'visions', 'reveries', 'fantasies'],
  'sunlight': ['sunlight', 'golden rays', 'dawn light', 'morning glow'],
  'moon': ['moon', 'lunar orb', 'night eye', 'silver sentinel'],
  'melody': ['melody', 'song', 'tune', 'harmony'],
  'heartbeats': ['heartbeats', 'pulses', 'rhythms', 'life drums'],
  'oracle': ['oracle', 'seer', 'mystic', 'sage'],
  'sky': ['sky', 'heavens', 'firmament', 'celestial canvas']
};

export function applyLivingPoem(line: string, variationSeed: number): string {
  let variedLine = line;

  // Apply variations based on seed (deterministic randomness)
  Object.entries(wordSynonyms).forEach(([original, variations]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    if (regex.test(variedLine)) {
      const index = Math.floor(variationSeed * variations.length) % variations.length;
      variedLine = variedLine.replace(regex, variations[index]);
    }
  });

  return variedLine;
}

export function shouldApplyVariation(): boolean {
  // 30% chance to apply variation
  return Math.random() < 0.3;
}