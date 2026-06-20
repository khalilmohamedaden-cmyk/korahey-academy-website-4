import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';

const CODE_LINES = [
  { tokens: [{ t: 'def ', c: '#CF6EFF' }, { t: 'solve_quadratic', c: '#7CB9FF' }, { t: '(a, b, c):', c: 'rgba(255,255,255,0.7)' }] },
  { tokens: [{ t: '    discriminant', c: '#FF7070' }, { t: ' = b**2 - 4*a*c', c: 'rgba(255,255,255,0.6)' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'if ', c: '#CF6EFF' }, { t: 'discriminant < 0:', c: 'rgba(255,255,255,0.6)' }] },
  { tokens: [{ t: '        ', c: '' }, { t: 'return ', c: '#CF6EFF' }, { t: '"No real solutions"', c: '#4CAF50' }] },
  { tokens: [{ t: '    x1 = (-b + discriminant**0.5) / (2*a)', c: 'rgba(255,255,255,0.6)' }] },
  { tokens: [{ t: '    x2 = (-b - discriminant**0.5) / (2*a)', c: 'rgba(255,255,255,0.6)' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'return ', c: '#CF6EFF' }, { t: 'x1, x2', c: '#FF7070' }] },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CAMERA: arc/orbit movement — pans right while tilting perspective
  const camX = interpolate(frame, [0, 180], [60, -20], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const camY = interpolate(frame, [0, 90, 180], [0, -15, 5], { extrapolateRight: 'clamp' });
  const camScale = interpolate(frame, [0, 40, 180], [0.88, 1.02, 1.0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const perspRot = interpolate(frame, [0, 180], [-4, 4], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [158, 178], [1, 0], { extrapolateRight: 'clamp' });

  const cardS = spring({ frame: frame - 4, fps, config: { damping: 15, stiffness: 75 }, durationInFrames: 45 });
  const tilt = interpolate(Math.sin(frame * 0.038), [-1, 1], [-1.5, 1.5]);
  const floatY = interpolate(Math.sin(frame * 0.05), [-1, 1], [-8, 8]);

  const titleS = spring({ frame: frame - 2, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 28 });

  const orbX = interpolate(Math.sin(frame * 0.03), [-1, 1], [-80, 80]);

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <AbsoluteFill style={{
        transform: `scale(${camScale}) translate(${camX}px, ${camY}px) perspective(1800px) rotateY(${perspRot}deg)`,
      }}>
        {/* Ambient */}
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,140,255,0.12) 0%, transparent 60%)',
          right: `calc(20% + ${orbX}px)`, top: '5%',
          filter: 'blur(80px)',
        }} />

        {/* Left — headline */}
        <div style={{
          position: 'absolute', left: 110, top: '50%',
          transform: `translateY(-50%) translateY(${interpolate(titleS, [0, 1], [28, 0])}px)`,
          opacity: titleS, width: 380,
        }}>
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 16 }}>
            Flux Code
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05, color: '#fff' }}>
            Code smarter.{'\n'}
            <span style={{
              background: 'linear-gradient(120deg, #5B8CFF, #B06EFF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Ship faster.
            </span>
          </div>
          <div style={{
            fontSize: 17, color: 'rgba(255,255,255,0.35)', marginTop: 18, lineHeight: 1.5,
            opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            AI pair programming. For every assignment.
          </div>
        </div>

        {/* Right — code editor glass card */}
        <div style={{
          position: 'absolute', right: 90, top: '50%',
          transform: `
            translateY(calc(-50% + ${floatY}px))
            rotate(${tilt}deg)
            scale(${interpolate(cardS, [0, 1], [0.84, 1])})
            perspective(1400px) rotateY(${interpolate(cardS, [0, 1], [14, 0])}deg)
          `,
          opacity: cardS,
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: '10%', width: '80%', height: 40,
            background: 'radial-gradient(ellipse, rgba(176,110,255,0.25) 0%, transparent 70%)',
            filter: 'blur(18px)',
          }} />

          <div style={{
            width: 480,
            background: 'rgba(12,12,28,0.92)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          }}>
            {/* Traffic lights */}
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                marginLeft: 10, fontSize: 11, color: 'rgba(255,255,255,0.28)',
                fontFamily: 'monospace',
              }}>quadratic_solver.py</div>
              <div style={{
                marginLeft: 'auto', fontSize: 10, color: '#4CAF50',
                background: 'rgba(76,175,80,0.10)',
                padding: '2px 8px', borderRadius: 5, fontFamily: 'monospace',
              }}>● Flux on</div>
            </div>

            {/* Code */}
            <div style={{ padding: '18px 20px', fontFamily: '"Fira Code", "SF Mono", monospace' }}>
              {CODE_LINES.map((line, li) => {
                const d = li * 10 + 12;
                const op = interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const x = interpolate(frame, [d, d + 14], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={li} style={{ display: 'flex', marginBottom: 4, opacity: op, transform: `translateX(${x}px)` }}>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, width: 26, fontFamily: 'monospace', flexShrink: 0 }}>
                      {li + 1}
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.75 }}>
                      {line.tokens.map((tok, ti) => (
                        <span key={ti} style={{ color: tok.c || 'rgba(255,255,255,0.6)' }}>{tok.t}</span>
                      ))}
                    </span>
                  </div>
                );
              })}

              {/* Inline suggestion */}
              {frame > 90 && (
                <div style={{
                  marginTop: 14, padding: '10px 14px',
                  background: 'rgba(91,140,255,0.08)',
                  border: '1px solid rgba(91,140,255,0.20)',
                  borderRadius: 10,
                  opacity: interpolate(frame, [90, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  transform: `translateY(${interpolate(
                    interpolate(frame, [90, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    [0, 1], [8, 0]
                  )}px)`,
                }}>
                  <div style={{ fontSize: 10, color: '#5B8CFF', fontWeight: 700, marginBottom: 5, letterSpacing: 1 }}>
                    ✦ FLUX SUGGESTION
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontFamily: 'monospace' }}>
                    Handle a=0 to avoid division by zero
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
