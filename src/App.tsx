import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { MoodStarField } from './components/MoodStarField';
import { ConstellationPoem } from './components/ConstellationPoem';
import { detectMood, moodThemes, type Mood } from './utils/moodDetector';
import { applyLivingPoem, shouldApplyVariation } from './utils/poemVariations';

interface Poem {
  title: string;
  lines: string[];
}

interface PoemHistory {
  poem: Poem;
  id: string;
  opacity: number;
}

type ViewMode = 'standard' | 'constellation';

function App() {
  const [input, setInput] = useState('');
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mood, setMood] = useState<Mood>('mysterious');
  const [poemHistory, setPoemHistory] = useState<PoemHistory[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [visualEffect, setVisualEffect] = useState<'sparkles' | 'ink' | 'stars'>('sparkles');

  // Load poems from poems.json on mount
  useEffect(() => {
    fetch('/poems.json')
      .then(res => res.json())
      .then(data => setPoems(data))
      .catch(err => console.error('Failed to load poems:', err));
  }, []);

  // Update mood when input changes
  useEffect(() => {
    if (input.trim()) {
      const detectedMood = detectMood(input);
      setMood(detectedMood);
    }
  }, [input]);

  // Fade out old poems in history
  useEffect(() => {
    const interval = setInterval(() => {
      setPoemHistory(prev =>
        prev
          .map(item => ({ ...item, opacity: item.opacity - 0.02 }))
          .filter(item => item.opacity > 0)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const selectAndShowPoem = () => {
    // Select random poem
    const randomIndex = Math.floor(Math.random() * poems.length);
    let selectedPoem = { ...poems[randomIndex] };

    // Apply living poem variations
    if (shouldApplyVariation()) {
      const variationSeed = Math.random();
      selectedPoem = {
        ...selectedPoem,
        lines: selectedPoem.lines.map(line => applyLivingPoem(line, variationSeed))
      };
    }

    // Add current poem to history before showing new one
    if (currentPoem) {
      setPoemHistory(prev => [
        ...prev,
        { poem: currentPoem, id: Date.now().toString(), opacity: 0.4 }
      ]);
    }

    // Random visual effect
    const effects: Array<'sparkles' | 'ink' | 'stars'> = ['sparkles', 'ink', 'stars'];
    setVisualEffect(effects[Math.floor(Math.random() * effects.length)]);

    setIsFadingOut(false);
    setCurrentPoem(selectedPoem);
  };

  const askOracle = () => {
    if (poems.length === 0) return;

    if (currentPoem) {
      setIsFadingOut(true);
      setTimeout(() => {
        selectAndShowPoem();
      }, 600);
    } else {
      selectAndShowPoem();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      askOracle();
    }
  };

  const theme = moodThemes[mood];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden transition-all duration-1000`}>
      {/* Mood-based animated starfield */}
      <MoodStarField
        mood={mood}
        particleColor={theme.particleColor}
        particleCount={theme.particleCount}
      />

      {/* Static starry background */}
      <div className="stars-background"></div>

      {/* Poem history - faded in background */}
      {poemHistory.map((item) => (
        <div
          key={item.id}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 max-w-2xl w-full pointer-events-none"
          style={{ opacity: item.opacity }}
        >
          <div className="poem-memory">
            <p className="text-white/40 text-sm font-serif text-center">
              {item.poem.lines[0]}
            </p>
          </div>
        </div>
      ))}

      <div className="max-w-3xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-serif text-white mb-4 tracking-wide glow-text">
            Illume
          </h1>
          <p className="text-slate-300 text-lg font-light tracking-wider">
            ask a question, receive a verse from my world
          </p>
          {mood !== 'mysterious' && (
            <p className="text-sm text-orange-400/70 mt-2 italic">
              sensing a {mood} mood...
            </p>
          )}
        </div>

        {/* Input Section */}
        <div className="mb-12">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="type your thought..."
            className="w-full px-6 py-4 bg-black/30 border border-orange-500/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm shadow-xl"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={askOracle}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 oracle-button flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FF8C42' }}
            >
              Ask the Oracle
              <Sparkles className="w-5 h-5" />
            </button>

            {currentPoem && (
              <button
                onClick={() => setViewMode(prev => prev === 'standard' ? 'constellation' : 'standard')}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm"
              >
                {viewMode === 'standard' ? '✨ Constellation' : '📜 Standard'}
              </button>
            )}
          </div>
        </div>

        {/* Poem Display */}
        {currentPoem && (
          <div className={`poem-container ${isFadingOut ? 'fading-out' : ''} ${visualEffect}-effect`}>
            {viewMode === 'standard' ? (
              <>
                <h2 className="text-2xl font-serif text-orange-400 mb-6 text-center tracking-wide poem-title">
                  {currentPoem.title}
                </h2>

                <div className="space-y-6">
                  {currentPoem.lines.map((line, index) => (
                    <p
                      key={`${currentPoem.title}-${index}`}
                      className="poem-line text-xl font-serif text-white/90 text-center leading-relaxed"
                      style={{
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Visual effect indicators */}
                <div className="flex justify-center gap-2 mt-8 opacity-40">
                  {visualEffect === 'sparkles' && <Sparkles className="w-4 h-4 text-orange-400" />}
                  {visualEffect === 'ink' && <span className="text-orange-400 text-sm">✒️</span>}
                  {visualEffect === 'stars' && <span className="text-orange-400 text-sm">⭐</span>}
                </div>
              </>
            ) : (
              <ConstellationPoem
                lines={currentPoem.lines}
                title={currentPoem.title}
                glowColor={theme.particleColor}
              />
            )}
          </div>
        )}

        {/* Instruction text */}
        {!currentPoem && (
          <div className="text-center text-slate-400 text-sm mt-12 animate-pulse">
            whisper your question to the stars...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;