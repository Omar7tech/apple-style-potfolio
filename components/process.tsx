"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { steps } from "@/lib/content";
import Reveal from "./reveal";

export default function Process() {
  const root = useRef<HTMLElement>(null);

  // Each row's rule draws across as the row arrives.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((r) => {
          gsap.fromTo(
            r,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: r, start: "top 88%", once: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="section">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-32">
            <p className="t-label mb-6">Process</p>
            <h2 id="process-title" className="t-h2">
              How a project runs, <span className="text-faint">from the first call to launch.</span>
            </h2>
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {steps.map((s, i) => (
            <li key={s.title} className="group relative">
              <span data-rule aria-hidden className="absolute inset-x-0 top-0 block h-px origin-left bg-line-strong" />
              <Reveal className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 py-10 sm:grid-cols-[120px_1fr_1.4fr] sm:items-baseline lg:py-14">
                <span className="font-display t-metal text-[56px] leading-none tracking-[-0.03em] transition-[filter] duration-500 group-hover:brightness-150 sm:text-[72px]">
                  0{i + 1}
                </span>
                <h3 className="t-h3 self-center sm:self-auto">{s.title}</h3>
                <p className="col-span-2 max-w-[40ch] text-[17px] leading-relaxed text-muted sm:col-span-1">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
