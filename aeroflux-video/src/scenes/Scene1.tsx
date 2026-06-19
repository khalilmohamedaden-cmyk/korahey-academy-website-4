import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';
import { TypewriterText } from '../components/TypewriterText';

const { fontFamily } = loadFont('normal', { weights: ['300', '400'], subsets: ['latin'] });

const ease = {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const easeOut = {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const easeIn = {
  easing: Easing.in(Easing.cubic),
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const MSGS = [
  { role: 'user', text: 'What\'s the key idea behind transformer attention?' },
  { role: 'ai', text: 'Attention lets each token weigh every other token\'s relevance — no fixed window, full context in one pass.' },
  { role: 'user', text: 'Give me a 3-line summary for my notes.' },
  { role: 'ai', text: '1. Tokens attend to all others via Q/K/V matrices.\n2. Multi-head attention captures multiple relationships.\n3. Scales to long contexts without recurrence.' },
  { role: 'user', text: 'Perfect. Start a flashcard set.' },
];

const WORDMARK_LETTERS = 'AEROFLUX'.split('');

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Orb birth (0–30f) ---
  const orbScale = interpolate(frame, [0, 30], [0, 1], ease);
  const orbPulse = 1 + Math.sin(frame * 0.1) * 0.03;
  // Orb fractures/dissolves (30–60f)
  const orbOpacity = interpolate(frame, [30, 60], [1, 0], easeIn);
  const orbGlow = interpolate(frame, [0, 25], [0, 1], easeOut);

  // --- Panel entrance (30–60f) ---
  const panelOpacity = interpolate(frame, [30, 60], [0, 1], ease);
  const panelY = interpolate(frame, [30, 60], [60, 0], ease);
  const panelScale = interpolate(frame, [30, 60], [0.94, 1], ease);

  // Subtle camera push (200–580f)
  const camScale = interpolate(frame, [200, 580], [1.0, 1.04], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Online dot pulse
  const dotPulse = 0.5 + Math.sin(frame * 0.14) * 0.5;

  // Input bar glow pulse
  const pillGlow = 0.12 + Math.sin(frame * 0.07) * 0.08;

  // --- Wordmark assembly (500–580f) ---
  const subtitleOpacity = interpolate(frame, [545, 570], [0, 1], ease);

  // --- Fade out (580–600f) ---
  const sceneOut = interpolate(frame, [580, 600], [0, 1], easeIn);

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      {/* Deep nebula background */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 50% 52%, rgba(26,10,74,0.6) 0%, rgba(0,0,8,0) 72%)',
        }}
      />

      <Particles count={20} startFrame={0} color="#00f5ff" />
      <Particles count={8} startFrame={12} color="#9b59b6" />

      {/* Orb ignition (0–60f) */}
      <AbsoluteFill>
        {/* Point of light → orb */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 36% 30%, rgba(0,245,255,0.95) 0%, rgba(155,89,182,0.85) 42%, rgba(20,8,60,1) 100%)',
            boxShadow: `
              0 0 ${70 * orbGlow}px rgba(0,245,255,0.95),
              0 0 ${140 * orbGlow}px rgba(0,245,255,0.55),
              0 0 ${220 * orbGlow}px rgba(155,89,182,0.4),
              inset 0 0 45px rgba(255,255,255,0.1)
            `,
            transform: `scale(${orbScale * orbPulse})`,
            opacity: orbOpacity,
          }}
        />
        {/* Refraction ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 172,
            height: 172,
            marginLeft: -86,
            marginTop: -86,
            borderRadius: '50%',
            border: '1px solid rgba(0,245,255,0.18)',
            transform: `scale(${orbScale})`,
            opacity: orbOpacity * 0.65,
          }}
        />
      </AbsoluteFill>

      {/* Chat panel wrapper with camera push */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${camScale})`,
        }}
      >
        {/* Panel entrance animation */}
        <div
          style={{
            opacity: panelOpacity,
            transform: `translateY(${panelY}px) scale(${panelScale})`,
          }}
        >
          <GlassPanel
            width={760}
            height={520}
            glowColor="rgba(0,245,255,0.22)"
            glowIntensity={0.95}
          >
            {/* macOS title bar */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: c,
                    opacity: 0.85,
                  }}
                />
              ))}
              <span
                style={{
                  marginLeft: 16,
                  fontFamily,
                  fontSize: 11,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.32)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Flux Chat — Local
              </span>
              {/* Pulsing online dot */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#28c840',
                    boxShadow: `0 0 ${6 + dotPulse * 8}px rgba(40,200,64,0.9)`,
                    opacity: 0.7 + dotPulse * 0.3,
                  }}
                />
                <span
                  style={{
                    fontFamily,
                    fontSize: 10,
                    fontWeight: 300,
                    color: 'rgba(40,200,64,0.65)',
                    letterSpacing: '0.12em',
                  }}
                >
                  ONLINE
                </span>
              </div>
            </div>

            {/* Message stream */}
            <div
              style={{
                flex: 1,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                overflow: 'hidden',
                height: 390,
              }}
            >
              {MSGS.map((msg, i) => {
                const startF = 60 + i * 70;
                const msgOpacity = interpolate(frame, [startF, startF + 22], [0, 1], ease);
                const msgY = interpolate(frame, [startF, startF + 22], [14, 0], ease);
                const isUser = msg.role === 'user';

                return (
                  <div
                    key={i}
                    style={{
                      opacity: msgOpacity,
                      transform: `translateY(${msgY}px)`,
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '78%',
                        padding: '11px 16px',
                        borderRadius: isUser ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
                        background: isUser
                          ? 'linear-gradient(135deg, rgba(0,180,220,0.2), rgba(120,60,180,0.2))'
                          : 'rgba(255,255,255,0.045)',
                        border: `1px solid ${
                          isUser ? 'rgba(0,245,255,0.28)' : 'rgba(255,255,255,0.08)'
                        }`,
                        boxShadow: isUser
                          ? '0 2px 18px rgba(0,245,255,0.12)'
                          : 'none',
                      }}
                    >
                      <TypewriterText
                        text={msg.text}
                        startFrame={startF + 12}
                        charsPerFrame={1.3}
                        showCursor
                        style={{
                          fontFamily,
                          fontSize: 13,
                          fontWeight: 300,
                          lineHeight: 1.6,
                          color: isUser
                            ? 'rgba(160,235,255,0.95)'
                            : 'rgba(215,220,240,0.92)',
                          whiteSpace: 'pre-wrap',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing pill input */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(0,245,255,${pillGlow + 0.12})`,
                  borderRadius: 999,
                  padding: '11px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: `0 0 ${24 + pillGlow * 50}px rgba(0,245,255,0.14)`,
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.22)',
                    flex: 1,
                  }}
                >
                  Ask anything…
                </span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f5ff, #9b59b6)',
                    boxShadow: '0 0 16px rgba(0,245,255,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: '9px solid rgba(0,0,20,0.9)',
                      marginLeft: 2,
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </AbsoluteFill>

      {/* AEROFLUX wordmark assembly (500–580f) */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {WORDMARK_LETTERS.map((letter, i) => {
            const ls = 500 + i * 9;
            const lo = interpolate(frame, [ls, ls + 20], [0, 1], ease);
            const ly = interpolate(frame, [ls, ls + 20], [-18, 0], ease);
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 52,
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  color: '#ffffff',
                  opacity: lo,
                  transform: `translateY(${ly}px)`,
                  display: 'inline-block',
                  textShadow: '0 0 50px rgba(0,245,255,0.65)',
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            fontFamily,
            fontSize: 12,
            fontWeight: 300,
            color: '#00f5ff',
            letterSpacing: '0.38em',
            marginTop: 8,
            textTransform: 'uppercase',
          }}
        >
          Flux Chat — local AI, zero latency
        </div>
      </div>

      {/* Fade out overlay */}
      <AbsoluteFill
        style={{
          background: '#000008',
          opacity: sceneOut,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
