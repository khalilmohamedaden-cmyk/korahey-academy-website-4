import React from 'react';

interface FluxLogoProps {
  size?: number;
  opacity?: number;
}

export const FluxLogo: React.FC<FluxLogoProps> = ({ size = 80, opacity = 1 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity }}>
    <defs>
      <linearGradient id="flg" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,.30)" />
        <stop offset="100%" stopColor="rgba(255,255,255,.96)" />
      </linearGradient>
    </defs>
    <path fill="url(#flg)" opacity={0.36} d="M20 74C24 52 32 32 50 16 54 12 58 10 62 11 52 20 46 34 44 52 42 63 44 73 48 81 38 81 26 79 20 74Z" />
    <path fill="url(#flg)" opacity={0.62} d="M31 78C33 58 41 38 57 20 61 15 66 12 71 13 61 23 55 37 53 55 51 66 53 77 58 85 47 85 35 83 31 78Z" />
    <path fill="url(#flg)" d="M43 81C43 63 49 45 63 27 68 21 74 16 81 14L85 14C79 21 73 29 69 38L83 38 81 47 67 47C65 53 64 60 64 67 63 75 65 83 70 89L57 89C49 89 43 85 43 81Z" />
    <path fill="rgba(255,255,255,.5)" d="M67 47L81 47 83 38 69 38Z" />
  </svg>
);
