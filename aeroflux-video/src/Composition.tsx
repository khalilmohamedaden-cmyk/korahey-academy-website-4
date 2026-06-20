import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';

export const AerofluxComposition: React.FC = () => (
  <AbsoluteFill style={{ background: '#07080c', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
    <Sequence from={0} durationInFrames={180}><Scene1 /></Sequence>
    <Sequence from={180} durationInFrames={180}><Scene2 /></Sequence>
    <Sequence from={360} durationInFrames={180}><Scene3 /></Sequence>
    <Sequence from={540} durationInFrames={180}><Scene4 /></Sequence>
    <Sequence from={720} durationInFrames={180}><Scene5 /></Sequence>
  </AbsoluteFill>
);
