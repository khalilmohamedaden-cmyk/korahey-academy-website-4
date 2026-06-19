import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';

// Google Fonts import via style tag
const FontLoader: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@100;200;300;400&family=Inter:wght@100;200;300&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `}</style>
);

export const AerofluxComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Overall composition fade-in at the very start
  const introOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#000010',
        opacity: introOpacity,
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
      }}
    >
      <FontLoader />

      {/* Scene 1: Flux Chat — frames 0–300 */}
      <Sequence from={0} durationInFrames={300}>
        <Scene1 />
      </Sequence>

      {/* Transition: cross-fade between scene 1 and 2 */}
      <Sequence from={270} durationInFrames={60}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000010',
              opacity: interpolate(frame - 270, [0, 30, 60], [0, 0.6, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Flux Code — frames 300–600 */}
      <Sequence from={300} durationInFrames={300}>
        <Scene2 />
      </Sequence>

      {/* Transition: cross-fade between scene 2 and 3 */}
      <Sequence from={570} durationInFrames={60}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000010',
              opacity: interpolate(frame - 570, [0, 30, 60], [0, 0.7, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Flux Study + Outro — frames 600–900 */}
      <Sequence from={600} durationInFrames={300}>
        <Scene3 />
      </Sequence>

      {/* Final fade to black */}
      <Sequence from={885} durationInFrames={15}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000000',
              opacity: interpolate(frame - 885, [0, 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
