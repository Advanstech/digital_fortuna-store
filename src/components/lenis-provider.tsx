"use client";

import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
