import React from 'react';
import { Composition } from 'remotion';
import { AerofluxComposition } from './Composition';

export const Root: React.FC = () => (
  <Composition
    id="AerofluxComposition"
    component={AerofluxComposition}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{}}
  />
);
