import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  charsPerFrame = 1.2,
  style,
  showCursor = false,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const cursorVisible = charsToShow < text.length && showCursor;
  const cursorBlink = Math.floor(elapsed * 0.1) % 2 === 0;

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {cursorVisible && cursorBlink && (
        <span style={{ opacity: 1, color: '#00f5ff' }}>|</span>
      )}
    </span>
  );
};
