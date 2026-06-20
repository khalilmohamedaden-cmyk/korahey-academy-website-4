import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';
import { FluxLogo } from '../components/FluxLogo';

const PRODUCTS = [
  { name: 'Flux Chat', icon: '💬', color: '#5B8CFF', desc: 'AI Tutor' },
  { name: 'Flux Code', icon: '⌨️', color: '#B06EFF', desc: 'AI Pair Programmer' },
  { name: 'Flux Study', icon: '📊', color: '#4DFFA0', desc: 'Progress Tracker' },
];

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CAMERA: starts zoomed in, pulls back and settles — epic reveal
  const camScale = interpolate(frame, [0, 70, 180], [1.22, 1.0, 0.98], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camY = interpolate(frame, [0, 90, 180], [40, 0, -5], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [162, 178], [1, 0], { extrapolateRight: 'clamp' });

  // Logo entrance
  const logoS = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 40 });
  const logoPulse = 1 + interpolate(Math.sin(frame * 0.07), [-1, 1], [-0.015, 0.015]);

  // Main headline — letter stagger via word springs
  const h1 = spring({ frame: frame - 28, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 28 });
  const h2 = spring({ frame: frame - 42, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 28 });
  const h3 = spring({ frame: frame - 56, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 28 });

  // Product pills
  // CTA
  const ctaS = spring({ frame: frame - 100, fps, config: { damping: 18, stiffness: 100 }, durationInFrames: 32 });
  const urlOp = interpolate(frame, [132, 155], [0, 1], { extrapolateRight: 'clamp' });

  // Ambient orbs
  const orbA = interpolate(Math.sin(frame * 0.024), [-1, 1], [-60, 60]);
  const orbB = interpolate(Math.cos(frame * 0.018 + 1.5), [-1, 1], [-40, 40]);

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <AbsoluteFill style={{
        transform: `scale(${camScale}) translateY(${camY}px)`,
      }}>
        {/* Ambient */}
        <div style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,140,255,0.12) 0%, transparent 55%)',
          left: `calc(50% - 450px + ${orbA}px)`,
          top: `calc(50% - 450px + ${orbB}px)`,
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,110,255,0.09) 0%, transparent 55%)',
          right: `calc(15% - ${orbA * 0.4}px)`,
          bottom: '10%',
          filter: 'blur(90px)',
        }} />

        {/* Center content */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Logo */}
          <div style={{
            opacity: logoS,
            transform: `scale(${logoS * logoPulse}) translateY(${interpolate(logoS, [0, 1], [30, 0])}px)`,
            marginBottom: 28,
            filter: 'drop-shadow(0 0 30px rgba(91,140,255,0.4))',
          }}>
            <FluxLogo size={88} />
          </div>

          {/* AEROFLUX wordmark */}
          <div style={{
            fontSize: 14, letterSpacing: 8, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', fontWeight: 600,
            marginBottom: 20,
            opacity: logoS,
          }}>
            AEROFLUX
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { word: 'Now', sp: h1, color: '#fff' },
              { word: 'you', sp: h2, color: 'rgba(255,255,255,0.7)' },
              { word: 'have', sp: h3, color: 'rgba(255,255,255,0.5)' },
            ].map(({ word, sp, color }) => (
              <span key={word} style={{
                fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1,
                color, display: 'inline-block',
                opacity: sp,
                transform: `translateY(${interpolate(sp, [0, 1], [35, 0])}px) scale(${interpolate(sp, [0, 1], [0.85, 1])})`,
              }}>
                {word}
              </span>
            ))}
          </div>
          <div style={{
            fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1,
            background: 'linear-gradient(120deg, #5B8CFF 0%, #B06EFF 50%, #4DFFA0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 44,
            opacity: spring({ frame: frame - 68, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 28 }),
            display: 'inline-block',
            transform: `scale(${spring({ frame: frame - 68, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 28 })})`,
          }}>
            everything.
          </div>

          {/* Product pills */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
            {PRODUCTS.map((p, i) => {
              const ps = spring({ frame: frame - (78 + i * 12), fps, config: { damping: 18, stiffness: 110 }, durationInFrames: 24 });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  opacity: ps,
                  transform: `scale(${ps}) translateY(${interpolate(ps, [0, 1], [14, 0])}px)`,
                }}>
                  <span style={{ fontSize: 15 }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.name}</span>
                </div>
              );
            })}
          </div>

          {/* CTA button */}
          <div style={{
            opacity: ctaS,
            transform: `scale(${ctaS}) translateY(${interpolate(ctaS, [0, 1], [16, 0])}px)`,
            background: 'linear-gradient(135deg, #5B8CFF 0%, #B06EFF 100%)',
            borderRadius: 99, padding: '18px 52px',
            boxShadow: '0 12px 40px rgba(91,140,255,0.40), 0 0 0 1px rgba(255,255,255,0.08)',
            marginBottom: 22,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>
              Try AEROFLUX free →
            </span>
          </div>

          {/* URL */}
          <div style={{
            opacity: urlOp,
            fontSize: 14, color: 'rgba(255,255,255,0.22)', fontWeight: 500, letterSpacing: 1,
          }}>
            korahey.academy
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
