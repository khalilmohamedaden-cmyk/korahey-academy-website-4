import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

// A floating 3D-ish card with a messy notebook aesthetic
const MessyCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 50 });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const tilt = interpolate(Math.sin(frame * 0.04), [-1, 1], [-1.5, 1.5]);

  const todos = [
    { text: 'Study chapter 7', done: false, color: '#FF6B6B' },
    { text: 'Finish essay draft', done: false, color: '#FF6B6B' },
    { text: 'Review lecture notes', done: false, color: '#FF9F40' },
    { text: 'Practice problems...', done: false, color: '#FF9F40' },
    { text: 'Watch recorded class', done: false, color: '#FF6B6B' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `
          translate(-50%, -50%)
          translateY(${interpolate(cardSpring, [0, 1], [80, 0])}px)
          rotate(${tilt}deg)
          perspective(1200px) rotateX(4deg)
        `,
        opacity,
      }}
    >
      {/* Shadow */}
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: '10%',
        width: '80%',
        height: 30,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      {/* Card */}
      <div style={{
        width: 420,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Yellow header */}
        <div style={{
          background: '#FFD60A',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>Today's Tasks</span>
          <span style={{ fontSize: 15, color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>···</span>
        </div>

        {/* Title */}
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 4 }}>
            So much to do...
          </div>
          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', marginTop: 10 }} />
        </div>

        {/* Todo items */}
        <div style={{ padding: '8px 24px 24px' }}>
          {todos.map((t, i) => {
            const itemDelay = i * 8;
            const itemOpacity = interpolate(frame, [20 + itemDelay, 36 + itemDelay], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const itemX = interpolate(frame, [20 + itemDelay, 36 + itemDelay], [16, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 0',
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: `2px solid ${t.color}`,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 15, color: '#333', fontWeight: 450 }}>{t.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [10, 35], [20, 0], { extrapolateRight: 'clamp' });

  // Fade out at end
  const fadeOut = interpolate(frame, [155, 175], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Headline */}
      <div style={{
        position: 'absolute',
        top: 200,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 58, fontWeight: 700, color: '#111', letterSpacing: -1.5, lineHeight: 1.1 }}>
          Learning gets{' '}
          <span style={{ color: '#FF6B6B' }}>overwhelming.</span>
        </div>
      </div>

      {/* Floating card */}
      <MessyCard frame={frame} />
    </AbsoluteFill>
  );
};
