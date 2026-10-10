"use client";

import { ReactLenis } from 'lenis/react';
import { useMemo } from 'react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  // Memoized so ReactLenis doesn't recreate the scroll instance on re-render
  const options = useMemo(
    () => ({
      lerp: 0.15, // higher = more responsive; 0.1 felt sluggish
      smoothWheel: true,
      syncTouch: false, // let touch devices scroll natively
      overscroll: false, // don't let overscroll propagate weirdly inside fixed overlays
    }),
    [],
  );

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
