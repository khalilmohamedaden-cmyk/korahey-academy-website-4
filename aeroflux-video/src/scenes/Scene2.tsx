import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';

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

// Code lines with syntax colors
const CODE_LINES = [
  { text: 'const task = "Build auth system with JWT";', color: 'rgba(255,220,80,0.9)' },
  { text: '', color: '' },
  { text: 'const network = new NeuralNetwork({', color: 'rgba(0,245,255,0.9)' },
  { text: '  agents: ["planner","coder","tester","reviewer"],', color: 'rgba(155,89,182,0.9)' },
  { text: '  memory: true,  // persistent context', color: 'rgba(100,200,100,0.8)' },
  { text: '  parallel: true,', color: 'rgba(200,210,230,0.8)' },
  { text: '});', color: 'rgba(0,245,255,0.9)' },
  { text: '', color: '' },
  { text: 'await network.run(task);', color: 'rgba(200,210,230,0.9)' },
  { text: '// All agents complete · 0 errors · 12 tests pass', color: 'rgba(100,200,100,0.8)' },
];

// Neural network nodes (x/y as percentages of the network container)
const NODES = [
  { x: 50, y: 12, label: 'Planner' },
  { x: 18, y: 38, label: 'Researcher' },
  { x: 82, y: 38, label: 'Coder' },
  { x: 22, y: 72, label: 'Tester' },
  { x: 78, y: 72, label: 'Reviewer' },
  { x: 50, y: 90, label: 'Memory' },
];

// Edges between nodes [from, to]
const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4],
];

const WORDMARK_LETTERS = 'AEROFLUX'.split('');

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Panel entrance (0–25f)
  const panelOpacity = interpolate(frame, [0, 25], [0, 1], ease);
  const panelY = interpolate(frame, [0, 25], [45, 0], ease);

  // Slow orbital rotation (150–400f)
  const orbitAngle = interpolate(frame, [150, 400], [-2, 2], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle text (480–580f)
  const subtitleOpacity = interpolate(frame, [480, 510], [0, 1], ease);

  // Wordmark letters stagger
  const wordmarkStart = 480;

  // Fade out (580–600f)
  const sceneOut = interpolate(frame, [580, 600], [0, 1], easeIn);

  // Neural network container: 340x340
  const netW = 340;
  const netH = 340;

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      {/* Background nebula */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(10,6,50,0.65) 0%, transparent 72%)',
        }}
      />

      <Particles count={16} startFrame={0} color="#00f5ff" />
      <Particles count={6} startFrame={8} color="#9b59b6" />

      {/* Main layout: code panel + neural network */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: panelOpacity,
          transform: `translateY(${panelY}px) rotate(${orbitAngle * 0.35}deg)`,
        }}
      >
        {/* Neural network (behind, to the left) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -560,
            marginTop: -netH / 2,
            width: netW,
            height: netH,
            transform: `rotate(${-orbitAngle * 0.35}deg)`,
          }}
        >
          <svg
            width={netW}
            height={netH}
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            {/* Edges */}
            {EDGES.map(([a, b], i) => {
              const n1 = NODES[a];
              const n2 = NODES[b];
              const x1 = (n1.x / 100) * netW;
              const y1 = (n1.y / 100) * netH;
              const x2 = (n2.x / 100) * netW;
              const y2 = (n2.y / 100) * netH;

              const edgeProgress = interpolate(frame, [25 + i * 10, 55 + i * 10], [0, 1], easeOut);
              const pulse = 0.35 + Math.sin(frame * 0.05 + i * 0.8) * 0.25;

              // Traveling particle on this edge
              const t = (frame * 0.008 + i * 0.2) % 1;
              const px = x1 + (x2 - x1) * t;
              const py = y1 + (y2 - y1) * t;

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x1 + (x2 - x1) * edgeProgress}
                    y2={y1 + (y2 - y1) * edgeProgress}
                    stroke={`rgba(0,245,255,${pulse * 0.7})`}
                    strokeWidth={1.2}
                  />
                  {/* Traveling light particle */}
                  {edgeProgress > 0.9 && (
                    <circle
                      cx={px}
                      cy={py}
                      r={2.5}
                      fill={`rgba(0,245,255,${0.6 + Math.sin(frame * 0.1 + i) * 0.4})`}
                    />
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node, i) => {
              const cx = (node.x / 100) * netW;
              const cy = (node.y / 100) * netH;
              const nodeOpacity = interpolate(frame, [15 + i * 10, 40 + i * 10], [0, 1], ease);
              // Each node breathes individually
              const breathe = 0.7 + Math.sin(frame * 0.07 + i * 1.2) * 0.3;
              // Active nodes glow brighter
              const isActive = i % 2 === Math.floor(frame / 45) % 2;
              const glowR = isActive ? 22 : 16;
              const glowOpacity = isActive ? breathe * 0.9 : breathe * 0.5;

              return (
                <g key={i} opacity={nodeOpacity}>
                  {/* Outer glow ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={glowR}
                    fill={`rgba(0,245,255,${isActive ? 0.1 : 0.04})`}
                    stroke={`rgba(0,245,255,${glowOpacity * 0.45})`}
                    strokeWidth={1}
                  />
                  {/* Core node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={7}
                    fill={isActive ? `rgba(0,245,255,${glowOpacity})` : `rgba(155,89,182,${breathe * 0.7})`}
                  />
                  {/* Outer pulse ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={glowR + 5}
                    fill="none"
                    stroke={`rgba(0,245,255,${breathe * 0.12})`}
                    strokeWidth={1}
                  />
                </g>
              );
            })}
          </svg>

          {/* Node labels */}
          {NODES.map((node, i) => {
            const nodeOpacity = interpolate(frame, [35 + i * 10, 58 + i * 10], [0, 1], ease);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, 18px)',
                  opacity: nodeOpacity,
                  fontFamily,
                  fontSize: 9,
                  fontWeight: 300,
                  color: 'rgba(0,245,255,0.7)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.label}
              </div>
            );
          })}
        </div>

        {/* Code editor panel */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -360,
            marginTop: -240,
            transform: `rotate(${-orbitAngle * 0.35}deg)`,
          }}
        >
          <GlassPanel
            width={720}
            height={480}
            glowColor="rgba(155,89,182,0.22)"
            glowIntensity={0.9}
          >
            {/* Editor title bar */}
            <div
              style={{
                padding: '14px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: c,
                    opacity: 0.82,
                  }}
                />
              ))}
              <span
                style={{
                  marginLeft: 14,
                  fontFamily,
                  fontSize: 11,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.28)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                multi-agent.ts — Flux Code
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    style={{
                      width: 30,
                      height: 3,
                      borderRadius: 2,
                      background: `rgba(155,89,182,${0.28 + j * 0.16})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Code lines */}
            <div
              style={{
                padding: '20px 26px',
                fontFamily: '"SF Mono", "Fira Code", "Fira Mono", monospace',
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              {CODE_LINES.map((line, i) => {
                const lineStart = 30 + i * 16;
                const lineOpacity = interpolate(frame, [lineStart, lineStart + 14], [0, 1], ease);
                const lineX = interpolate(frame, [lineStart, lineStart + 14], [-10, 0], ease);
                return (
                  <div
                    key={i}
                    style={{
                      opacity: lineOpacity,
                      transform: `translateX(${lineX}px)`,
                      display: 'flex',
                      alignItems: 'center',
                      height: 24,
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.12)',
                        width: 30,
                        textAlign: 'right',
                        marginRight: 18,
                        fontSize: 11,
                        userSelect: 'none',
                        fontFamily: '"SF Mono", monospace',
                      }}
                    >
                      {line.text ? i + 1 : ''}
                    </span>
                    <span style={{ color: line.color || 'transparent' }}>
                      {line.text || ' '}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </AbsoluteFill>

      {/* Wordmark + subtitle (480–580f) */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {WORDMARK_LETTERS.map((letter, i) => {
            const ls = wordmarkStart + i * 9;
            const lo = interpolate(frame, [ls, ls + 20], [0, 1], ease);
            const ly = interpolate(frame, [ls, ls + 20], [16, 0], ease);
            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 44,
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  color: '#ffffff',
                  opacity: lo,
                  transform: `translateY(${ly}px)`,
                  display: 'inline-block',
                  textShadow: '0 0 45px rgba(155,89,182,0.8)',
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
            color: '#9b59b6',
            letterSpacing: '0.35em',
            marginTop: 8,
            textTransform: 'uppercase',
          }}
        >
          Flux Code — multi-agent engineering · neural network · zero setup
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
