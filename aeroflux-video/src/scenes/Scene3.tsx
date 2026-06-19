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

const STUDY_LINES = [
  'Quantum mechanics describes the behavior of particles at',
  'the smallest scales. Wave-particle duality shows that',
  'particles exhibit properties of both waves and particles.',
  '',
  'Key principle: superposition — a particle exists in',
  'multiple states simultaneously until observed.',
];

// Radial progress SVG constants
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const WAVEFORM_COUNT = 6;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Panel rise (0–30f) ---
  const panelOpacity = interpolate(frame, [0, 30], [0, 1], ease);
  const panelY = interpolate(frame, [0, 30], [55, 0], ease);

  // --- Study notes text (30–200f) ---
  const notesOpacity = interpolate(frame, [30, 55], [0, 1], ease);
  // Highlighter stroke animates across line 5 (30f after notes appear)
  const highlightScaleX = interpolate(frame, [120, 165], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Music player (200–400f) ---
  const musicOpacity = interpolate(frame, [200, 225], [0, 1], ease);
  const musicY = interpolate(frame, [200, 225], [20, 0], ease);
  // Progress bar: moves from 0→0.45 over the scene duration
  const musicProgress = interpolate(frame, [200, 800], [0, 0.45], {
    easing: Easing.linear,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Recording panel (350–600f) ---
  const recOpacity = interpolate(frame, [350, 378], [0, 1], ease);
  const recY = interpolate(frame, [350, 378], [20, 0], ease);
  // REC dot pulse
  const recDotPulse = 0.5 + Math.sin(frame * 0.18) * 0.5;
  // Transcript
  const TRANSCRIPT = '...quantum entanglement occurs when particles share quantum states regardless of distance...';

  // --- Stats card (550–800f) ---
  const statsOpacity = interpolate(frame, [550, 578], [0, 1], ease);
  const statsY = interpolate(frame, [550, 578], [20, 0], ease);
  // Radial progress draws from 0→0.94 (94%)
  const radialProgress = interpolate(frame, [580, 700], [0, 0.94], ease);
  const strokeDashoffset = CIRCUMFERENCE * (1 - radialProgress);

  // --- Pull-back: all three panels orbiting (700–850f) ---
  const pullbackScale = interpolate(frame, [700, 780], [1, 0.72], easeOut);
  const ghostOpacity = interpolate(frame, [730, 790], [0, 0.45], ease);

  // --- Panels collapse inward (820–880f) ---
  const collapseScale = interpolate(frame, [820, 880], [1, 0], easeIn);
  const collapseOpacity = interpolate(frame, [820, 870], [1, 0], easeIn);

  // --- Final wordmark (860–900f) ---
  const finalOpacity = interpolate(frame, [860, 885], [0, 1], ease);
  const finalScale = interpolate(frame, [860, 885], [0.94, 1], ease);
  const taglineOpacity = interpolate(frame, [875, 895], [0, 1], ease);

  // --- Fade to black (875–900f) ---
  const fadeOut = interpolate(frame, [875, 900], [0, 1], easeIn);

  // Combined scale for the main panel area
  const mainScale = pullbackScale * (frame > 820 ? collapseScale : 1);
  const mainOpacity = frame > 820 ? collapseOpacity : 1;

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(15,8,50,0.65) 0%, transparent 75%)',
        }}
      />

      <Particles count={18} startFrame={0} color="#00f5ff" />
      <Particles count={7} startFrame={6} color="#9b59b6" />

      {/* Main panel group */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: panelOpacity * mainOpacity,
          transform: `translateY(${panelY}px) scale(${mainScale})`,
        }}
      >
        {/* Ghost panels (shown during pull-back, 700–850f) */}
        {/* Ghost left — Flux Chat */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -820,
            marginTop: -300,
            opacity: ghostOpacity,
          }}
        >
          <GlassPanel
            width={260}
            height={180}
            glowColor="rgba(0,245,255,0.15)"
            glowIntensity={0.5}
            borderOpacity={0.08}
          >
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily, fontSize: 9, fontWeight: 300, color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                Flux Chat
              </div>
              {[85, 60, 75, 50].map((w, i) => (
                <div key={i} style={{ height: 2, width: `${w}%`, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 8 }} />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Ghost right — Flux Code */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: 560,
            marginTop: -300,
            opacity: ghostOpacity,
          }}
        >
          <GlassPanel
            width={260}
            height={180}
            glowColor="rgba(155,89,182,0.15)"
            glowIntensity={0.5}
            borderOpacity={0.08}
          >
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily, fontSize: 9, fontWeight: 300, color: 'rgba(155,89,182,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                Flux Code
              </div>
              {[70, 90, 55, 80].map((w, i) => (
                <div key={i} style={{ height: 2, width: `${w}%`, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 8 }} />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Main Flux Study panel (900×600) */}
        <GlassPanel
          width={900}
          height={600}
          glowColor="rgba(0,245,255,0.18)"
          glowIntensity={0.85}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            {/* ---- LEFT COLUMN: Study notes (60%) ---- */}
            <div
              style={{
                flex: '0 0 60%',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontFamily,
                  fontSize: 11,
                  fontWeight: 300,
                  color: 'rgba(0,245,255,0.55)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 18,
                  opacity: notesOpacity,
                }}
              >
                Quantum Mechanics — Chapter 4
              </div>

              {/* Study lines */}
              <div
                style={{
                  opacity: notesOpacity,
                  position: 'relative',
                }}
              >
                {STUDY_LINES.map((line, i) => {
                  const lineOpacity = interpolate(frame, [40 + i * 18, 60 + i * 18], [0, 1], ease);
                  // Highlighter behind line index 4 ("Key principle...")
                  const isHighlighted = i === 4;
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: 6 }}>
                      {isHighlighted && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 2,
                            left: -4,
                            right: -4,
                            height: '100%',
                            background:
                              'linear-gradient(90deg, rgba(0,245,255,0.22), rgba(155,89,182,0.15))',
                            borderRadius: 3,
                            transformOrigin: 'left center',
                            transform: `scaleX(${highlightScaleX})`,
                          }}
                        />
                      )}
                      <div
                        style={{
                          opacity: lineOpacity,
                          fontFamily,
                          fontSize: 13,
                          fontWeight: 300,
                          lineHeight: 1.65,
                          color: isHighlighted
                            ? 'rgba(220,240,255,0.95)'
                            : 'rgba(185,195,220,0.8)',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {line || ' '}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Margin annotation */}
              <div
                style={{
                  marginTop: 20,
                  opacity: interpolate(frame, [180, 200], [0, 1], ease),
                  borderLeft: '2px solid rgba(0,245,255,0.35)',
                  paddingLeft: 12,
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: 11,
                    fontWeight: 300,
                    color: 'rgba(0,245,255,0.6)',
                    fontStyle: 'italic',
                  }}
                >
                  ↳ See also: Bell's theorem, EPR paradox
                </div>
              </div>
            </div>

            {/* ---- RIGHT COLUMN: Three mini-panels (40%) ---- */}
            <div
              style={{
                flex: '0 0 40%',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* 1. Spotify-style music player */}
              <div
                style={{
                  opacity: musicOpacity,
                  transform: `translateY(${musicY}px)`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {/* Album art placeholder */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background:
                        'linear-gradient(135deg, rgba(0,245,255,0.4), rgba(155,89,182,0.5))',
                      boxShadow: '0 0 16px rgba(0,245,255,0.25)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 12,
                        fontWeight: 400,
                        color: 'rgba(220,230,255,0.9)',
                        marginBottom: 3,
                      }}
                    >
                      Lo-fi Beats for Focus
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 10,
                        fontWeight: 300,
                        color: 'rgba(160,170,200,0.65)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Study Vibes
                    </div>
                  </div>
                </div>

                {/* Waveform bars */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 3,
                    height: 30,
                    marginBottom: 10,
                  }}
                >
                  {Array.from({ length: WAVEFORM_COUNT }).map((_, i) => {
                    const speed = 0.12 + i * 0.03;
                    const barH = 8 + Math.abs(Math.sin(frame * speed + i * 1.1)) * 20;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: barH,
                          borderRadius: 2,
                          background: `rgba(0,245,255,${0.4 + Math.abs(Math.sin(frame * speed + i)) * 0.5})`,
                          boxShadow: `0 0 4px rgba(0,245,255,0.3)`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    position: 'relative',
                    height: 3,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${musicProgress * 100}%`,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #00f5ff, #9b59b6)',
                      boxShadow: '0 0 8px rgba(0,245,255,0.5)',
                    }}
                  />
                  {/* Moving dot */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -3,
                      left: `${musicProgress * 100}%`,
                      marginLeft: -4,
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#00f5ff',
                      boxShadow: '0 0 8px rgba(0,245,255,0.9)',
                    }}
                  />
                </div>
              </div>

              {/* 2. Recording / STT panel */}
              <div
                style={{
                  opacity: recOpacity,
                  transform: `translateY(${recY}px)`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  flex: 1,
                }}
              >
                {/* REC button row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#ff3b30',
                      boxShadow: `0 0 ${6 + recDotPulse * 10}px rgba(255,59,48,0.9)`,
                      opacity: 0.6 + recDotPulse * 0.4,
                    }}
                  />
                  <span
                    style={{
                      fontFamily,
                      fontSize: 10,
                      fontWeight: 300,
                      color: 'rgba(255,59,48,0.8)',
                      letterSpacing: '0.2em',
                    }}
                  >
                    REC
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontFamily,
                      fontSize: 10,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    LIVE TRANSCRIPT
                  </span>
                </div>

                {/* Audio waveform bars */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    height: 24,
                    marginBottom: 10,
                  }}
                >
                  {Array.from({ length: 18 }).map((_, i) => {
                    const h = 4 + Math.abs(Math.sin(frame * 0.15 + i * 0.55)) * 18;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: h,
                          borderRadius: 1,
                          background: `rgba(255,59,48,${0.35 + Math.abs(Math.sin(frame * 0.1 + i * 0.4)) * 0.55})`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Streaming transcript */}
                <div
                  style={{
                    fontFamily,
                    fontSize: 11,
                    fontWeight: 300,
                    color: 'rgba(185,195,220,0.75)',
                    lineHeight: 1.6,
                  }}
                >
                  <TypewriterText
                    text={TRANSCRIPT}
                    startFrame={370}
                    charsPerFrame={0.9}
                    showCursor
                    style={{ fontFamily, fontSize: 11, fontWeight: 300, color: 'rgba(185,195,220,0.75)', lineHeight: 1.6 }}
                  />
                </div>
              </div>

              {/* 3. Stats card */}
              <div
                style={{
                  opacity: statsOpacity,
                  transform: `translateY(${statsY}px)`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Radial progress SVG */}
                  <svg width={70} height={70} style={{ flexShrink: 0 }}>
                    {/* Track */}
                    <circle
                      cx={35}
                      cy={35}
                      r={RADIUS}
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth={4}
                    />
                    {/* Progress arc */}
                    <circle
                      cx={35}
                      cy={35}
                      r={RADIUS}
                      fill="none"
                      stroke="url(#radGrad)"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 35 35)"
                    />
                    <defs>
                      <linearGradient id="radGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f5ff" />
                        <stop offset="100%" stopColor="#9b59b6" />
                      </linearGradient>
                    </defs>
                    <text
                      x={35}
                      y={35}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="rgba(220,230,255,0.9)"
                      fontSize={13}
                      fontFamily={fontFamily}
                      fontWeight={400}
                    >
                      {Math.round(radialProgress * 100)}%
                    </text>
                  </svg>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 11,
                        fontWeight: 300,
                        color: 'rgba(0,245,255,0.7)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                      }}
                    >
                      Focus Score
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 12,
                        fontWeight: 300,
                        color: 'rgba(185,195,220,0.75)',
                        marginBottom: 4,
                      }}
                    >
                      Study streak: <span style={{ color: 'rgba(0,245,255,0.8)' }}>7 days</span>
                    </div>
                    <div
                      style={{
                        height: 2,
                        width: '100%',
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${radialProgress * 100}%`,
                          background: 'linear-gradient(90deg, #00f5ff, #9b59b6)',
                          borderRadius: 1,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </AbsoluteFill>

      {/* Final wordmark (860–900f) */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: finalOpacity,
          transform: `scale(${finalScale})`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 96,
            fontWeight: 400,
            letterSpacing: '0.24em',
            color: '#ffffff',
            textShadow:
              '0 0 90px rgba(0,245,255,0.55), 0 0 180px rgba(155,89,182,0.35)',
            marginBottom: 20,
          }}
        >
          AEROFLUX
        </div>
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily,
            fontSize: 17,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
          }}
        >
          One mind.&nbsp;&nbsp;&nbsp;Three disciplines.
        </div>
      </AbsoluteFill>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          background: '#000000',
          opacity: fadeOut,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
