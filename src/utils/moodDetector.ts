// Mood detection based on user input keywords
export type Mood = 'calm' | 'melancholy' | 'hopeful' | 'mysterious' | 'joyful' | 'introspective';

interface MoodTheme {
  gradient: string;
  particleColor: string;
  glowColor: string;
  particleCount: number;
}

const moodKeywords: Record<Mood, string[]> = {
  calm: ['peace', 'calm', 'quiet', 'still', 'breathe', 'rest', 'gentle', 'soft'],
  melancholy: ['sad', 'lonely', 'lost', 'miss', 'gone', 'empty', 'tears', 'sorrow', 'grief'],
  hopeful: ['hope', 'future', 'tomorrow', 'dream', 'wish', 'light', 'dawn', 'new', 'begin'],
  mysterious: ['mystery', 'secret', 'hidden', 'shadow', 'unknown', 'dark', 'night', 'moon'],
  joyful: ['joy', 'happy', 'love', 'laugh', 'bright', 'smile', 'celebrate', 'beautiful'],
  introspective: ['think', 'wonder', 'question', 'why', 'meaning', 'self', 'soul', 'truth']
};

export const moodThemes: Record<Mood, MoodTheme> = {
  calm: {
    gradient: 'from-slate-950 via-blue-950 to-teal-950',
    particleColor: 'rgba(147, 197, 253, 0.6)',
    glowColor: 'rgba(147, 197, 253, 0.3)',
    particleCount: 60
  },
  melancholy: {
    gradient: 'from-black via-slate-900 to-blue-900',
    particleColor: 'rgba(148, 163, 184, 0.5)',
    glowColor: 'rgba(148, 163, 184, 0.2)',
    particleCount: 40
  },
  hopeful: {
    gradient: 'from-slate-900 via-amber-950 to-orange-950',
    particleColor: 'rgba(251, 191, 36, 0.6)',
    glowColor: 'rgba(251, 191, 36, 0.3)',
    particleCount: 80
  },
  mysterious: {
    gradient: 'from-black via-purple-950 to-slate-900',
    particleColor: 'rgba(168, 85, 247, 0.6)',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    particleCount: 70
  },
  joyful: {
    gradient: 'from-slate-900 via-pink-950 to-orange-950',
    particleColor: 'rgba(251, 146, 60, 0.7)',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    particleCount: 100
  },
  introspective: {
    gradient: 'from-black via-indigo-950 to-slate-900',
    particleColor: 'rgba(199, 210, 254, 0.5)',
    glowColor: 'rgba(199, 210, 254, 0.3)',
    particleCount: 50
  }
};

export function detectMood(input: string): Mood {
  const normalizedInput = input.toLowerCase();

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      if (normalizedInput.includes(keyword)) {
        return mood as Mood;
      }
    }
  }

  // Default to mysterious
  return 'mysterious';
}