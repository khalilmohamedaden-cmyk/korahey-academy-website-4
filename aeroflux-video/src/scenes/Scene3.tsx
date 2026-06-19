import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Particles } from '../components/Particles';
import { GlassPanel } from '../components/GlassPanel';

const { fontFamily } = loadFont('normal', { weights: ['300', '400'], subsets: ['latin'] });

const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const easeOut = { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const easeIn = { easing: Easing.in(Easing.cubic), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const CARDS = [
  { dx: -260, dy: -80, rotate: -8, label: 'Lecture Notes', highlight: true },
  { dx: 0, dy: -110, rotate: 4, label: 'Key Concepts', highlight: false },
  { dx: 260, dy: -70, rotate: 10, label: 'Practice Questions', highlight: false },
  { dx: -130, dy: 90, rotate: -5, label: 'Exam Summary', highlight: false },
  { dx: 130, dy: 100, rotate: 7, label: 'Mind Map', highlight: false },
];

const CURVE_POINTS = '100,200 150,180 200,155 260,130 320,90 400,60 480,40 560,30 640,20';

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Cards drift in
  const cardIn = interpolate(frame, [0, 40], [0, 1], ease);
  // Cards collapse inward at end
  const collapseStart = 185;
  const cardCollapse = interpolate(frame, [collapseStart, collapseStart + 35], [1, 0], easeIn);

  // Analytics curve draw-on
  const curveProgress = interpolate(frame, [60, 140], [0, 1], ease);
  const curveOpacity = interpolate(frame, [55, 80], [0, 1], easeOut);

  // Full scene pull-back
  const sceneScale = interpolate(frame, [140, 200], [1, 0.88], easeOut);

  // Orb re-appears
  const orbOpacity = interpolate(frame, [210, 240], [0, 1], ease);
  const orbPulse = interpolate(frame, [245, 265], [1, 1.4], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orbFade = interpolate(frame, [265, 280], [1, 0.3], easeOut);

  // Final wordmark
  const finalOpacity = interpolate(frame, [275, 295], [0, 1], ease);
  const finalScale = interpolate(frame, [275, 295], [0.96, 1], ease);
  const taglineOpacity = interpolate(frame, [288, 300], [0, 1], ease);

  // Fade to black
  const fadeOut = interpolate(frame, [270, 300], [0, 1], easeIn);

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,8,50,0.6) 0%, transparent 70%)',
        }}
      />

      <Particles count={18} startFrame={0} color="#00f5ff" />
      <Particles count={6} startFrame={5} color="#9b59b6" />

      {/* Cards + analytics */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${sceneScale})`,
        }}
      >
        {/* Analytics SVG curve */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: '50%',
            marginTop: -100,
            opacity: curveOpacity,
          }}
        >
          <svg width={680} height={240} overflow="visible">
            <defs>
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a0a4a" />
                <stop offset="50%" stopColor="#00f5ff" />
                <stop offset="100%" stopColor="#9b59b6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background fill area */}
            <path
              d={`M 100,240 ${CURVE_POINTS} L 640,240 Z`}
              fill="url(#curveGrad)"
              opacity={curveProgress * 0.08}
            />
            {/* Grid lines */}
            {[60, 120, 180].map((y, i) => (
              <line key={i} x1={100} y1={y} x2={640} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}
            {/* Animated polyline */}
            <polyline
              points={CURVE_POINTS}
              fill="none"
              stroke="url(#curveGrad)"
              strokeWidth={2.5}
              filter="url(#glow)"
              strokeDasharray={900}
              strokeDashoffset={900 * (1 - curveProgress)}
            />
            {/* Endpoint dot */}
            <circle
              cx={560 + curveProgress * 80}
              cy={30 - curveProgress * 10}
              r={5}
              fill="#00f5ff"
              filter="url(#glow)"
              opacity={curveProgress}
            />
            {/* Y axis labels */}
            {['100%', '75%', '50%', '25%'].map((label, i) => (
              <text
                key={i}
                x={90}
                y={30 + i * 60}
                textAnchor="end"
                fill="rgba(255,255,255,0.2)"
                fontSize={10}
                fontFamily={fontFamily}
              >
                {label}
              </text>
            ))}
            <text x={370} y={230} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={10} fontFamily={fontFamily}>
              Study Retention Over Time
            </text>
          </svg>
        </div>

        {/* Frosted glass index cards */}
        {CARDS.map((card, i) => {
          const cardDelay = i * 10;
          const x = card.dx * cardIn * cardCollapse;
          const y = card.dy * cardIn * cardCollapse;
          const rot = card.rotate * cardIn * cardCollapse;
          const cardOp = cardIn * cardCollapse;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                opacity: cardOp,
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                zIndex: i === 0 ? 5 : 1,
              }}
            >
              <div
                style={{
                  width: 190,
                  height: 130,
                  background: 'rgba(12, 8, 32, 0.72)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    0 8px 32px rgba(0,0,0,0.5),
                    0 0 24px rgba(0,245,255,0.06)
                  `,
                  padding: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {card.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 38,
                      left: 12,
                      right: 12,
                      height: 18,
                      background: 'linear-gradient(90deg, rgba(0,245,255,0.25), rgba(155,89,182,0.2))',
                      borderRadius: 4,
                      opacity: interpolate(frame, [50, 80], [0, 1], ease),
                    }}
                  />
                )}
                <div style={{ fontFamily, fontSize: 10, fontWeight: 300, color: 'rgba(0,245,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {card.label}
                </div>
                {[70, 55, 40].map((w, j) => (
                  <div key={j} style={{ height: 2, width: `${w}%`, background: 'rgba(255,255,255,0.08)', borderRadius: 1, marginBottom: 6 }} />
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Re-appearing orb */}
      <AbsoluteFill>
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
            background: 'radial-gradient(circle at 38% 32%, rgba(0,245,255,0.9) 0%, rgba(155,89,182,0.8) 40%, rgba(20,8,60,1) 100%)',
            boxShadow: `
              0 0 ${80 * orbFade}px rgba(0,245,255,0.9),
              0 0 ${160 * orbFade}px rgba(0,245,255,0.5),
              0 0 ${260 * orbFade}px rgba(155,89,182,0.4)
            `,
            opacity: orbOpacity * orbFade,
            transform: `scale(${orbPulse})`,
          }}
        />
      </AbsoluteFill>

      {/* Final wordmark */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: finalOpacity,
          transform: `scale(${finalScale})`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 88,
            fontWeight: 100,
            letterSpacing: '0.22em',
            color: '#ffffff',
            textShadow: '0 0 80px rgba(0,245,255,0.5), 0 0 160px rgba(155,89,182,0.3)',
            marginBottom: 18,
          }}
        >
          AEROFLUX
        </div>
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily,
            fontSize: 16,
            fontWeight: 200,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          One mind.&nbsp;&nbsp;Three disciplines.
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
