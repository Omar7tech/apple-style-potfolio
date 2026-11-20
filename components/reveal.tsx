"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * One entrance group, per the motion-effects skill: opacity 0 to 1, 12px rise,
 * 1s with a 0.1s delay once 15% is visible, never replayed.
 * `index` staggers 2 to 4 sibling steps by 0.1s; `media` scales instead of rising.
 */
export default function Reveal({
  children,
  className,
  index = 0,
  media = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  media?: boolean;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={media ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: 12 }}
      whileInView={media ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
