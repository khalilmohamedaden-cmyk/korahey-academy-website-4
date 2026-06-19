import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';

const { fontFamily } = loadFont('normal', { weights: ['300', '400'], subsets: ['latin'] });

const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const easeOut = { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const CODE_LINES = [
  { text: 'import { FluxAgent } from "@aeroflux/core";', color: 'rgba(180,140,255,0.9)' },
  { text: '', color: '' },
  { text: 'const agents = [', color: 'rgba(200,200,220,0.75)' },
  { text: '  new FluxAgent({ role: "researcher" }),', color: 'rgba(140,210,255,0.85)' },
  { text: '  new FluxAgent({ role: "coder" }),', color: 'rgba(140,210,255,0.85)' },
  { text: '  new FluxAgent({ role: "reviewer" }),', color: 'rgba(140,210,255,0.85)' },
  { text: '];', color: 'rgba(200,200,220,0.75)' },
  { text: '', color: '' },
  { text: 'const result = await Promise.all(', color: 'rgba(255,200,100,0.85)' },
  { text: '  agents.map(a => a.run(task))', color: 'rgba(140,210,255,0.85)' },
  { text: ');', color: 'rgba(255,200,100,0.85)' },
  { text: '', color: '' },
  { text: '// 3 agents · zero latency · one result', color: 'rgba(100,180,100,0.7)' },
];

const NODES = [
  { x: 18, y: 25, label: 'Research' },
  { x: 50, y: 12, label: 'Code' },
  { x: 82, y: 25, label: 'Review' },
  { x: 50, y: 82, label: 'Orchestrator' },
];

const EDGES = [
  [0, 3], [1, 3], [2, 3], [0, 1], [1, 2],
];

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const panelOpacity = interpolate(frame, [0, 25], [0, 1], ease);
  const panelY = interpolate(frame, [0, 25], [40, 0], ease);

  // slow orbit effect on wrapper
  const orbitAngle = interpolate(frame, [0, 300], [-3, 3], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [250, 275], [0, 1], ease);

  const letters = 'AEROFLUX'.split('');

  return (
    <AbsoluteFill style={{ background: '#000008', fontFamily }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,26,74,0.55) 0%, transparent 70%)',
        }}
      />

      <Particles count={16} startFrame={0} color="#00f5ff" />

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: panelOpacity,
          transform: `translateY(${panelY}px) rotate(${orbitAngle * 0.4}deg)`,
        }}
      >
        {/* Node network behind */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 520,
            transform: `rotate(${-orbitAngle * 0.4}deg)`,
          }}
        >
          <svg width="800" height="520" style={{ position: 'absolute', inset: 0 }}>
            {EDGES.map(([a, b], i) => {
              const n1 = NODES[a];
              const n2 = NODES[b];
              const progress = interpolate(frame, [20 + i * 12, 50 + i * 12], [0, 1], easeOut);
              const x1 = (n1.x / 100) * 800;
              const y1 = (n1.y / 100) * 520;
              const x2 = (n2.x / 100) * 800;
              const y2 = (n2.y / 100) * 520;
              const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const pulse = 0.4 + Math.sin(frame * 0.05 + i) * 0.3;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x1 + (x2 - x1) * progress}
                  y2={y1 + (y2 - y1) * progress}
                  stroke={`rgba(0,245,255,${pulse * 0.6})`}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}
            {NODES.map((node, i) => {
              const cx = (node.x / 100) * 800;
              const cy = (node.y / 100) * 520;
              const nodeOpacity = interpolate(frame, [15 + i * 8, 35 + i * 8], [0, 1], ease);
              const pulse = 0.7 + Math.sin(frame * 0.06 + i * 1.5) * 0.3;
              return (
                <g key={i} opacity={nodeOpacity}>
                  <circle cx={cx} cy={cy} r={18} fill="rgba(0,245,255,0.06)" stroke="rgba(0,245,255,0.3)" strokeWidth={1} />
                  <circle cx={cx} cy={cy} r={6} fill={`rgba(0,245,255,${pulse})`} />
                  <circle cx={cx} cy={cy} r={22} fill="none" stroke={`rgba(0,245,255,${pulse * 0.2})`} strokeWidth={1} />
                </g>
              );
            })}
          </svg>
          {NODES.map((node, i) => {
            const nodeOpacity = interpolate(frame, [30 + i * 8, 50 + i * 8], [0, 1], ease);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%) translateY(-30px)',
                  opacity: nodeOpacity,
                  fontFamily,
                  fontSize: 10,
                  fontWeight: 300,
                  color: 'rgba(0,245,255,0.7)',
                  letterSpacing: '0.12em',
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
        <div style={{ transform: `rotate(${-orbitAngle * 0.4}deg)` }}>
          <GlassPanel width={640} height={420} glowColor="rgba(155,89,182,0.2)" glowIntensity={0.85}>
            {/* Editor title bar */}
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
              <span style={{ marginLeft: 14, fontFamily, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                multi-agent.ts — Flux Code
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 28, height: 3, borderRadius: 2, background: `rgba(155,89,182,${0.3 + i * 0.15})` }} />
                ))}
              </div>
            </div>

            {/* Code area */}
            <div style={{ padding: '18px 24px', fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: 13, lineHeight: 1.75 }}>
              {CODE_LINES.map((line, i) => {
                const lineStart = 30 + i * 14;
                const lineOpacity = interpolate(frame, [lineStart, lineStart + 12], [0, 1], ease);
                const lineX = interpolate(frame, [lineStart, lineStart + 12], [-8, 0], ease);
                return (
                  <div
                    key={i}
                    style={{
                      opacity: lineOpacity,
                      transform: `translateX(${lineX}px)`,
                      display: 'flex',
                      alignItems: 'center',
                      height: 22,
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.12)', width: 28, textAlign: 'right', marginRight: 16, fontSize: 11, userSelect: 'none' }}>
                      {line.text ? i + 1 : ''}
                    </span>
                    <span style={{ color: line.color || 'transparent' }}>{line.text || ' '}</span>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </AbsoluteFill>

      {/* Wordmark */}
      <div style={{ position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                fontFamily,
                fontSize: 48,
                fontWeight: 100,
                letterSpacing: '0.18em',
                color: '#fff',
                textShadow: '0 0 40px rgba(155,89,182,0.7)',
                display: 'inline-block',
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            fontFamily,
            fontSize: 12,
            fontWeight: 300,
            color: '#9b59b6',
            letterSpacing: '0.35em',
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          Flux Code — multi-agent engineering
        </div>
      </div>
    </AbsoluteFill>
  );
};
