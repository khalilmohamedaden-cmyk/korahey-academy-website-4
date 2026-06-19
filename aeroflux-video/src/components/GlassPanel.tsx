import React from 'react';

interface GlassPanelProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  glowColor?: string;
  borderOpacity?: number;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  width = 600,
  height = 400,
  style = {},
  children,
  glowColor = 'rgba(0,245,255,0.2)',
  borderOpacity = 0.15,
}) => {
  const panelStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    background: 'rgba(10,10,30,0.7)',
    border: `1px solid rgba(255,255,255,${borderOpacity})`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 20,
    boxShadow: `0 0 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`,
    overflow: 'hidden',
    ...style,
  };

  return <div style={panelStyle}>{children}</div>;
};
