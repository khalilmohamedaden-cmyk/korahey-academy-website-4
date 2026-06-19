import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';
import { TypewriterText } from '../components/TypewriterText';

const { fontFamily } = loadFont('normal', { weights: ['300', '400'], subsets: ['latin'] });

const MSGS = [
  { role: 'user', text: 'Summarize quantum entanglement in 3 lines.' },
  { role: 'ai', text: 'Entanglement links two particles regardless of distance — measuring one instantly determines the other\'s state.' },
  { role: 'user', text: 'Give me 2 exam questions on this.' },
  { role: 'ai', text: '1. Explain Bell\'s inequality. 2. How does entanglement differ from classical correlation?' },
];

const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const easeOut = { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Orb birth
  const orbScale = interpolate(frame, [0, 25], [0, 1], { ...ease });
  const orbPulse = 1 + Math.sin(frame * 0.08) * 0.04;
  const orbOpacity = interpolate(frame, [55, 80], [1, 0], easeOut);
  const orbGlow = interpolate(frame, [0, 40], [0, 1], easeOut);

  // Panel entrance
  const panelOpacity = interpolate(frame, [80, 115], [0, 1], ease);
  const panelY = interpolate(frame, [80, 115], [50, 0], ease);
  const panelScale = interpolate(frame, [80, 115], [0.96, 1], ease);

  // Pill input pulse
  const pillGlow = 0.15 + Math.sin(frame * 0.07) * 0.1;
  const dotPulse = 0.5 + Math.sin(frame * 0.12) * 0.5;

  // Wordmark
  const letters = 'AEROFLUX'.split('');
  const subtitleOpacity = interpolate(frame, [260, 280], [0, 1], ease);

  // Viewport camera push: subtle scale from 1 to 1.03 as orb blooms
  const camScale = interpolate(frame, [0, 60], [1.06, 1], easeOut);

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      {/* Deep space background nebula */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(26,10,74,0.55) 0%, rgba(0,0,8,0) 70%)',
          transform: `scale(${camScale})`,
        }}
      />

      <Particles count={20} startFrame={0} color="#00f5ff" />
      <Particles count={8} startFrame={10} color="#9b59b6" />

      {/* Orb */}
      <AbsoluteFill style={{ transform: `scale(${camScale})` }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 130,
            height: 130,
            marginLeft: -65,
            marginTop: -65,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, rgba(0,245,255,0.9) 0%, rgba(155,89,182,0.8) 40%, rgba(20,8,60,1) 100%)',
            boxShadow: `
              0 0 ${60 * orbGlow}px rgba(0,245,255,0.9),
              0 0 ${120 * orbGlow}px rgba(0,245,255,0.5),
              0 0 ${200 * orbGlow}px rgba(155,89,182,0.35),
              inset 0 0 40px rgba(255,255,255,0.08)
            `,
            transform: `scale(${orbScale * orbPulse})`,
            opacity: orbOpacity,
          }}
        />
        {/* Orb refraction ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 160,
            height: 160,
            marginLeft: -80,
            marginTop: -80,
            borderRadius: '50%',
            border: '1px solid rgba(0,245,255,0.15)',
            transform: `scale(${orbScale})`,
            opacity: orbOpacity * 0.6,
          }}
        />
      </AbsoluteFill>

      {/* Chat Panel */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: panelOpacity,
          transform: `translateY(${panelY}px) scale(${panelScale})`,
        }}
      >
        <GlassPanel width={700} height={460} glowColor="rgba(0,245,255,0.2)" glowIntensity={0.9}>
          {/* Title bar */}
          <div
            style={{
              padding: '14px 22px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
            <span
              style={{
                marginLeft: 14,
                fontFamily,
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Flux Chat — Local Session
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#00f5ff',
                  boxShadow: '0 0 8px #00f5ff',
                  opacity: dotPulse,
                }}
              />
              <span style={{ fontFamily, fontSize: 10, color: 'rgba(0,245,255,0.6)', letterSpacing: '0.1em' }}>LIVE</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
            {MSGS.map((msg, i) => {
              const start = 115 + i * 40;
              const msgOpacity = interpolate(frame, [start, start + 20], [0, 1], ease);
              const msgY = interpolate(frame, [start, start + 20], [12, 0], ease);
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
                      padding: '10px 15px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser
                        ? 'linear-gradient(135deg, rgba(0,180,220,0.18), rgba(120,60,180,0.18))'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isUser ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: isUser ? '0 2px 16px rgba(0,245,255,0.1)' : 'none',
                    }}
                  >
                    <TypewriterText
                      text={msg.text}
                      startFrame={start + 10}
                      charsPerFrame={1.4}
                      showCursor
                      style={{
                        fontFamily,
                        fontSize: 13,
                        fontWeight: 300,
                        lineHeight: 1.55,
                        color: isUser ? 'rgba(160,230,255,0.95)' : 'rgba(210,218,240,0.9)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input pill */}
          <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(0,245,255,${pillGlow + 0.1})`,
                borderRadius: 999,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: `0 0 ${20 + pillGlow * 40}px rgba(0,245,255,0.12)`,
              }}
            >
              <span style={{ fontFamily, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.25)', flex: 1 }}>
                Ask Flux anything…
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f5ff, #9b59b6)',
                  boxShadow: '0 0 14px rgba(0,245,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(0,0,20,0.9)', marginLeft: 2 }} />
              </div>
            </div>
          </div>
        </GlassPanel>
      </AbsoluteFill>

      {/* Wordmark */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {letters.map((letter, i) => {
            const ls = 200 + i * 8;
            const lo = interpolate(frame, [ls, ls + 18], [0, 1], ease);
            const ly = interpolate(frame, [ls, ls + 18], [-16, 0], ease);
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 48,
                  fontWeight: 100,
                  letterSpacing: '0.18em',
                  color: '#fff',
                  opacity: lo,
                  transform: `translateY(${ly}px)`,
                  display: 'inline-block',
                  textShadow: '0 0 40px rgba(0,245,255,0.6)',
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
            letterSpacing: '0.35em',
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          Flux Chat — local AI, zero latency
        </div>
      </div>
    </AbsoluteFill>
  );
};
