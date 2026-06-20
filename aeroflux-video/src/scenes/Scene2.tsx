import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing,
} from 'remotion';

// ─── Phase boundaries (210 frames = 7 s @ 30 fps) ───────────────────────────
const PH_HOME      = 0;   // new-chat state visible
const PH_PAN       = 30;  // camera starts flying toward input
const PH_AT_INP    = 68;  // camera locked on input bar
const PH_PASTE     = 76;  // text pastes into field
const PH_SEND      = 94;  // message bubble rises into chat
const PH_REPLY     = 108; // Flux reply begins streaming
const PH_REPLY_END = 162; // reply complete
const PH_REVEAL    = 165; // camera pulls back, desktop → white
const PH_REVEAL_END = 195;
const PH_FADE      = 200;
const PH_END       = 210;

const WIN_W = 1100;
const WIN_H = 680;

const USER_MSG  = 'Can you explain photosynthesis for my bio exam?';
const AI_REPLY  = 'Photosynthesis converts light energy into chemical energy stored as glucose. In plants, sunlight excites electrons in chlorophyll within the thylakoid membranes — this splits water molecules and releases O₂. That energy then powers the Calvin cycle in the stroma, which fixes CO₂ into glucose. It\'s what ultimately fuels almost all life on Earth.';

// ─── Flux SVG logo (exact from source) ───────────────────────────────────────
const FluxLogo: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <defs>
      <linearGradient id="flg2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(255,255,255,.35)" />
        <stop offset="100%" stopColor="rgba(255,255,255,.95)" />
      </linearGradient>
    </defs>
    <path fill="url(#flg2)" opacity=".42"  d="M20 74C24 52 32 32 50 16 54 12 58 10 62 11 52 20 46 34 44 52 42 63 44 73 48 81 38 81 26 79 20 74Z"/>
    <path fill="url(#flg2)" opacity=".65"  d="M31 78C33 58 41 38 57 20 61 15 66 12 71 13 61 23 55 37 53 55 51 66 53 77 58 85 47 85 35 83 31 78Z"/>
    <path fill="url(#flg2)"                d="M43 81C43 63 49 45 63 27 68 21 74 16 81 14L85 14C79 21 73 29 69 38L83 38 81 47 67 47C65 53 64 60 64 67 63 75 65 83 70 89L57 89C49 89 43 85 43 81Z"/>
    <path fill="rgba(255,255,255,.5)"      d="M67 47L81 47 83 38 69 38Z"/>
  </svg>
);

// ─── Ocean Divide — ported from Flux Chat canvas animation ───────────────────
const OceanDivide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = WIN_W, H = WIN_H;

  // Flux Chat default theme (white/grey tones)
  const r1 = 255, g1 = 255, b1 = 255; // th1
  const r2 = 200, g2 = 210, b2 = 220; // th2
  const r3 = 180, g3 = 190, b3 = 210; // th3

  // Seam bezier control points (exact formula from source)
  const ex   = W * (0.44 + Math.sin(t * 0.18) * 0.05 + Math.sin(t * 0.11) * 0.03);
  const cp1x = ex + Math.sin(t * 0.22) * W * 0.07;
  const cp1y = H * (0.26 + Math.cos(t * 0.15) * 0.05);
  const midX = ex + Math.sin(t * 0.19 + 1) * W * 0.11;
  const midY = H * 0.5;
  const cp2x = ex + Math.sin(t * 0.17 + 2) * W * 0.09;
  const cp2y = H * (0.74 + Math.sin(t * 0.13) * 0.05);

  // Left-region fill path
  const fillPath = `M 0 0 L ${cp1x - W * 0.04} 0 C ${cp1x} ${cp1y} ${midX} ${midY} ${cp2x} ${cp2y} C ${cp2x + W * 0.04} ${H} 0 ${H} 0 ${H} Z`;
  // Glowing seam stroke
  const seamPath = `M ${cp1x - W * 0.04} 0 C ${cp1x} ${cp1y} ${midX} ${midY} ${cp2x} ${cp2y}`;

  // Deterministic floating dots (position = initial + velocity × frame)
  const dots = Array.from({ length: 18 }, (_, i) => {
    const sx  = ((i * 0.618033) % 1) * W * 0.7;
    const sy  = ((i * 0.381966) % 1) * H;
    const vx  = (((i * 1.7) % 1) - 0.5) * 0.28;
    const vy  = (((i * 2.3) % 1) - 0.5) * 0.22;
    const px  = ((sx + vx * frame) % (W * 0.72) + W * 0.72) % (W * 0.72);
    const py  = ((sy + vy * frame) % H + H) % H;
    const r   = ((i * 0.618033) % 1) * 4 + 2;
    const ph  = ((i * 0.381966) % 1) * Math.PI * 2;
    const bright = i % 2 === 0;
    const pulse  = 0.5 + Math.sin(t * 1.9 + ph) * 0.5;
    const op     = pulse * (bright ? 0.60 : 0.25);
    return { px, py, r, bright, op };
  });

  return (
    <svg
      width={W} height={H}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="od-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={`rgba(${r1},${g1},${b1},0.09)`} />
          <stop offset="60%"  stopColor={`rgba(${r2},${g2},${b2},0.05)`} />
          <stop offset="100%" stopColor={`rgba(${r2},${g2},${b2},0.02)`} />
        </linearGradient>
        <filter id="seam-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="dot-halo" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
      </defs>

      {/* Subtle right-side bg tint (from source: bgG gradient) */}
      <rect x={W * 0.3} y="0" width={W * 0.7} height={H}
        fill={`rgba(${r3},${g3},${b3},0.05)`} />

      {/* Left fill */}
      <path d={fillPath} fill="url(#od-fill)" />

      {/* Glowing seam */}
      <path d={seamPath} fill="none"
        stroke={`rgba(${r3},${g3},${b3},0.50)`}
        strokeWidth="1.5"
        filter="url(#seam-glow)" />

      {/* Bioluminescent dots */}
      {dots.map((d, i) => (
        <g key={i}>
          {d.bright && (
            <circle cx={d.px} cy={d.py} r={d.r * 3.2}
              fill={`rgba(${r3},${g3},${b3},${d.op * 0.3})`}
              filter="url(#dot-halo)" />
          )}
          <circle cx={d.px} cy={d.py} r={d.r * (d.bright ? 1 : 0.55)}
            fill={d.bright
              ? `rgba(${r3},${g3},${b3},${d.op})`
              : `rgba(${r1},${g1},${b1},${d.op * 0.5})`} />
        </g>
      ))}
    </svg>
  );
};

// ─── Sidebar icons (exact SVG paths from HTML) ────────────────────────────────
const NAV = [
  // new chat (plus)
  <svg key="nc" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>,
  // chats
  <svg key="ch" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>,
  // projects
  <svg key="pr" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>,
  // customize (briefcase)
  <svg key="cu" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <rect x="2" y="7" width="20" height="14" rx="2.5"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>,
];
const NAV2 = [
  // code
  <svg key="code" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
  </svg>,
  // study
  <svg key="study" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.55">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>,
];

// ─── The Flux Chat window ─────────────────────────────────────────────────────
const FluxChatWindow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const showMsg   = frame >= PH_SEND;
  const msgS      = spring({ frame: frame - PH_SEND, fps, config: { damping: 18, stiffness: 130 }, durationInFrames: 22 });

  const showReply = frame >= PH_REPLY;
  const replyChars = Math.floor(interpolate(
    frame, [PH_REPLY, PH_REPLY_END], [0, AI_REPLY.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ));
  const blink = Math.round(frame / 5) % 2 === 0;

  // Input: paste at PH_PASTE, clears at PH_SEND
  const showInpText = frame >= PH_PASTE && frame < PH_SEND;
  const pasteGlow   = interpolate(frame, [PH_PASTE, PH_PASTE + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: WIN_W, height: WIN_H,
      borderRadius: 18,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Ocean Divide fills the entire window background ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#07080c', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <OceanDivide />
      </div>

      {/* ── Window frame (glass border + shadow) ── */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: [
          '0 0 0 0.5px rgba(255,255,255,0.06)',
          'inset 0 1px 0 rgba(255,255,255,0.08)',
        ].join(','),
        pointerEvents: 'none',
        zIndex: 100,
      }} />

      {/* ── Sidebar (52px, transparent — OceanDivide shows through) ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: 52, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '10px 0',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Logo button */}
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4,
        }}>
          <FluxLogo size={22} />
        </div>

        {/* Primary nav */}
        {NAV.map((icon, i) => (
          <div key={i} style={{
            width: 32, height: 28, borderRadius: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)', padding: '7px 10px', boxSizing: 'border-box',
            width: '100%',
          }}>
            <div style={{ width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </div>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: 1, width: 28, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

        {/* Products nav */}
        {NAV2.map((icon, i) => (
          <div key={i} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '7px 10px', boxSizing: 'border-box',
            color: 'rgba(255,255,255,0.7)',
          }}>
            <div style={{ width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </div>
          </div>
        ))}

        {/* Spacer + avatar at bottom */}
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
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
      }}>

        {/* Topbar */}
        <div style={{
          height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center', padding: '0 16px',
        }}>
          <div style={{ flex: 1 }} />
          {/* Model pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(48px) saturate(180%)',
            WebkitBackdropFilter: 'blur(48px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 999, padding: '5px 12px 5px 9px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(255,255,255,0.12) inset',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.65)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', fontFamily: "'Inter', sans-serif" }}>Flux Nexus</span>
            <svg viewBox="0 0 24 24" width="9" height="9" stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* Messages scroll area */}
        <div style={{ flex: 1, padding: '20px 0 10px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 710, margin: '0 auto', padding: '0 20px' }}>

            {/* Empty state — new chat */}
            {!showMsg && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                paddingTop: 60, gap: 14,
                opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                <FluxLogo size={54} />
                <div style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 29, color: 'rgba(255,255,255,0.9)', letterSpacing: -0.5,
                  lineHeight: 1.2, textAlign: 'center',
                }}>
                  How can I help<br/>you today?
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', letterSpacing: 0.15 }}>
                  All models run locally · No data leaves your machine
                </div>
              </div>
            )}

            {/* User bubble */}
            {showMsg && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                marginBottom: 22,
                opacity: msgS,
                transform: `translateY(${interpolate(msgS, [0, 1], [16, 0])}px) scale(${interpolate(msgS, [0, 1], [0.95, 1])})`,
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(48px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(48px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '20px 20px 5px 20px',
                  padding: '10px 17px',
                  fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.92)',
                  maxWidth: '74%',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(0,0,0,0.10)',
                }}>
                  {USER_MSG}
                </div>
              </div>
            )}

            {/* AI reply — plain text, no avatar, no logo */}
            {showReply && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                marginBottom: 22,
                opacity: interpolate(frame, [PH_REPLY, PH_REPLY + 10], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(frame, [PH_REPLY, PH_REPLY + 10], [5, 0], { extrapolateRight: 'clamp' })}px)`,
              }}>
                <div style={{
                  fontSize: 14.5, lineHeight: 1.78, color: 'rgba(255,255,255,0.78)',
                  maxWidth: 660,
                }}>
                  {AI_REPLY.slice(0, replyChars)}
                  {replyChars < AI_REPLY.length && (
                    <span style={{ opacity: blink ? 1 : 0, color: 'rgba(255,255,255,0.55)' }}>▋</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat input bar (chat-pill from HTML) */}
        <div style={{ padding: '0 18px 16px', flexShrink: 0 }}>
          <div style={{
            maxWidth: 710, margin: '0 auto',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(48px) saturate(180%)',
            WebkitBackdropFilter: 'blur(48px) saturate(180%)',
            border: `1px solid ${showInpText && pasteGlow > 0.05
              ? `rgba(255,255,255,${0.14 + pasteGlow * 0.10})`
              : 'rgba(255,255,255,0.14)'}`,
            borderRadius: 25, padding: '0 7px',
            display: 'flex', alignItems: 'center', gap: 3,
            minHeight: 50,
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.06) inset',
              '0 1px 0 rgba(255,255,255,0.16) inset',
              '0 4px 16px rgba(0,0,0,0.08)',
              showInpText && pasteGlow > 0.05 ? `0 0 0 3px rgba(255,255,255,${pasteGlow * 0.06})` : '',
            ].filter(Boolean).join(', '),
            position: 'relative', overflow: 'hidden',
          }}>
            {/* glass sheen overlay (::before equivalent) */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
              background: 'linear-gradient(115deg, rgba(255,255,255,0.16) 0%, transparent 28%, transparent 72%, rgba(255,255,255,0.06) 100%)',
              opacity: 0.55,
            }} />

            {/* Attachment icon (gib) */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.30)', flexShrink: 0, position: 'relative',
            }}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="1.8">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </div>

            {/* Input text / placeholder */}
            <div style={{
              flex: 1, fontSize: 14, lineHeight: 1.5, position: 'relative',
              color: showInpText ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.22)',
              fontWeight: showInpText ? 400 : 300,
              padding: '6px 3px',
            }}>
              {showInpText ? USER_MSG : 'Message Flux…'}
            </div>

            {/* Mic icon */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.30)', flexShrink: 0, position: 'relative',
            }}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="1.8">
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8"/>
              </svg>
            </div>

            {/* Send button (gib send) */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, position: 'relative',
              background: showInpText ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.10)',
              color: showInpText ? '#07080c' : 'rgba(255,255,255,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: showInpText ? '0 2px 10px rgba(255,255,255,0.14)' : 'none',
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div style={{
            textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.20)',
            marginTop: 8, letterSpacing: 0.1,
          }}>
            Flux may make mistakes. Verify important information.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Scene 2 ─────────────────────────────────────────────────────────────────
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [PH_FADE, PH_END], [1, 0], { extrapolateRight: 'clamp' });

  // ── CAMERA ────────────────────────────────────────────────────────────────
  // Phase A (0-30):  wide home view at 1.4×
  // Phase B (30-68): rushes down + zooms in toward input bar
  // Phase C (68-96): locked on input at 2.6×, slight drift up as reply arrives
  // Phase D (96-162): backs up slightly to show reply
  // Phase E (165-195): full pull-back to 1.0×, white desktop

  const camScale = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INP, PH_REPLY, PH_REVEAL, PH_REVEAL_END],
    [1.38,    1.38,   2.6,        2.1,      1.8,        1.0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  // Y: dive down to show input, drift back up for reply, recenter on zoom-out
  const camY = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INP, PH_REPLY, PH_REPLY_END, PH_REVEAL, PH_REVEAL_END],
    [0,       0,      -175,       -175,      -60,          -40,        0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // X: slight rightward drift then recenters
  const camX = interpolate(
    frame,
    [PH_HOME, PH_PAN, PH_AT_INP],
    [18, 0, 0],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // ── DESKTOP BACKGROUND: dark → white ─────────────────────────────────────
  const bgW = interpolate(frame, [PH_REVEAL, PH_REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const bgR = Math.round(7   + (255 - 7)   * bgW);
  const bgG = Math.round(8   + (255 - 8)   * bgW);
  const bgB = Math.round(12  + (255 - 12)  * bgW);

  // Window drop-shadow grows as it floats on white desktop
  const revealAmt = interpolate(frame, [PH_REVEAL, PH_REVEAL_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {/* Desktop wallpaper */}
      <AbsoluteFill style={{ background: `rgb(${bgR},${bgG},${bgB})` }} />

      {/* Camera rig */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          transformOrigin: 'center center',
          filter: revealAmt > 0.05
            ? `drop-shadow(0 ${Math.round(12 + 36 * revealAmt)}px ${Math.round(32 + 72 * revealAmt)}px rgba(0,0,0,${0.12 + 0.28 * revealAmt}))`
            : 'none',
        }}>
          <FluxChatWindow frame={frame} fps={fps} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
