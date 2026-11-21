"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { contact } from "@/lib/content";
import HalftoneReveal from "./halftone-reveal";

/**
 * Hero: a magazine cover for Omar Builds.
 * The brand name is set huge behind the cut-out portrait. The portrait is printed as halftone
 * dots (React Bits HalftoneReveal); the pointer develops the real photo wherever it moves,
 * and a click sends a ring of colour through the print. Scrolling pulls the two words apart.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = SplitText.create("[data-word-line]", { type: "chars", mask: "chars", charsClass: "t-metal" });
        // Lines re-split when fonts load or the width changes; the entrance replays only on first split.
        let h1Played = false;
        const h1 = SplitText.create("[data-hero-h1]", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            if (h1Played) return;
            h1Played = true;
            return gsap.from(self.lines, { yPercent: 105, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.8 });
          },
        });
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });
        // Each letter carries the gradient now; painting it on the line too doubles the glyphs.
        const lines = gsap.utils.toArray<HTMLElement>("[data-word-line]");
        lines.forEach((el) => el.classList.remove("t-metal"));

        // Entrance, once on load.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(words.chars, { yPercent: 115, duration: 1.6, stagger: 0.05 }, 0.1)
          .from("[data-figure]", { yPercent: 8, autoAlpha: 0, duration: 1.8 }, 0.25)
          .from("[data-rim]", { autoAlpha: 0, scale: 0.8, duration: 2.2 }, 0.2)
          .from("[data-hero-fade]", { autoAlpha: 0, y: 12, duration: 1, stagger: 0.08 }, 1);

        // Scrolling out: the words part, the portrait settles back, the light dims.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
          })
          .to("[data-word-omar]", { xPercent: -28 }, 0)
          .to("[data-word-builds]", { xPercent: 28 }, 0)
          .to("[data-figure]", { yPercent: 12, scale: 0.94 }, 0)
          .to("[data-rim]", { autoAlpha: 0.2 }, 0)
          .to("[data-hero-ui]", { autoAlpha: 0, y: -40 }, 0);

        return () => {
          words.revert();
          h1.revert();
          lines.forEach((el) => el.classList.add("t-metal"));
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-black"
    >
      {/* Rim light behind the figure */}
      <div
        data-rim
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[95%] w-[min(1200px,140vw)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 55%, rgb(41 151 255 / 0.32), rgb(41 151 255 / 0.08) 50%, transparent 72%)",
        }}
      />

      {/* The brand, set huge behind the portrait */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-0 pb-[16vh] sm:pb-[8vh] [&_p]:-my-[0.07em]">
        <div className="wrap">
          <p
            data-word-line
            data-word-omar
            data-hide-until-ready
            className="t-metal select-none text-[27vw] font-[800] leading-[1] tracking-[-0.075em] sm:text-[21vw]"
          >
            Omar
          </p>
        </div>
        <div className="wrap text-right">
          <p
            data-word-line
            data-word-builds
            data-hide-until-ready
            className="t-metal select-none text-[27vw] font-[800] leading-[1] tracking-[-0.075em] sm:text-[21vw]"
          >
            Builds
          </p>
        </div>
      </div>

      {/* The portrait, printed in halftone; screen blend lets the type show through the black paper */}
      <div
        data-figure
        role="img"
        aria-label="Black and white portrait of Omar Abi Farraj in sunglasses and a black beanie"
        className="absolute bottom-0 left-1/2 aspect-square w-[min(118vw,92svh)] -translate-x-1/2 mix-blend-screen sm:w-[min(100vw,90svh)]"
        style={{
          filter: "grayscale(1) contrast(1.08) brightness(0.95)",
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, #000 38%), linear-gradient(to right, transparent 0%, #000 24%, #000 76%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, transparent 0%, #000 38%), linear-gradient(to right, transparent 0%, #000 24%, #000 76%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <HalftoneReveal
          src="/omar-cutout.webp"
          fit="contain"
          mode="mono"
          shape="dot"
          cellSize={4.5}
          angle={45}
          dotScale={1.05}
          inkColor="#f5f5f7"
          paperColor="#000000"
          contrast={1.05}
          brightness={-0.1}
          revealRadius={150}
          softness={0.7}
          linger={1.4}
          clickBurst
          intro
        />
      </div>

      {/* Bottom fade so copy sits on black */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div data-hero-ui className="pointer-events-none absolute inset-0">
        {/* First screen copy */}
        <div className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10">
          <div className="wrap grid grid-cols-1 items-end gap-6 sm:grid-cols-12">
            <div className="flex flex-col gap-6 sm:col-span-7 lg:col-span-5">
              <h1
                data-hero-h1
                data-hide-until-ready
                className="text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
              >
                Omar Abi Farraj builds websites, custom software and online stores for businesses.
              </h1>
              <div data-hero-fade className="pointer-events-auto flex flex-col gap-3 sm:flex-row">
                <a href={contact.email} className="btn">
                  Start a project
                  <svg className="btn__arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 7h11m-4.5-4.5L12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#work" className="btn btn--ghost">
                  See the work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
