"use client";

import type { ReactNode } from "react";

/** A tile whose edge and surface light up under the pointer. */
export default function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-spot
      className={`tile ${className ?? ""}`}
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.style.setProperty("--spot", "1");
      }}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--spot", "0")}
    >
      {children}
    </div>
  );
}
