import { useEffect, useRef, useState } from 'react';

interface Props {
  lines: string[];
  title: string;
  glowColor: string;
}

interface Star {
  x: number;
  y: number;
  word: string;
  revealed: boolean;
}

export function ConstellationPoem({ lines, title, glowColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  useEffect(() => {
    // Create constellation from poem words
    const words = lines.join(' ').split(' ');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newStars: Star[] = words.map((word, index) => ({
      x: (index * 80 + 100 + Math.random() * 40) % (canvas.width - 100),
      y: 100 + (Math.floor(index / 8) * 80) + Math.random() * 40,
      word,
      revealed: false
    }));

    setStars(newStars);

    // Gradually reveal stars
    newStars.forEach((_, index) => {
      setTimeout(() => {
        setStars(prev => prev.map((star, i) =>
          i === index ? { ...star, revealed: true } : star
        ));
      }, index * 200);
    });
  }, [lines]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between stars
      ctx.strokeStyle = glowColor.replace('0.6', '0.2');
      ctx.lineWidth = 1;

      for (let i = 0; i < stars.length - 1; i++) {
        if (stars[i].revealed && stars[i + 1].revealed) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[i + 1].x, stars[i + 1].y);
          ctx.stroke();
        }
      }

      // Draw stars
      stars.forEach((star) => {
        if (!star.revealed) return;

        const isHovered = hoveredWord === star.word;
        const size = isHovered ? 6 : 4;

        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3);
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(0.5, glowColor.replace('0.6', '0.3'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw word if hovered
        if (isHovered) {
          ctx.fillStyle = 'white';
          ctx.font = '14px serif';
          ctx.textAlign = 'center';
          ctx.fillText(star.word, star.x, star.y - 15);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [stars, hoveredWord, glowColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredStar = stars.find(star => {
      const distance = Math.sqrt(Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2));
      return distance < 15;
    });

    setHoveredWord(hoveredStar?.word || null);
  };

  return (
    <div className="constellation-container">
      <h3 className="text-xl font-serif text-center mb-4 text-orange-400">{title}</h3>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredWord(null)}
        className="constellation-canvas mx-auto"
        style={{ cursor: hoveredWord ? 'pointer' : 'default' }}
      />
    </div>
  );
}