import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene2 } from './scenes/Scene2';

export const AerofluxComposition: React.FC = () => (
  <AbsoluteFill style={{ background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
    <Scene2 />
  </AbsoluteFill>
);
