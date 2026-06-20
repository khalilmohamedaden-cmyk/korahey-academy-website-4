import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface GlowTextProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  fontWeight?: number | string;
  letterSpacing?: number;
  style?: React.CSSProperties;
  stagger?: number;
}

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  startFrame,
  fontSize = 72,
  color = '#ffffff',
  glowColor = '#00f5ff',
  fontWeight = 800,
  letterSpacing = -2,
  style = {},
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const chars = text.split('');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        lineHeight: 1,
        ...style,
      }}
    >
      {chars.map((char, i) => {
        const charStart = startFrame + i * stagger;
        const opacity = interpolate(frame, [charStart, charStart + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const y = interpolate(frame, [charStart, charStart + 18], [30, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(1.5)),
        });
        const blur = interpolate(frame, [charStart, charStart + 20], [8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight,
              color,
              letterSpacing,
              opacity,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              textShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}44`,
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        );
      })}
    </div>
  );
};
