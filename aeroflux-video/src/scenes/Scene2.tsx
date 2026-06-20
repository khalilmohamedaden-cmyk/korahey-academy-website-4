import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const MESSAGES = [
  { role: 'user', text: 'Summarize chapter 7 for my exam tomorrow', delay: 20 },
  { role: 'ai', text: 'Chapter 7 covers photosynthesis — the light reactions split water and produce ATP, while the Calvin cycle fixes CO₂ into glucose.', delay: 45 },
  { role: 'user', text: 'Give me 3 quick practice questions', delay: 85 },
  { role: 'ai', text: '1. What molecule carries energy from light reactions?\n2. Where does the Calvin cycle occur?\n3. What is the final product of photosynthesis?', delay: 105 },
];

const ChatBubble: React.FC<{ msg: typeof MESSAGES[0]; frame: number }> = ({ msg, frame }) => {
  const { fps } = useVideoConfig();
  const isAI = msg.role === 'ai';

  const s = spring({ frame: frame - msg.delay, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 40 });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [20, 0]);

  if (frame < msg.delay) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: 10,
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      {isAI && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', marginRight: 8, flexShrink: 0, marginTop: 4,
          background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>F</div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isAI ? '#fff' : '#3D5AFE',
        color: isAI ? '#222' : '#fff',
        borderRadius: isAI ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
        padding: '10px 14px',
        fontSize: 14,
        lineHeight: 1.5,
        fontWeight: 450,
        boxShadow: isAI ? '0 2px 12px rgba(0,0,0,0.08)' : '0 4px 16px rgba(61,90,254,0.3)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
      </div>
    </div>
  );
};

const ChatCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const cardS = spring({ frame, fps, config: { damping: 14, stiffness: 70 }, durationInFrames: 50 });

  const tilt = interpolate(Math.sin(frame * 0.035), [-1, 1], [-1, 1]);

  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
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
        width: 460, background: '#F4F6FF',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>F</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Flux AI</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Your personal study assistant</div>
          </div>
          <div style={{
            marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
            background: '#4DFFA0', boxShadow: '0 0 6px #4DFFA0',
          }} />
        </div>

        {/* Messages */}
        <div style={{ padding: '16px 16px 8px', minHeight: 260 }}>
          {MESSAGES.map((msg, i) => (
            <ChatBubble key={i} msg={msg} frame={frame} />
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '10px 16px 16px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: '#fff', borderRadius: 12,
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <span style={{ flex: 1, fontSize: 13, color: 'rgba(0,0,0,0.35)' }}>Ask Flux anything...</span>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 0, height: 0, borderLeft: '8px solid #fff', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
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
          Meet{' '}
          <span style={{ color: '#5B8CFF' }}>Flux Chat.</span>
        </div>
        <div style={{ fontSize: 20, color: 'rgba(0,0,0,0.45)', marginTop: 12, fontWeight: 400 }}>
          Your AI tutor, available 24/7
        </div>
      </div>

      <ChatCard frame={frame} />
    </AbsoluteFill>
  );
};
