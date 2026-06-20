import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';

const SUBJECTS = [
  { name: 'Mathematics', progress: 82, color: '#5B8CFF', icon: '∑' },
  { name: 'Physics', progress: 67, color: '#B06EFF', icon: '⚡' },
  { name: 'Chemistry', progress: 91, color: '#4DFFA0', icon: '⚗' },
  { name: 'Literature', progress: 55, color: '#FF9F40', icon: '✦' },
];

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CAMERA: dramatic pull-back + upward drift — starts close, zooms out to reveal
  const camScale = interpolate(frame, [0, 80, 180], [1.18, 1.0, 0.97], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camY = interpolate(frame, [0, 180], [30, -20], { extrapolateRight: 'clamp' });
  const camX = interpolate(frame, [0, 180], [-20, 25], { extrapolateRight: 'clamp' });
  const perspRot = interpolate(frame, [0, 180], [3, -2], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [158, 178], [1, 0], { extrapolateRight: 'clamp' });

  const cardS = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 72 }, durationInFrames: 48 });
  const tilt = interpolate(Math.sin(frame * 0.032), [-1, 1], [-1, 1]);
  const floatY = interpolate(Math.sin(frame * 0.055), [-1, 1], [-7, 7]);

  const titleS = spring({ frame: frame - 2, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 28 });

  const orbX = interpolate(Math.sin(frame * 0.02), [-1, 1], [-50, 50]);
  const orbY = interpolate(Math.cos(frame * 0.024), [-1, 1], [-30, 30]);

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <AbsoluteFill style={{
        transform: `scale(${camScale}) translate(${camX}px, ${camY}px) perspective(1600px) rotateX(${perspRot}deg)`,
      }}>
        {/* Ambient */}
        <div style={{
          position: 'absolute', width: 650, height: 650, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,255,160,0.08) 0%, transparent 60%)',
          left: `calc(55% + ${orbX}px)`, top: `calc(20% + ${orbY}px)`,
          filter: 'blur(90px)',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,140,255,0.10) 0%, transparent 60%)',
          left: `calc(10% - ${orbX * 0.4}px)`, bottom: '15%',
          filter: 'blur(70px)',
        }} />

        {/* Left — headline */}
        <div style={{
          position: 'absolute', left: 110, top: '50%',
          transform: `translateY(-50%) translateY(${interpolate(titleS, [0, 1], [28, 0])}px)`,
          opacity: titleS, width: 380,
        }}>
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 16 }}>
            Flux Study
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05, color: '#fff' }}>
            Track it all.{'\n'}
            <span style={{
              background: 'linear-gradient(120deg, #4DFFA0, #5B8CFF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Stay ahead.
            </span>
          </div>
          <div style={{
            fontSize: 17, color: 'rgba(255,255,255,0.35)', marginTop: 18, lineHeight: 1.5,
            opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            Your progress. Always in focus.
          </div>

          {/* Mini stat pills */}
          <div style={{
            display: 'flex', gap: 10, marginTop: 36, flexWrap: 'wrap',
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            {[{ v: '14.5h', l: 'studied' }, { v: '238', l: 'flashcards' }, { v: '9d', l: 'streak' }].map((s, i) => {
              const ps = spring({ frame: frame - (70 + i * 12), fps, config: { damping: 18, stiffness: 110 }, durationInFrames: 22 });
              return (
                <div key={i} style={{
                  padding: '8px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: ps, transform: `scale(${ps})`,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.l}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — study progress glass card */}
        <div style={{
          position: 'absolute', right: 90, top: '50%',
          transform: `
            translateY(calc(-50% + ${floatY}px))
            rotate(${tilt}deg)
            scale(${interpolate(cardS, [0, 1], [0.85, 1])})
            perspective(1400px) rotateY(${interpolate(cardS, [0, 1], [-14, 0])}deg)
          `,
          opacity: cardS,
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: '15%', width: '70%', height: 40,
            background: 'radial-gradient(ellipse, rgba(77,255,160,0.20) 0%, transparent 70%)',
            filter: 'blur(18px)',
          }} />

          <div style={{
            width: 420,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(48px)',
            WebkitBackdropFilter: 'blur(48px)',
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.09)',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
          }}>
            {/* Header */}
            <div style={{ padding: '18px 22px 10px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                Flux Study
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                Your progress this week
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Hours studied', value: '14.5' },
                { label: 'Flashcards', value: '238' },
                { label: 'Streak', value: '9 days' },
              ].map((s, i) => {
                const d = i * 10 + 18;
                const op = interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={i} style={{
                    flex: 1, textAlign: 'center', opacity: op,
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Progress bars */}
            <div style={{ padding: '14px 22px 20px' }}>
              {SUBJECTS.map((sub, i) => {
                const delay = i * 12 + 32;
                const op = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const barW = interpolate(frame, [delay + 4, delay + 32], [0, sub.progress], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={i} style={{ marginBottom: 14, opacity: op }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{sub.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{sub.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: sub.color }}>{Math.round(barW)}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${barW}%`,
                        background: sub.color, borderRadius: 99,
                        boxShadow: `0 0 10px ${sub.color}66`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
