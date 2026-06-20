import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface AuroraProps {
  startFrame?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const Aurora: React.FC<AuroraProps> = ({
  startFrame = 0,
  primaryColor = '#00f5ff',
  secondaryColor = '#9b59b6',
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const opacity = interpolate(elapsed, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const drift1 = Math.sin(elapsed * 0.008) * 60;
  const drift2 = Math.cos(elapsed * 0.006) * 40;
  const drift3 = Math.sin(elapsed * 0.01 + 1) * 50;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      {/* Primary orb — top-left */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${primaryColor}18 0%, transparent 70%)`,
          top: -100 + drift1,
          left: -200 + drift2,
          filter: 'blur(80px)',
        }}
      />
      {/* Secondary orb — bottom-right */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${secondaryColor}15 0%, transparent 70%)`,
          bottom: -150 + drift3,
          right: -100 - drift1 * 0.3,
          filter: 'blur(100px)',
        }}
      />
      {/* Center accent */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${primaryColor}08 0%, transparent 70%)`,
          top: '40%',
          left: '30%',
          filter: 'blur(60px)',
          transform: `translate(${drift2 * 0.5}px, ${drift3 * 0.3}px)`,
        }}
      />
    </div>
  );
};
