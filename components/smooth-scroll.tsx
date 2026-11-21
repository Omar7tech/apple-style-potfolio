"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * App-wide motion settings. Scrolling is the browser's own (no smooth-scroll library):
 * it is faster and feels native, and GSAP ScrollTrigger reads it directly.
 * Motion follows the visitor's reduced-motion setting.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
