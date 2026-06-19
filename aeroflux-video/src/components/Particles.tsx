import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

const SEED_PARTICLES = [
  { x: 12, y: 80, size: 2, speed: 0.6, phase: 0.0, opacity: 0.6 },
  { x: 25, y: 60, size: 1.5, speed: 0.4, phase: 1.2, opacity: 0.4 },
  { x: 38, y: 90, size: 2.5, speed: 0.7, phase: 2.4, opacity: 0.7 },
  { x: 50, y: 40, size: 1, speed: 0.5, phase: 0.8, opacity: 0.5 },
  { x: 62, y: 70, size: 2, speed: 0.8, phase: 3.6, opacity: 0.6 },
  { x: 75, y: 85, size: 1.5, speed: 0.3, phase: 1.8, opacity: 0.4 },
  { x: 88, y: 55, size: 2, speed: 0.6, phase: 4.2, opacity: 0.55 },
  { x: 18, y: 30, size: 1, speed: 0.9, phase: 0.4, opacity: 0.35 },
  { x: 32, y: 15, size: 1.5, speed: 0.5, phase: 2.0, opacity: 0.45 },
  { x: 45, y: 95, size: 2, speed: 0.4, phase: 5.0, opacity: 0.5 },
  { x: 58, y: 20, size: 1, speed: 0.7, phase: 1.4, opacity: 0.3 },
  { x: 70, y: 45, size: 2.5, speed: 0.6, phase: 3.0, opacity: 0.65 },
  { x: 82, y: 10, size: 1.5, speed: 0.8, phase: 0.6, opacity: 0.4 },
  { x: 92, y: 75, size: 2, speed: 0.3, phase: 2.8, opacity: 0.55 },
  { x: 5, y: 50, size: 1, speed: 0.5, phase: 4.6, opacity: 0.35 },
  { x: 20, y: 65, size: 2, speed: 0.7, phase: 1.6, opacity: 0.5 },
  { x: 55, y: 35, size: 1.5, speed: 0.4, phase: 3.2, opacity: 0.45 },
  { x: 78, y: 25, size: 2, speed: 0.6, phase: 0.2, opacity: 0.6 },
  { x: 42, y: 78, size: 1, speed: 0.9, phase: 4.8, opacity: 0.3 },
  { x: 65, y: 88, size: 2.5, speed: 0.5, phase: 2.2, opacity: 0.7 },
];

interface ParticlesProps {
  count?: number;
  startFrame?: number;
  color?: string;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 20,
  startFrame = 0,
  color = '#00f5ff',
}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {SEED_PARTICLES.slice(0, count).map((p, i) => {
        const drift = t * p.speed * 0.15;
        const sine = Math.sin((t * 0.02) + p.phase) * 1.5;
        const yPos = ((p.y - drift) % 110) - 5;
        const fadeIn = interpolate(t, [0, 40], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const twinkle = 0.5 + Math.sin((t * 0.05) + p.phase * 2) * 0.5;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x + sine}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              opacity: p.opacity * fadeIn * twinkle,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
