import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const CODE_LINES = [
  { tokens: [{ t: 'def ', c: '#CF6EFF' }, { t: 'solve_quadratic', c: '#5B8CFF' }, { t: '(a, b, c):', c: '#333' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'discriminant', c: '#E55' }, { t: ' = b**2 - 4*a*c', c: '#333' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'if ', c: '#CF6EFF' }, { t: 'discriminant < 0:', c: '#333' }] },
  { tokens: [{ t: '        ', c: '' }, { t: 'return ', c: '#CF6EFF' }, { t: '"No real solutions"', c: '#4CAF50' }] },
  { tokens: [{ t: '    x1 = (-b + discriminant**0.5) / (2*a)', c: '#333' }] },
  { tokens: [{ t: '    x2 = (-b - discriminant**0.5) / (2*a)', c: '#333' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'return ', c: '#CF6EFF' }, { t: 'x1, x2', c: '#E55' }] },
];

const CodeCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const cardS = spring({ frame, fps, config: { damping: 14, stiffness: 70 }, durationInFrames: 50 });
  const tilt = interpolate(Math.sin(frame * 0.038), [-1, 1], [-1.2, 1.2]);

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `
        translate(-50%, -50%)
        translateY(${interpolate(cardS, [0, 1], [80, 0])}px)
        rotate(${tilt}deg)
        perspective(1200px) rotateX(3deg)
      `,
      opacity: cardS,
    }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: -30, left: '10%', width: '80%', height: 30,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      <div style={{
        width: 520,
        background: '#1C1C2E',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}>
        {/* Traffic lights header */}
        <div style={{
          padding: '14px 18px',
          background: '#252538',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
          <div style={{
            marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)',
            fontFamily: '"SF Mono", "Fira Code", monospace',
          }}>
            quadratic_solver.py
          </div>
          <div style={{
            marginLeft: 'auto',
            fontSize: 11, color: '#4CAF50',
            fontFamily: '"SF Mono", monospace',
            background: 'rgba(76,175,80,0.12)',
            padding: '2px 8px', borderRadius: 6,
          }}>● Flux suggestions on</div>
        </div>

        {/* Code */}
        <div style={{ padding: '20px 24px', fontFamily: '"SF Mono", "Fira Code", monospace' }}>
          {CODE_LINES.map((line, li) => {
            const lineDelay = li * 10 + 15;
            const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 15], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const lineX = interpolate(frame, [lineDelay, lineDelay + 15], [10, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <div key={li} style={{
                display: 'flex', marginBottom: 4,
                opacity: lineOpacity, transform: `translateX(${lineX}px)`,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13, width: 28, userSelect: 'none' }}>
                  {li + 1}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.7 }}>
                  {line.tokens.map((tok, ti) => (
                    <span key={ti} style={{ color: tok.c || '#cdd6f4' }}>{tok.t}</span>
                  ))}
                </span>
              </div>
            );
          })}

          {/* Flux inline suggestion */}
          {frame > 95 && (
            <div style={{
              marginTop: 16, padding: '10px 14px',
              background: 'rgba(91,140,255,0.1)',
              border: '1px solid rgba(91,140,255,0.25)',
              borderRadius: 10,
              opacity: interpolate(frame, [95, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <div style={{ fontSize: 11, color: '#5B8CFF', fontWeight: 600, marginBottom: 4 }}>
                ✦ Flux suggestion
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                Add error handling for a=0 to avoid division by zero
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [8, 30], [20, 0], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [155, 175], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        textAlign: 'center',
        opacity: textOpacity, transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 58, fontWeight: 700, color: '#111', letterSpacing: -1.5 }}>
          Code smarter with{' '}
          <span style={{ color: '#5B8CFF' }}>Flux Code.</span>
        </div>
        <div style={{ fontSize: 20, color: 'rgba(0,0,0,0.45)', marginTop: 12, fontWeight: 400 }}>
          AI pair programming for every assignment
        </div>
      </div>

      <CodeCard frame={frame} />
    </AbsoluteFill>
  );
};
