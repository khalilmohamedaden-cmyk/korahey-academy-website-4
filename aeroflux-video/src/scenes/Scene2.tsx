import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';
import { FluxLogo } from '../components/FluxLogo';

// ─── Flux Chat UI — faithful recreation of the actual dark glassmorphism interface ───

const MESSAGES = [
  { role: 'user', text: 'Summarize chapter 7 on photosynthesis for my exam tomorrow', showAt: 8 },
  { role: 'ai',   text: 'Chapter 7 covers photosynthesis — the light reactions split water and produce ATP, while the Calvin cycle fixes CO₂ into glucose. Key terms: chlorophyll, thylakoid, stroma.', showAt: 42 },
  { role: 'user', text: 'Give me 3 quick practice questions', showAt: 80 },
  { role: 'ai',   text: '1. What molecule carries energy from light reactions?\n2. Where does the Calvin cycle occur?\n3. What is the final product of photosynthesis?', showAt: 105 },
];

const FluxChatWindow: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  return (
    <div style={{
      width: 1100,
      height: 680,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#07080c',
      boxShadow: '0 40px 120px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.06)',
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 52,
        flexShrink: 0,
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0',
        gap: 4,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        {/* Logo button */}
        <div style={{
          width: 32, height: 32,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
        }}>
          <FluxLogo size={22} />
        </div>

        {/* Nav icons */}
        {[
          // new chat
          <svg key="nc" viewBox="0 0 24 24" width="16" height="16" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.6"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
          // chats
          <svg key="ch" viewBox="0 0 24 24" width="16" height="16" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
          // projects
          <svg key="pr" viewBox="0 0 24 24" width="16" height="16" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        ))}

        <div style={{ height: 1, width: 28, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

        {/* Code + Study */}
        {[
          <svg key="code" viewBox="0 0 24 24" width="16" height="16" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.6"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>,
          <svg key="study" viewBox="0 0 24 24" width="16" height="16" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        ))}

        {/* Avatar at bottom */}
        <div style={{ flex: 1 }} />
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))',
          border: '1px solid rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.88)',
          marginBottom: 8,
        }}>U</div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center',
          padding: '0 16px', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ flex: 1 }} />
          {/* Model pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 999, padding: '5px 12px 5px 9px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.65)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Flux Nexus</span>
            <svg viewBox="0 0 24 24" width="9" height="9" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '20px 0 10px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>
            {MESSAGES.map((msg, i) => {
              const isUser = msg.role === 'user';
              const appear = spring({
                frame: frame - msg.showAt,
                fps,
                config: { damping: 20, stiffness: 120 },
                durationInFrames: 28,
              });
              if (frame < msg.showAt) return null;

              if (isUser) {
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'flex-end', marginBottom: 18,
                    opacity: appear,
                    transform: `translateY(${interpolate(appear, [0, 1], [14, 0])}px)`,
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: '20px 20px 5px 20px',
                      padding: '10px 16px',
                      fontSize: 14, lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.92)',
                      maxWidth: '72%',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              }

              // AI message — stream characters if currently appearing
              const charsTotal = msg.text.length;
              const streamFrames = Math.min(35, charsTotal * 0.4);
              const charsShown = frame < msg.showAt
                ? 0
                : Math.min(charsTotal, Math.round(interpolate(
                    frame, [msg.showAt, msg.showAt + streamFrames],
                    [0, charsTotal], { extrapolateRight: 'clamp' }
                  )));
              const visibleText = msg.text.slice(0, charsShown);

              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18,
                  opacity: appear,
                  transform: `translateY(${interpolate(appear, [0, 1], [10, 0])}px)`,
                }}>
                  {/* Flux avatar */}
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FluxLogo size={16} />
                  </div>
                  <div style={{
                    fontSize: 14.5, lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.78)',
                    maxWidth: 560,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {visibleText}
                    {charsShown < charsTotal && (
                      <span style={{
                        display: 'inline-block', width: 2, height: 16,
                        background: 'rgba(255,255,255,0.7)',
                        marginLeft: 1, borderRadius: 1,
                        animation: 'none',
                        opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input bar */}
        <div style={{ padding: '0 18px 16px', flexShrink: 0 }}>
          <div style={{
            maxWidth: 680, margin: '0 auto',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 25, padding: '0 8px',
            display: 'flex', alignItems: 'center', gap: 4,
            minHeight: 50,
          }}>
            {/* Attachment icon */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth="1.8">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </div>
            <div style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.22)', fontWeight: 300, padding: '6px 3px' }}>
              Message Flux…
            </div>
            {/* Send button */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="#07080c" fill="none" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [160, 178], [1, 0], { extrapolateRight: 'clamp' });

  // ── PHASE TIMING ──
  // 0-110f  : zoomed in, camera pans left → right across chat
  // 110-165f: pull-back zoom reveals full window on white desktop
  // 165-180f: hold / fade out

  const ZOOM_END   = 115;
  const REVEAL_END = 162;

  // ── CAMERA: scale ──
  // During pan: stay zoomed in at ~2.3x
  // Pull-back: 2.3 → 1.0
  const camScale = interpolate(
    frame,
    [0, ZOOM_END, REVEAL_END],
    [2.5, 2.3, 1.0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  // ── CAMERA: pan (X) ──
  // During zoom: pan from left edge of chat to right edge
  // During pull-back: re-center
  const panProgress = interpolate(frame, [0, ZOOM_END], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const panX = interpolate(panProgress, [0, 1], [280, -280]);
  const recenterX = interpolate(frame, [ZOOM_END, REVEAL_END], [panX, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const camX = frame < ZOOM_END ? panX : recenterX;

  // ── CAMERA: tilt Y ──
  const camY = interpolate(
    frame,
    [0, ZOOM_END, REVEAL_END],
    [-40, -20, 0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // ── BACKGROUND: transition from dark → white as window is revealed ──
  const bgWhite = interpolate(frame, [ZOOM_END, REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Window drop-shadow glow as it comes into view ──
  const windowReveal = interpolate(frame, [ZOOM_END, REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>

      {/* Desktop wallpaper — transitions from dark to white */}
      <AbsoluteFill style={{
        background: `rgb(${Math.round(7 + (255 - 7) * bgWhite)}, ${Math.round(8 + (255 - 8) * bgWhite)}, ${Math.round(12 + (255 - 12) * bgWhite)})`,
      }} />

      {/* Subtle desktop texture dots when white bg is showing */}
      {bgWhite > 0.1 && (
        <AbsoluteFill style={{
          opacity: bgWhite * 0.06,
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      )}

      {/* ── CAMERA RIG ── */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          transformOrigin: 'center center',
          filter: windowReveal > 0.05
            ? `drop-shadow(0 ${Math.round(20 * windowReveal)}px ${Math.round(60 * windowReveal)}px rgba(0,0,0,${0.25 * windowReveal}))`
            : 'none',
        }}>
          <FluxChatWindow frame={frame} />
        </div>
      </AbsoluteFill>

      {/* Label that fades in when fully zoomed out */}
      {windowReveal > 0.5 && (
        <div style={{
          position: 'absolute', bottom: 60, left: 0, right: 0,
          textAlign: 'center',
          opacity: interpolate(windowReveal, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(windowReveal, [0.6, 1], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
        }}>
          <div style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(0,0,0,0.22)', fontWeight: 600 }}>
            Flux Chat
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(0,0,0,0.75)', letterSpacing: -0.5, marginTop: 4 }}>
            Your AI tutor. Any question. Any time.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
