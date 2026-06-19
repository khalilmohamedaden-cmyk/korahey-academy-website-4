import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GlassPanel } from '../components/GlassPanel';

const SHATTERED_CARDS = [
  { x: -300, y: -200, rotate: -25, tx: -600, ty: -400, tr: -45 },
  { x: 100, y: -250, rotate: 15, tx: 300, ty: -500, tr: 30 },
  { x: -400, y: 50, rotate: -10, tx: -700, ty: 200, tr: -20 },
  { x: 250, y: 100, rotate: 20, tx: 500, ty: 300, tr: 35 },
  { x: -150, y: 200, rotate: -30, tx: -400, ty: 500, tr: -55 },
  { x: 350, y: -100, rotate: 10, tx: 600, ty: -300, tr: 20 },
  { x: 50, y: 250, rotate: 35, tx: 100, ty: 600, tr: 60 },
];

const STUDY_CARDS_DATA = [
  { title: 'Quantum Mechanics', progress: 87, color: '#00f5ff' },
  { title: 'Linear Algebra', progress: 92, color: '#9b59b6' },
  { title: 'Thermodynamics', progress: 71, color: '#7ecfff' },
];

const ANALYTICS_PATH =
  'M 0 180 C 60 170, 120 150, 180 130 S 300 90, 360 70 S 480 30, 540 20 L 600 10';

interface ShatteredCardProps {
  relativeFrame: number;
  card: (typeof SHATTERED_CARDS)[0];
  index: number;
}

const ShatteredCard: React.FC<ShatteredCardProps> = ({
  relativeFrame,
  card,
  index,
}) => {
  const driftProgress = interpolate(relativeFrame, [0, 120], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tx = card.x + (card.tx - card.x) * driftProgress;
  const ty = card.y + (card.ty - card.y) * driftProgress;
  const rot = card.rotate + (card.tr - card.rotate) * driftProgress;
  const cardOpacity = interpolate(relativeFrame, [60, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isHighlighted = index === 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translateX(calc(-50% + ${tx}px)) translateY(calc(-50% + ${ty}px)) rotate(${rot}deg)`,
        opacity: cardOpacity,
      }}
    >
      <div
        style={{
          width: 220,
          height: 140,
          background: 'rgba(10,10,30,0.6)',
          border: `1px solid ${isHighlighted ? 'rgba(0,245,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(12px)',
          borderRadius: 14,
          boxShadow: isHighlighted
            ? '0 0 30px rgba(0,245,255,0.4), inset 0 0 0 1px rgba(0,245,255,0.15)'
            : '0 8px 32px rgba(0,0,0,0.4)',
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isHighlighted && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(0,245,255,0.12) 0%, transparent 50%, rgba(155,89,182,0.08) 100%)',
              borderRadius: 14,
            }}
          />
        )}
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Flux Study
        </div>
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 15,
            fontWeight: 300,
            color: '#ffffff',
          }}
        >
          Study Card {index + 1}
        </div>
      </div>
    </div>
  );
};

const StudyDashboard: React.FC<{ relativeFrame: number }> = ({
  relativeFrame,
}) => {
  const scaleProgress = interpolate(relativeFrame, [0, 150], [1, 0.7], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dashboardOpacity = interpolate(relativeFrame, [100, 140], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Analytics SVG draw-on
  const pathLength = 650;
  const dashOffset = interpolate(relativeFrame, [140, 240], [pathLength, 0], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translateX(-50%) translateY(-50%) scale(${scaleProgress})`,
        transformOrigin: 'center center',
        opacity: dashboardOpacity,
        width: 900,
      }}
    >
      <GlassPanel
        width={900}
        height={520}
        glowColor="rgba(0,245,255,0.2)"
        style={{ display: 'flex', flexDirection: 'column', padding: '28px 32px' }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Flux Study — Learning Analytics
        </div>

        {/* Study cards row */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {STUDY_CARDS_DATA.map((card, i) => {
            const cardDelay = i * 20;
            const cardOpacity = interpolate(
              relativeFrame,
              [140 + cardDelay, 160 + cardDelay],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              },
            );

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  opacity: cardOpacity,
                }}
              >
                <div
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: 12,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    height: 4,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${card.progress}%`,
                      background: `linear-gradient(90deg, ${card.color}, ${card.color}aa)`,
                      borderRadius: 2,
                      boxShadow: `0 0 8px ${card.color}`,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 22,
                    fontWeight: 100,
                    color: card.color,
                    marginTop: 8,
                    textShadow: `0 0 16px ${card.color}`,
                  }}
                >
                  {card.progress}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics curve */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Performance Trend — 30 Days
          </div>
          <svg
            width="100%"
            height={200}
            viewBox="0 0 620 200"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 50, 100, 150].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={620}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
            ))}
            {/* Gradient fill */}
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={`${ANALYTICS_PATH} L 600 200 L 0 200 Z`}
              fill="url(#analyticsGrad)"
            />
            {/* Main curve */}
            <path
              d={ANALYTICS_PATH}
              fill="none"
              stroke="#00f5ff"
              strokeWidth={2.5}
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.8))' }}
            />
          </svg>
        </div>
      </GlassPanel>
    </div>
  );
};

const CollapsingPanels: React.FC<{ relativeFrame: number }> = ({
  relativeFrame,
}) => {
  const panels = [
    { label: 'Flux Chat', color: '#00f5ff', offset: { x: -300, y: -150 } },
    { label: 'Flux Code', color: '#9b59b6', offset: { x: 300, y: -150 } },
    { label: 'Flux Study', color: '#7ecfff', offset: { x: 0, y: 200 } },
  ];

  const collapseProgress = interpolate(relativeFrame, [200, 260], [0, 1], {
    easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panelsOpacity = interpolate(relativeFrame, [240, 270], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {panels.map((panel, i) => {
        const tx = panel.offset.x * (1 - collapseProgress);
        const ty = panel.offset.y * (1 - collapseProgress);
        const scale = 1 - collapseProgress * 0.95;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translateX(calc(-50% + ${tx}px)) translateY(calc(-50% + ${ty}px)) scale(${scale})`,
              opacity: panelsOpacity * (1 - collapseProgress * 0.5),
            }}
          >
            <div
              style={{
                width: 200,
                height: 120,
                background: 'rgba(10,10,30,0.7)',
                border: `1px solid ${panel.color}44`,
                borderRadius: 16,
                boxShadow: `0 0 30px ${panel.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  fontWeight: 300,
                  color: panel.color,
                  letterSpacing: '0.1em',
                }}
              >
                {panel.label}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

const FinalOrb: React.FC<{ relativeFrame: number }> = ({ relativeFrame }) => {
  const orbOpacity = interpolate(relativeFrame, [260, 280], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orbScale = interpolate(
    Math.sin(((relativeFrame - 260) / 20) * Math.PI),
    [-1, 1],
    [0.8, 1.3],
  );
  const orbFade = interpolate(relativeFrame, [275, 290], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 35%, #00f5ff 0%, #9b59b6 50%, #1a0a4a 100%)',
        boxShadow:
          '0 0 60px rgba(0,245,255,0.9), 0 0 120px rgba(0,245,255,0.5)',
        left: '50%',
        top: '50%',
        marginLeft: -40,
        marginTop: -100,
        opacity: orbOpacity * orbFade,
        transform: `scale(${orbScale})`,
      }}
    />
  );
};

const FinalWordmark: React.FC<{ relativeFrame: number; globalOpacity: number }> = ({
  relativeFrame,
  globalOpacity,
}) => {
  const wordmarkOpacity = interpolate(relativeFrame, [280, 300], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(relativeFrame, [285, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        textAlign: 'center',
        opacity: wordmarkOpacity * globalOpacity * fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          fontSize: 96,
          fontWeight: 100,
          color: '#ffffff',
          letterSpacing: '0.2em',
          textShadow: '0 0 60px rgba(0,245,255,0.5), 0 0 120px rgba(155,89,182,0.3)',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        AEROFLUX
      </div>
      <div
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 18,
          fontWeight: 200,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
        }}
      >
        One mind. Three disciplines.
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFadeOut = interpolate(frame, [285, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#000010',
        opacity: globalFadeOut,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(26,10,74,0.3) 0%, transparent 70%)',
        }}
      />

      <AbsoluteFill>
        {/* Shattered cards from editor */}
        {SHATTERED_CARDS.map((card, i) => (
          <ShatteredCard
            key={i}
            relativeFrame={frame}
            card={card}
            index={i}
          />
        ))}

        {/* Study dashboard */}
        <StudyDashboard relativeFrame={frame} />

        {/* Collapsing panels */}
        <CollapsingPanels relativeFrame={frame} />

        {/* Final orb pulse */}
        <FinalOrb relativeFrame={frame} />

        {/* Final wordmark */}
        <FinalWordmark relativeFrame={frame} globalOpacity={globalFadeOut} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
