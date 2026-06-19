import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const generateParticles = (count: number): Particle[] => {
  const colors = ['#00f5ff', '#9b59b6', '#1a0a4a', '#ffffff'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 97 + 13) % 100,
    y: (i * 61 + 37) % 100,
    size: ((i * 7) % 4) + 1,
    speed: ((i * 3) % 5) + 1,
    opacity: ((i * 11) % 6) / 10 + 0.1,
    color: colors[i % colors.length],
  }));
};

interface ParticlesProps {
  count?: number;
  startFrame?: number;
  containerWidth?: number;
  containerHeight?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 20,
  startFrame = 0,
  containerWidth = 1920,
  containerHeight = 1080,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => generateParticles(count), [count]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {particles.map((p) => {
        const elapsed = frame - startFrame;
        const drift = interpolate(elapsed, [0, 300], [0, -p.speed * 80], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const horizontalDrift = Math.sin(elapsed * 0.03 + p.id) * 20;
        const pulseOpacity = interpolate(
          Math.sin(elapsed * 0.05 + p.id * 0.7),
          [-1, 1],
          [p.opacity * 0.4, p.opacity],
        );

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              opacity: pulseOpacity,
              transform: `translateX(${horizontalDrift}px) translateY(${drift}px)`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
