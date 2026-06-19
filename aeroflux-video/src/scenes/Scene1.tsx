import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';
import { TypewriterText } from '../components/TypewriterText';

const CHAT_MESSAGES = [
  'User: Summarize the lecture on quantum entanglement.',
  'Flux: Quantum entanglement describes a phenomenon where...',
  'User: Give me 3 exam questions based on this.',
  'Flux: 1. Explain Bell\'s theorem and its implications...',
];

const OrbComponent: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [60, 80], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.95, 1.05]);

  return (
    <div
      style={{
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 35%, #00f5ff 0%, #9b59b6 40%, #1a0a4a 100%)',
        boxShadow:
          '0 0 60px rgba(0,245,255,0.8), 0 0 120px rgba(0,245,255,0.4), 0 0 200px rgba(155,89,182,0.3)',
        transform: `scale(${scale * pulse})`,
        opacity,
        left: '50%',
        top: '50%',
        marginLeft: -60,
        marginTop: -60,
      }}
    />
  );
};

const ChatPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const panelOpacity = interpolate(frame, [80, 120], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const panelY = interpolate(frame, [80, 120], [40, 0], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const inputPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translateX(-50%) translateY(calc(-50% + ${panelY}px))`,
        opacity: panelOpacity,
        width: 680,
      }}
    >
      <GlassPanel
        width={680}
        height={440}
        glowColor="rgba(0,245,255,0.25)"
        style={{ display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background:
                  i === 0
                    ? '#ff5f57'
                    : i === 1
                      ? '#febc2e'
                      : '#28c840',
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
            }}
          >
            FLUX CHAT — LOCAL SESSION
          </span>
          <div
            style={{
              marginLeft: 'auto',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00f5ff',
              boxShadow: '0 0 8px #00f5ff',
              opacity: inputPulse,
            }}
          />
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflow: 'hidden',
          }}
        >
          {CHAT_MESSAGES.map((msg, i) => {
            const msgStartFrame = 120 + i * 35;
            const msgOpacity = interpolate(
              frame,
              [msgStartFrame, msgStartFrame + 15],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              },
            );
            const isUser = msg.startsWith('User:');

            return (
              <div
                key={i}
                style={{
                  opacity: msgOpacity,
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 16px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser
                      ? 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(155,89,182,0.2))'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isUser ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <TypewriterText
                    text={msg}
                    startFrame={msgStartFrame}
                    charsPerFrame={0.8}
                    style={{ fontSize: 13, color: isUser ? '#a0e8ff' : '#d0d8f0' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(0,245,255,${0.2 + inputPulse * 0.15})`,
              borderRadius: 999,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: `0 0 ${16 + inputPulse * 8}px rgba(0,245,255,0.15)`,
            }}
          >
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.3)',
                flex: 1,
              }}
            >
              Ask Flux anything…
            </span>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f5ff, #9b59b6)',
                boxShadow: '0 0 12px rgba(0,245,255,0.4)',
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
                  borderLeft: '8px solid rgba(0,0,20,0.9)',
                  marginLeft: 2,
                }}
              />
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

const WordmarkAssembly: React.FC<{ frame: number }> = ({ frame }) => {
  const letters = 'AEROFLUX'.split('');

  const subtitleOpacity = interpolate(frame, [275, 295], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 2 }}>
        {letters.map((letter, i) => {
          const letterStart = 200 + i * 10;
          const letterOpacity = interpolate(
            frame,
            [letterStart, letterStart + 20],
            [0, 1],
            {
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );
          const letterY = interpolate(
            frame,
            [letterStart, letterStart + 20],
            [-20, 0],
            {
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );

          return (
            <span
              key={i}
              style={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontSize: 52,
                fontWeight: 100,
                color: '#ffffff',
                letterSpacing: '0.15em',
                opacity: letterOpacity,
                transform: `translateY(${letterY}px)`,
                display: 'inline-block',
                textShadow: '0 0 30px rgba(0,245,255,0.5)',
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
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 14,
          fontWeight: 300,
          color: '#00f5ff',
          letterSpacing: '0.3em',
          marginTop: 8,
          textTransform: 'uppercase',
        }}
      >
        Flux Chat — local AI, zero latency
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#000010',
        opacity: sceneOpacity,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(26,10,74,0.4) 0%, transparent 70%)',
        }}
      />

      <Particles count={20} startFrame={0} />

      <AbsoluteFill>
        <OrbComponent frame={frame} />
        <ChatPanel frame={frame} />
        <WordmarkAssembly frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
