import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const SUBJECTS = [
  { name: 'Mathematics', progress: 82, color: '#5B8CFF', icon: '∑' },
  { name: 'Physics', progress: 67, color: '#B06EFF', icon: '⚡' },
  { name: 'Chemistry', progress: 91, color: '#4CAF50', icon: '⚗' },
  { name: 'Literature', progress: 55, color: '#FF9F40', icon: '✦' },
];

const StudyCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const cardS = spring({ frame, fps, config: { damping: 14, stiffness: 70 }, durationInFrames: 50 });
  const tilt = interpolate(Math.sin(frame * 0.032), [-1, 1], [-1, 1]);

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
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      <div style={{
        width: 460, background: '#fff',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>
            Flux Study
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginTop: 4 }}>
            Your progress this week
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {[
            { label: 'Hours studied', value: '14.5' },
            { label: 'Flashcards done', value: '238' },
            { label: 'Streak', value: '9 days' },
          ].map((s, i) => {
            const delay = i * 10 + 20;
            const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                flex: 1, textAlign: 'center', opacity: op,
                borderRight: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Subject progress bars */}
        <div style={{ padding: '16px 24px 24px' }}>
          {SUBJECTS.map((sub, i) => {
            const delay = i * 12 + 35;
            const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const barProgress = interpolate(frame, [delay + 5, delay + 35], [0, sub.progress], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            return (
              <div key={i} style={{ marginBottom: 14, opacity: op }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{sub.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{sub.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: sub.color }}>{Math.round(barProgress)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${barProgress}%`,
                    background: sub.color,
                    borderRadius: 99,
                    boxShadow: `0 0 8px ${sub.color}66`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Scene4: React.FC = () => {
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
          Track it all with{' '}
          <span style={{ color: '#5B8CFF' }}>Flux Study.</span>
        </div>
        <div style={{ fontSize: 20, color: 'rgba(0,0,0,0.45)', marginTop: 12, fontWeight: 400 }}>
          Your progress, always in focus
        </div>
      </div>

      <StudyCard frame={frame} />
    </AbsoluteFill>
  );
};
