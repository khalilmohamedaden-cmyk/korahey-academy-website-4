import React from 'react';
import { useCurrentFrame } from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
  cursorStyle?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  charsPerFrame = 0.5,
  style = {},
  cursorStyle = {},
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length,
  );
  const visibleText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;
  const cursorBlink = Math.floor(elapsed / 15) % 2 === 0;

  const defaultStyle: React.CSSProperties = {
    fontFamily: '"Space Grotesk", "Inter", sans-serif',
    fontSize: 16,
    fontWeight: 300,
    color: '#e0e8ff',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    ...style,
  };

  const defaultCursorStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 2,
    height: '1.2em',
    background: '#00f5ff',
    marginLeft: 2,
    verticalAlign: 'text-bottom',
    opacity: cursorBlink ? 1 : 0,
    boxShadow: '0 0 6px #00f5ff',
    ...cursorStyle,
  };

  return (
    <span style={defaultStyle}>
      {visibleText}
      {showCursor && (isTyping || cursorBlink) && (
        <span style={defaultCursorStyle} />
      )}
    </span>
  );
};
