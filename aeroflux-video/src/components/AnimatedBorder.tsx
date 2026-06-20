import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface AnimatedBorderProps {
  width: number;
  height: number;
  startFrame: number;
  color?: string;
  thickness?: number;
  children?: React.ReactNode;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  width,
  height,
  startFrame,
  color = '#00f5ff',
  thickness = 1.5,
  children,
  borderRadius = 16,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const progress = interpolate(elapsed, [0, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const perimeter = 2 * (width + height);
  const dashOffset = perimeter * (1 - progress);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius,
        ...style,
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        width={width}
        height={height}
      >
        <rect
          x={thickness / 2}
          y={thickness / 2}
          width={width - thickness}
          height={height - thickness}
          rx={borderRadius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={perimeter}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}88)`,
          }}
        />
      </svg>
      {children}
    </div>
  );
};
