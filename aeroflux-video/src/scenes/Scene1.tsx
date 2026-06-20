import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CAMERA: slow push-in zoom, slight pan right→left
  const camScale = interpolate(frame, [0, 180], [1.15, 1.0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camX = interpolate(frame, [0, 180], [40, -15], { extrapolateRight: 'clamp' });
  const camY = interpolate(frame, [0, 180], [12, -5], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [158, 178], [1, 0], { extrapolateRight: 'clamp' });

  // Word springs — stagger each word
  const w1 = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 130 }, durationInFrames: 28 });
  const w2 = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 130 }, durationInFrames: 28 });
  const w3 = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 130 }, durationInFrames: 28 });

  const subOp = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [55, 80], [18, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  // Floating orbs — parallax layers
  const orbA = interpolate(Math.sin(frame * 0.025), [-1, 1], [-50, 50]);
  const orbB = interpolate(Math.cos(frame * 0.018 + 1), [-1, 1], [-35, 35]);

  const chips = [
    { label: '2am panic', delay: 95 },
    { label: 'No one to ask', delay: 110 },
    { label: 'Deadline tomorrow', delay: 125 },
  ];

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {/* CAMERA RIG */}
      <AbsoluteFill style={{ transform: `scale(${camScale}) translate(${camX}px, ${camY}px)` }}>

        {/* Depth layer 1 — far orbs (move less = parallax depth) */}
        <div style={{
          position: 'absolute',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,140,255,0.10) 0%, transparent 65%)',
          left: `calc(20% + ${orbA * 0.3}px)`,
          top: `calc(15% + ${orbB * 0.3}px)`,
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,110,255,0.08) 0%, transparent 65%)',
          right: `calc(15% - ${orbA * 0.2}px)`,
          bottom: `calc(10% + ${orbB * 0.2}px)`,
          filter: 'blur(80px)',
        }} />

        {/* Headline group */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Word-by-word main title */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { word: 'Students', spring: w1, style: { color: '#fff' } },
              { word: 'deserve', spring: w2, style: { color: 'rgba(255,255,255,0.65)' } },
              { word: 'better.', spring: w3, style: {
                background: 'linear-gradient(120deg, #5B8CFF 0%, #B06EFF 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              } },
            ].map(({ word, spring: sp, style }) => (
              <span key={word} style={{
                fontSize: 104,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 1,
                display: 'inline-block',
                opacity: sp,
                transform: `translateY(${interpolate(sp, [0, 1], [50, 0])}px) scale(${interpolate(sp, [0, 1], [0.82, 1])})`,
                ...style,
              }}>
                {word}
              </span>
            ))}
          </div>

          {/* Sub-line */}
          <div style={{
            opacity: subOp, transform: `translateY(${subY}px)`,
            fontSize: 22, color: 'rgba(255,255,255,0.38)',
            fontWeight: 400, letterSpacing: 0.3, marginTop: 20,
          }}>
            Every student hits a wall. AEROFLUX tears it down.
          </div>

          {/* Pain chips */}
          <div style={{ display: 'flex', gap: 14, marginTop: 52 }}>
            {chips.map((c, i) => {
              const cs = spring({ frame: frame - c.delay, fps, config: { damping: 18, stiffness: 110 }, durationInFrames: 24 });
              return (
                <div key={i} style={{
                  padding: '11px 22px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 500,
                  opacity: cs,
                  transform: `scale(${cs}) translateY(${interpolate(cs, [0, 1], [14, 0])}px)`,
                }}>
                  {c.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom stamp */}
        <div style={{
          position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(frame, [148, 165], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 12, letterSpacing: 6, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}>
          Until now.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
