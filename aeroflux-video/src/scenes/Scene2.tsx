import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GlassPanel } from '../components/GlassPanel';
import { Particles } from '../components/Particles';

const CODE_LINES = [
  { code: 'import { FluxAgent } from "@aeroflux/core";', color: '#9b59b6' },
  { code: 'import { KnowledgeGraph } from "@aeroflux/kg";', color: '#9b59b6' },
  { code: '', color: 'transparent' },
  { code: 'const agent = new FluxAgent({', color: '#00f5ff' },
  { code: '  model: "flux-ultra-v2",', color: '#e0e8ff' },
  { code: '  context: KnowledgeGraph.load("physics"),', color: '#e0e8ff' },
  { code: '  tools: ["search", "code", "explain"],', color: '#e0e8ff' },
  { code: '});', color: '#00f5ff' },
  { code: '', color: 'transparent' },
  { code: 'const result = await agent.run({', color: '#00f5ff' },
  { code: '  task: "Solve quantum circuit problem",', color: '#e0e8ff' },
  { code: '  multiAgent: true,', color: '#a0ff90' },
  { code: '  agents: ["researcher", "coder", "reviewer"],', color: '#a0ff90' },
  { code: '});', color: '#00f5ff' },
];

const NODES = [
  { x: 120, y: 200 },
  { x: 280, y: 100 },
  { x: 440, y: 180 },
  { x: 360, y: 320 },
  { x: 180, y: 360 },
  { x: 520, y: 280 },
  { x: 60, y: 300 },
  { x: 400, y: 60 },
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
  [1, 7], [2, 5], [3, 5], [5, 7],
];

const NetworkGraph: React.FC<{ frame: number; relativeFrame: number }> = ({
  frame,
  relativeFrame,
}) => {
  const graphOpacity = interpolate(relativeFrame, [30, 60], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: graphOpacity,
      }}
    >
      <svg width={600} height={420} style={{ overflow: 'visible' }}>
        {CONNECTIONS.map(([a, b], i) => {
          const nodeA = NODES[a];
          const nodeB = NODES[b];
          const linePulse = interpolate(
            Math.sin(frame * 0.05 + i * 0.7),
            [-1, 1],
            [0.1, 0.4],
          );
          return (
            <line
              key={i}
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              stroke="rgba(0,245,255,0.6)"
              strokeWidth={1}
              opacity={linePulse}
            />
          );
        })}
        {NODES.map((node, i) => {
          const nodePulse = interpolate(
            Math.sin(frame * 0.07 + i * 1.1),
            [-1, 1],
            [3, 6],
          );
          const nodeOpacity = interpolate(
            Math.sin(frame * 0.06 + i * 0.9),
            [-1, 1],
            [0.5, 1],
          );
          return (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodePulse * 2}
                fill="rgba(0,245,255,0.05)"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={nodePulse}
                fill="#00f5ff"
                opacity={nodeOpacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const CodeEditorPanel: React.FC<{ frame: number; relativeFrame: number }> = ({
  frame,
  relativeFrame,
}) => {
  const panelOpacity = interpolate(relativeFrame, [0, 30], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateAngle = interpolate(relativeFrame, [30, 280], [-3, 3], {
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
        transform: `translateX(-55%) translateY(-50%) rotate(${rotateAngle}deg)`,
        opacity: panelOpacity,
        transformOrigin: 'center center',
      }}
    >
      <GlassPanel
        width={760}
        height={480}
        glowColor="rgba(155,89,182,0.25)"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Editor title bar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                background: i === 0 ? '#ff5f57' : i === 1 ? '#febc2e' : '#28c840',
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
            }}
          >
            agent.ts — Flux Code
          </span>
        </div>

        {/* Line numbers + code */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            padding: '20px 0',
            overflow: 'hidden',
          }}
        >
          {/* Line numbers */}
          <div
            style={{
              width: 50,
              borderRight: '1px solid rgba(255,255,255,0.05)',
              paddingRight: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {CODE_LINES.map((_, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 13,
                  lineHeight: '22px',
                  color: 'rgba(255,255,255,0.2)',
                  textAlign: 'right',
                  paddingRight: 8,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code lines */}
          <div
            style={{
              flex: 1,
              paddingLeft: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {CODE_LINES.map((line, i) => {
              const lineStart = relativeFrame - i * 10;
              const lineOpacity = interpolate(lineStart, [0, 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const lineX = interpolate(lineStart, [0, 20], [-20, 0], {
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <div
                  key={i}
                  style={{
                    fontFamily: '"Fira Code", "Courier New", monospace',
                    fontSize: 13,
                    lineHeight: '22px',
                    color: line.color,
                    opacity: lineOpacity,
                    transform: `translateX(${lineX}px)`,
                    whiteSpace: 'pre',
                  }}
                >
                  {line.code}
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

const Scene2Wordmark: React.FC<{ relativeFrame: number }> = ({
  relativeFrame,
}) => {
  const opacity = interpolate(relativeFrame, [200, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(relativeFrame, [200, 240], [20, 0], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: `translateX(-50%) translateY(${y}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 14,
          fontWeight: 300,
          color: '#9b59b6',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(155,89,182,0.6)',
        }}
      >
        Flux Code — multi-agent engineering
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#000015',
        opacity: sceneOpacity,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 60% 50%, rgba(155,89,182,0.15) 0%, transparent 60%)',
        }}
      />

      <Particles count={15} startFrame={0} />

      <AbsoluteFill>
        <NetworkGraph frame={frame} relativeFrame={frame} />
        <CodeEditorPanel frame={frame} relativeFrame={frame} />
        <Scene2Wordmark relativeFrame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
