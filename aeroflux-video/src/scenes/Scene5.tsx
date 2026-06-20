import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

// The Korahey / AEROFLUX logo mark — a simple geometric mark
const LogoMark: React.FC<{ size?: number; opacity?: number }> = ({ size = 80, opacity = 1 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity,
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 40 40" fill="none">
      {/* Stylised A / flux mark */}
      <path d="M20 4 L36 34 H28 L20 18 L12 34 H4 Z" fill="url(#g1)" />
      <path d="M10 26 H30" stroke="url(#g2)" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="g1" x1="4" y1="4" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B8CFF" />
          <stop offset="1" stopColor="#B06EFF" />
        </linearGradient>
        <linearGradient id="g2" x1="10" y1="26" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B8CFF" />
          <stop offset="1" stopColor="#B06EFF" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Three floating feature pills
const FEATURES = [
  { label: 'Flux Chat', icon: '💬', color: '#5B8CFF', delay: 60 },
  { label: 'Flux Code', icon: '⌨️', color: '#B06EFF', delay: 75 },
  { label: 'Flux Study', icon: '📊', color: '#4CAF50', delay: 90 },
];

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo drop in
  const logoS = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 50 });

  // Main headline
  const line1Opacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' });
  const line1Y = interpolate(frame, [30, 55], [24, 0], { extrapolateRight: 'clamp' });

  const line2Opacity = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line2Y = interpolate(frame, [50, 75], [24, 0], { extrapolateRight: 'clamp' });

  // CTA
  const ctaOpacity = interpolate(frame, [100, 125], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [100, 125], [16, 0], { extrapolateRight: 'clamp' });

  // URL
  const urlOpacity = interpolate(frame, [130, 155], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle pulse on logo
  const logoPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Logo */}
      <div style={{
        transform: `
          translateY(${interpolate(logoS, [0, 1], [40, 0])}px)
          scale(${logoS * logoPulse})
        `,
        opacity: logoS,
        marginBottom: 28,
      }}>
        <LogoMark size={90} />
      </div>

      {/* Headline */}
      <div style={{
        opacity: line1Opacity, transform: `translateY(${line1Y}px)`,
        fontSize: 64, fontWeight: 700, color: '#111',
        letterSpacing: -2, textAlign: 'center', lineHeight: 1.1,
      }}>
        Now you have
      </div>
      <div style={{
        opacity: line2Opacity, transform: `translateY(${line2Y}px)`,
        fontSize: 64, fontWeight: 700, letterSpacing: -2, textAlign: 'center',
        background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 40, lineHeight: 1.1,
      }}>
        everything.
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 50, opacity: ctaOpacity, transform: `translateY(${ctaY}px)` }}>
        {FEATURES.map((f, i) => {
          const pS = spring({ frame: frame - f.delay, fps, config: { damping: 16, stiffness: 100 }, durationInFrames: 35 });
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff',
              borderRadius: 99,
              padding: '10px 18px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              opacity: pS,
              transform: `scale(${pS}) translateY(${interpolate(pS, [0, 1], [12, 0])}px)`,
            }}>
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: f.color }}>{f.label}</span>
            </div>
          );
        })}
      </div>

      {/* CTA button */}
      <div style={{
        opacity: ctaOpacity, transform: `translateY(${ctaY}px)`,
        background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
        borderRadius: 99, padding: '16px 44px',
        boxShadow: '0 8px 30px rgba(91,140,255,0.35)',
        marginBottom: 28,
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>
          Try AEROFLUX free →
        </span>
      </div>

      {/* URL */}
      <div style={{
        opacity: urlOpacity,
        fontSize: 15, color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: 0.2,
      }}>
        korahey.academy
      </div>
    </AbsoluteFill>
  );
};
