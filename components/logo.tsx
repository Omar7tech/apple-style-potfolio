"use client";

import { motion } from "motion/react";

/**
 * Omar Builds — the mark.
 * An "O" that is not finished yet: the ring has a gap, and one block is being set into it.
 * The O is Omar; the block is the next piece he builds. On hover the block settles into place.
 *
 * Geometry (64 × 64): ring centre 32,32, radius 22, stroke 9, gap of 70° centred at the
 * top-right (−45°). The block is a 10 px rounded square centred on the ring line in the gap.
 */
export const RING_PATH = "M53.67 28.18 A22 22 0 1 1 35.82 10.33";

export function LogoMark({
  size = 28,
  className,
  animate = true,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
      fill="none"
    >
      <path d={RING_PATH} stroke="currentColor" strokeWidth="9" />
      <motion.rect
        x="42.56"
        y="11.44"
        width="10"
        height="10"
        rx="2.5"
        fill="var(--accent)"
        initial={animate ? { x: 9, y: -9, opacity: 0, rotate: 45 } : false}
        animate={{ x: 2.5, y: -2.5, opacity: 1, rotate: 0 }}
        variants={{ hover: { x: 0, y: 0 } }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: animate ? 0.4 : 0 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}

/** Mark and wordmark: "Omar" set heavy, "Builds" set light, one word to the eye. */
export default function Logo({ className }: { className?: string }) {
  return (
    <motion.span className={`inline-flex items-center gap-2.5 ${className ?? ""}`} whileHover="hover">
      <LogoMark />
      <span className="text-[17px] leading-none tracking-[-0.035em]">
        <span className="font-[650]">Omar</span>
        <span className="font-[350] text-ink-2">Builds</span>
      </span>
    </motion.span>
  );
}
