import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';

const BG: React.FC<{ frame: number }> = ({ frame }) => {
  // Gentle hue shift across the whole video
  const hue = interpolate(frame, [0, 900], [220, 260], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 10% 10%, hsl(${hue},60%,92%) 0%, transparent 60%),
          radial-gradient(ellipse 70% 55% at 90% 85%, hsl(300,50%,90%) 0%, transparent 60%),
          #f8f7ff
        `,
      }}
    />
  );
};

export const AerofluxComposition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ fontFamily: '-apple-system, "SF Pro Display", "Inter", sans-serif' }}
    >
      <BG frame={frame} />

      {/* Scene 1: Problem — 0-180f */}
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Flux Chat — 180-360f */}
      <Sequence from={180} durationInFrames={180}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Flux Code — 360-540f */}
      <Sequence from={360} durationInFrames={180}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Flux Study — 540-720f */}
      <Sequence from={540} durationInFrames={180}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: Outro — 720-900f */}
      <Sequence from={720} durationInFrames={180}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
