import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';
import { FluxLogo } from '../components/FluxLogo';

// ─── Phase boundaries ───────────────────────────────────────────────────────
const PH_HOME      = 0;    // home screen visible
const PH_PAN       = 28;   // camera starts flying toward input bar
const PH_AT_INPUT  = 62;   // camera locked on input bar
const PH_PASTE     = 70;   // text pastes into input
const PH_SEND      = 88;   // message bubble animates into chat
const PH_REPLY     = 100;  // Flux reply starts streaming
const PH_REPLY_END = 155;  // reply fully visible
const PH_REVEAL    = 158;  // camera pulls back, bg → white
const PH_REVEAL_END = 175;

const USER_MSG = 'Can you explain photosynthesis for my bio exam?';
const AI_REPLY = 'Photosynthesis converts light into chemical energy. Sunlight hits chlorophyll in the thylakoid membranes, splitting water and releasing O₂. The energy captured drives the Calvin cycle, which fixes CO₂ into glucose — the fuel that powers nearly all life on Earth.';

// ─── Ocean Divide background (ported from Flux Chat canvas animation) ────────
const OceanDivide: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const t = frame / fps;

  // Flux Chat default theme — white/grey tones against dark bg
  const r1 = 255, g1 = 255, b1 = 255;
  const r2 = 200, g2 = 210, b2 = 220;
  const r3 = 180, g3 = 190, b3 = 210;

  // Seam control points (same math as original)
  const ex   = W * (0.44 + Math.sin(t * 0.18) * 0.05 + Math.sin(t * 0.11) * 0.03);
  const cp1x = ex + Math.sin(t * 0.22) * W * 0.07;
  const cp1y = H * (0.26 + Math.cos(t * 0.15) * 0.05);
  const midX = ex + Math.sin(t * 0.19 + 1) * W * 0.11;
  const midY = H * 0.5;
  const cp2x = ex + Math.sin(t * 0.17 + 2) * W * 0.09;
  const cp2y = H * (0.74 + Math.sin(t * 0.13) * 0.05);

  // SVG left-fill path
  const fillPath = [
    `M 0 0`,
    `L ${cp1x - W * 0.04} 0`,
    `C ${cp1x} ${cp1y} ${midX} ${midY} ${cp2x} ${cp2y}`,
    `C ${cp2x + W * 0.04} ${H} 0 ${H} 0 ${H}`,
    `Z`,
  ].join(' ');

  // Glowing seam stroke
  const seamPath = [
    `M ${cp1x - W * 0.04} 0`,
    `C ${cp1x} ${cp1y} ${midX} ${midY} ${cp2x} ${cp2y}`,
  ].join(' ');

  // Deterministic floating dots (fixed seeds, position driven by frame)
  const dots = Array.from({ length: 18 }, (_, i) => {
    const seed1 = ((i * 0.618033) % 1);
    const seed2 = ((i * 0.381966) % 1);
    const sx = seed1 * W * 0.7;
    const sy = seed2 * H;
    const vx = (((i * 1.7) % 1) - 0.5) * 0.28;
    const vy = (((i * 2.3) % 1) - 0.5) * 0.22;
    const px = ((sx + vx * frame) % (W * 0.72) + W * 0.72) % (W * 0.72);
    const py = ((sy + vy * frame) % H + H) % H;
    const r  = seed1 * 4 + 2;
    const phase = seed2 * Math.PI * 2;
    const bright = i % 2 === 0;
    const pulse = 0.5 + Math.sin(t * 1.9 + phase) * 0.5;
    const op = pulse * (bright ? 0.65 : 0.28);
    return { px, py, r, bright, op };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="od-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={`rgba(${r1},${g1},${b1},0.10)`} />
            <stop offset="65%"  stopColor={`rgba(${r2},${g2},${b2},0.06)`} />
            <stop offset="100%" stopColor={`rgba(${r2},${g2},${b2},0.02)`} />
          </linearGradient>
          <filter id="od-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Left-region fill */}
        <path d={fillPath} fill="url(#od-fill)" />

        {/* Glowing seam line */}
        <path d={seamPath} fill="none"
          stroke={`rgba(${r3},${g3},${b3},0.55)`}
          strokeWidth="1.5"
          filter="url(#od-glow)" />

        {/* Bioluminescent dots */}
        {dots.map((d, i) => (
          <g key={i}>
            {d.bright && (
              <circle cx={d.px} cy={d.py} r={d.r * 3}
                fill={`rgba(${r3},${g3},${b3},${d.op * 0.35})`}
                filter="url(#dot-glow)" />
            )}
            <circle cx={d.px} cy={d.py} r={d.r * (d.bright ? 1 : 0.55)}
              fill={d.bright
                ? `rgba(${r3},${g3},${b3},${d.op})`
                : `rgba(${r1},${g1},${b1},${d.op * 0.5})`} />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Flux Chat window ────────────────────────────────────────────────────────
const FluxChatWindow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const showMsg   = frame >= PH_SEND;
  const msgS      = spring({ frame: frame - PH_SEND, fps, config: { damping: 18, stiffness: 130 }, durationInFrames: 22 });
  const showReply = frame >= PH_REPLY;
  const replyChars = Math.floor(interpolate(frame, [PH_REPLY, PH_REPLY_END], [0, AI_REPLY.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const cursorBlink = Math.round(frame / 5) % 2 === 0;

  // Input text: paste appears at PH_PASTE all at once; clears when message sends
  const showInputText = frame >= PH_PASTE && frame < PH_SEND;
  // Paste highlight fades from warm tint to normal in ~12 frames
  const pasteHighlight = interpolate(frame, [PH_PASTE, PH_PASTE + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: 1100,
      height: 680,
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(7,8,12,0.97)',
      backdropFilter: 'blur(80px)',
      WebkitBackdropFilter: 'blur(80px)',
      boxShadow: [
        '0 0 0 0.5px rgba(255,255,255,0.08)',
        '0 2px 4px rgba(0,0,0,0.5)',
        '0 8px 24px rgba(0,0,0,0.4)',
        '0 24px 64px rgba(0,0,0,0.35)',
        'inset 0 1px 0 rgba(255,255,255,0.06)',
      ].join(', '),
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 52, flexShrink: 0,
        background: 'rgba(255,255,255,0.022)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0 14px',
        gap: 6,
      }}>
        <div style={{ marginBottom: 10 }}>
          <FluxLogo size={24} />
        </div>

        {/* Nav icons */}
        {[
          // new-chat plus
          <svg key="nc" viewBox="0 0 24 24" width="15" height="15" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.7">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>,
          // chat bubbles
          <svg key="ch" viewBox="0 0 24 24" width="15" height="15" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.7">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>,
          // grid / projects
          <svg key="pr" viewBox="0 0 24 24" width="15" height="15" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.7">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>,
          // settings
          <svg key="st" viewBox="0 0 24 24" width="15" height="15" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="1.7">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>,
        ].map((icon, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
          }}>
            {icon}
          </div>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.10))',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
          }}>S</div>
        </div>
      </div>

      {/* ── Main chat column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          height: 48, flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', fontWeight: 400 }}>New Chat</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 99, padding: '5px 12px 5px 9px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4DFFA0' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Flux Nexus</span>
            <svg viewBox="0 0 24 24" width="8" height="8" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, padding: '28px 32px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: 660, width: '100%', alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Empty state */}
            {!showMsg && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                paddingTop: 80, gap: 16,
                opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                <FluxLogo size={48} opacity={0.18} />
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.18)', fontWeight: 400, letterSpacing: 0.2 }}>
                  How can I help you today?
                </div>
              </div>
            )}

            {/* User bubble */}
            {showMsg && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                opacity: msgS,
                transform: `translateY(${interpolate(msgS, [0, 1], [16, 0])}px)`,
              }}>
                <div style={{
                  maxWidth: '70%', padding: '11px 17px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: '18px 18px 4px 18px',
                  fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6,
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                }}>
                  {USER_MSG}
                </div>
              </div>
            )}

            {/* AI reply — no avatar, no logo */}
            {showReply && (
              <div style={{
                display: 'flex', justifyContent: 'flex-start',
                opacity: interpolate(frame, [PH_REPLY, PH_REPLY + 10], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(frame, [PH_REPLY, PH_REPLY + 10], [10, 0], { extrapolateRight: 'clamp' })}px)`,
              }}>
                <div style={{
                  maxWidth: '82%',
                  fontSize: 14.5, color: 'rgba(255,255,255,0.78)', lineHeight: 1.72,
                  fontWeight: 400,
                }}>
                  {AI_REPLY.slice(0, replyChars)}
                  {replyChars < AI_REPLY.length && (
                    <span style={{ opacity: cursorBlink ? 1 : 0, color: 'rgba(255,255,255,0.6)' }}>▋</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div style={{ padding: '0 20px 18px', flexShrink: 0 }}>
          <div style={{
            maxWidth: 660, margin: '0 auto',
            background: 'rgba(255,255,255,0.055)',
            border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: 26, padding: '0 8px 0 16px',
            display: 'flex', alignItems: 'center', gap: 6,
            minHeight: 52,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 2px 12px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          }}>
            <div style={{
              flex: 1, fontSize: 13.5, lineHeight: 1.5,
              color: showInputText
                ? `rgba(${Math.round(255 - pasteHighlight * 20)},${Math.round(255 - pasteHighlight * 60)},${Math.round(255 - pasteHighlight * 20)},${0.6 + pasteHighlight * 0.3})`
                : 'rgba(255,255,255,0.22)',
              fontWeight: showInputText ? 400 : 300,
              letterSpacing: 0.1,
            }}>
              {showInputText ? USER_MSG : 'Message Flux'}
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: showInputText ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14"
                stroke={showInputText ? '#07080c' : 'rgba(255,255,255,0.3)'}
                fill="none" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Scene2 ──────────────────────────────────────────────────────────────────
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [165, 178], [1, 0], { extrapolateRight: 'clamp' });

  // ── CAMERA: 4-phase movement ──────────────────────────────────────────────
  // Phase A (0-28):    Wide home view — slight zoom in (1.4×)
  // Phase B (28-62):   Camera rushes toward input bar — zoom up + pan down
  // Phase C (62-155):  Hold near input / drift back up for reply
  // Phase D (155-175): Full pull-back to 1.0×, white bg appears

  const camScale = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INPUT, PH_REVEAL, PH_REVEAL_END],
    [1.35,    1.35,   2.5,         2.2,        1.0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  // Y pan: start neutral, dive down to show input bar, drift up for reply, recenter on zoom-out
  const camY = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INPUT, PH_REPLY, PH_REPLY_END, PH_REVEAL, PH_REVEAL_END],
    [0,       0,      160,          160,       60,           40,         0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // Subtle x drift at home, recenters when panning
  const camX = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INPUT],
    [20, 0, 0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // ── BACKGROUND: dark → white transition ──────────────────────────────────
  const bgWhite = interpolate(frame, [PH_REVEAL, PH_REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const bgR = Math.round(7   + (255 - 7)   * bgWhite);
  const bgG = Math.round(8   + (255 - 8)   * bgWhite);
  const bgB = Math.round(12  + (255 - 12)  * bgWhite);

  // Ocean Divide fades as bg goes white
  const oceanOp = interpolate(bgWhite, [0, 0.6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Window drop-shadow appears when floating on white
  const windowReveal = interpolate(frame, [PH_REVEAL, PH_REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>

      {/* Desktop color — dark ↔ white */}
      <AbsoluteFill style={{ background: `rgb(${bgR},${bgG},${bgB})` }} />

      {/* Ocean Divide background animation */}
      <OceanDivide opacity={oceanOp} />

      {/* ── CAMERA RIG ── */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          transform: `scale(${camScale}) translate(${camX}px, ${-camY}px)`,
          transformOrigin: 'center center',
          filter: windowReveal > 0.05
            ? `drop-shadow(0 ${Math.round(16 + 32 * windowReveal)}px ${Math.round(40 + 60 * windowReveal)}px rgba(0,0,0,${0.18 + 0.22 * windowReveal}))`
            : 'none',
        }}>
          <FluxChatWindow frame={frame} fps={fps} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
