import React from 'react';

interface GlassPanelProps {
  width?: number | string;
  height?: number | string;
  glowColor?: string;
  glowIntensity?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  borderOpacity?: number;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  width = 600,
  height = 400,
  glowColor = 'rgba(0,245,255,0.3)',
  glowIntensity = 1,
  style = {},
  children,
  borderOpacity = 0.15,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: 'rgba(8, 6, 24, 0.8)',
        backdropFilter: 'blur(32px)',
        border: `1px solid rgba(255,255,255,${borderOpacity})`,
        borderRadius: 20,
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04),
          0 8px 48px rgba(0,0,0,0.7),
          0 0 ${80 * glowIntensity}px ${glowColor},
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: '80%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      {children}
    </div>
  );
};
