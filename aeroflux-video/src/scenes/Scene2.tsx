import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';
import { FluxLogo } from '../components/FluxLogo';

const MESSAGES = [
  { role: 'user', text: 'Summarize chapter 7 for my exam tomorrow', delay: 18 },
  { role: 'ai', text: 'Chapter 7 covers photosynthesis — the light reactions split water and produce ATP, while the Calvin cycle fixes CO₂ into glucose. Key terms: chlorophyll, thylakoid, stroma.', delay: 40 },
  { role: 'user', text: 'Give me 3 quick practice questions', delay: 85 },
  { role: 'ai', text: '1. What molecule carries energy from light reactions?\n2. Where does the Calvin cycle occur?\n3. What is the final product of photosynthesis?', delay: 106 },
];

const ChatBubble: React.FC<{ msg: typeof MESSAGES[0]; frame: number }> = ({ msg, frame }) => {
  const { fps } = useVideoConfig();
  const isAI = msg.role === 'ai';
  const s = spring({ frame: frame - msg.delay, fps, config: { damping: 18, stiffness: 100 }, durationInFrames: 35 });
  if (frame < msg.delay) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: 10, opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
    }}>
      {isAI && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', marginRight: 8, flexShrink: 0, marginTop: 2,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FluxLogo size={16} />
        </div>
      )}
      <div style={{
        maxWidth: '74%',
        background: isAI
          ? 'rgba(255,255,255,0.07)'
          : 'linear-gradient(135deg, rgba(91,140,255,0.85), rgba(176,110,255,0.85))',
        color: 'rgba(255,255,255,0.88)',
        borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        padding: '10px 14px',
        fontSize: 13, lineHeight: 1.55, fontWeight: 400,
        border: isAI ? '1px solid rgba(255,255,255,0.10)' : 'none',
        backdropFilter: isAI ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isAI ? 'blur(12px)' : 'none',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CAMERA: drift left, subtle tilt on perspective — like orbiting the UI card
  const camX = interpolate(frame, [0, 180], [-30, 30], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const camY = interpolate(frame, [0, 180], [10, -10], { extrapolateRight: 'clamp' });
  const camScale = interpolate(frame, [0, 60, 180], [0.92, 1.0, 1.0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const camRot = interpolate(frame, [0, 180], [1.5, -1.5], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [158, 178], [1, 0], { extrapolateRight: 'clamp' });

  // Card spring entrance
  const cardS = spring({ frame: frame - 5, fps, config: { damping: 16, stiffness: 80 }, durationInFrames: 45 });
  // Floating tilt on card
  const tilt = interpolate(Math.sin(frame * 0.04), [-1, 1], [-1.2, 1.2]);
  const floatY = interpolate(Math.sin(frame * 0.06), [-1, 1], [-6, 6]);

  // Headline
  const titleS = spring({ frame: frame - 2, fps, config: { damping: 20, stiffness: 110 }, durationInFrames: 30 });

  // Ambient orbs
  const orbX = interpolate(Math.sin(frame * 0.028), [-1, 1], [-60, 60]);

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {/* CAMERA RIG */}
      <AbsoluteFill style={{
        transform: `scale(${camScale}) translate(${camX}px, ${camY}px) rotate(${camRot * 0.1}deg)`,
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,140,255,0.14) 0%, transparent 60%)',
          left: `calc(50% - 350px + ${orbX}px)`, top: '5%',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,110,255,0.10) 0%, transparent 60%)',
          right: `calc(15% - ${orbX * 0.5}px)`, bottom: '5%',
          filter: 'blur(60px)',
        }} />

        {/* Left — headline */}
        <div style={{
          position: 'absolute', left: 120, top: '50%',
          transform: `translateY(-50%) translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
          opacity: titleS, width: 420,
        }}>
          <div style={{
            fontSize: 13, letterSpacing: 4, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 16,
          }}>
            Flux Chat
          </div>
          <div style={{
            fontSize: 62, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05, color: '#fff',
          }}>
            Your AI tutor.{'\n'}
            <span style={{
              background: 'linear-gradient(120deg, #5B8CFF, #B06EFF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Any subject.
            </span>
          </div>
          <div style={{
            fontSize: 18, color: 'rgba(255,255,255,0.38)', marginTop: 18, lineHeight: 1.5,
            opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            24/7. Instant. Personalized.
          </div>
        </div>

        {/* Right — Flux Chat glass card */}
        <div style={{
          position: 'absolute', right: 100, top: '50%',
          transform: `
            translateY(calc(-50% + ${floatY}px))
            rotate(${tilt}deg)
            scale(${interpolate(cardS, [0, 1], [0.85, 1])})
            perspective(1400px) rotateY(${interpolate(cardS, [0, 1], [-12, 0])}deg)
          `,
          opacity: cardS,
        }}>
          {/* Glow under card */}
          <div style={{
            position: 'absolute', bottom: -40, left: '15%', width: '70%', height: 40,
            background: 'radial-gradient(ellipse, rgba(91,140,255,0.25) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }} />

          {/* Glass card */}
          <div style={{
            width: 420,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(48px)',
            WebkitBackdropFilter: 'blur(48px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.10)',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FluxLogo size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Flux Chat</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>AI Study Assistant</div>
              </div>
              <div style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4DFFA0', boxShadow: '0 0 8px #4DFFA0' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '14px 14px 6px', minHeight: 260 }}>
              {MESSAGES.map((msg, i) => (
                <ChatBubble key={i} msg={msg} frame={frame} />
              ))}
            </div>

            {/* Input bar */}
            <div style={{ padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.22)' }}>Ask Flux anything...</span>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5B8CFF, #B06EFF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 0, height: 0, borderLeft: '7px solid #fff', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', marginLeft: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
