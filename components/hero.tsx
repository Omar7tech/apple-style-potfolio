"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { contact } from "@/lib/content";

const STRIPS = 14;
const SRC = "/omar-cutout.webp";

/**
 * Hero: the name on the left, the portrait on the right, built from strips.
 * The photo is cut into vertical strips with hairline gaps, as if it were assembled.
 * Strips rise into place from the centre out, a wave of colour runs across them once,
 * and afterwards the strips near the pointer lift and turn to colour, then settle back
 * to black and white. Scrolling out lets the strips drift apart at different speeds.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const figure = root.current!.querySelector<HTMLElement>("[data-figure]")!;
      const strips = gsap.utils.toArray<HTMLElement>("[data-strip]");
      const colors = gsap.utils.toArray<HTMLElement>("[data-strip-color]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = SplitText.create("[data-word]", { type: "chars", mask: "chars", charsClass: "t-metal" });
        let h1Played = false;
        const h1 = SplitText.create("[data-hero-h1]", {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) => {
            if (h1Played) return;
            h1Played = true;
            return gsap.from(self.lines, { yPercent: 105, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.9 });
          },
        });
        const lines = gsap.utils.toArray<HTMLElement>("[data-word]");
        lines.forEach((l) => l.classList.remove("t-metal"));
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });

        // Entrance: name rises, portrait lifts in, colour blooms over the face and settles.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-rim]", { autoAlpha: 0, scale: 0.85, duration: 2.2 }, 0)
          .from(words.chars, { yPercent: 110, duration: 1.5, stagger: 0.045 }, 0.1)
          .from(strips, { yPercent: 104, duration: 1.4, stagger: { each: 0.05, from: "center" } }, 0.2)
          .to(colors, { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.06 }, 1.3)
          .to(colors, { opacity: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.06 }, 1.8)
          .from("[data-hero-fade]", { autoAlpha: 0, y: 12, duration: 1 }, 1.1);

        // Scrolling out.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.5 },
          })
          .to("[data-word-omar]", { xPercent: -12 }, 0)
          .to("[data-word-builds]", { xPercent: -24 }, 0)
          .to(figure, { scale: 0.96 }, 0)
          .fromTo(
            strips,
            { yPercent: 0 },
            { yPercent: (i: number) => [6, -4, 10, -2, 4, -8, 2][i % 7] + 4, ease: "none", immediateRender: false },
            0,
          )
          .to("[data-rim]", { autoAlpha: 0.25 }, 0)
          .to("[data-hero-ui]", { autoAlpha: 0, y: -40 }, 0);

        return () => {
          words.revert();
          h1.revert();
          lines.forEach((l) => l.classList.add("t-metal"));
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });
      });

      // Strips near the pointer lift a little and show their colour.
      const lift = strips.map((el) => gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }));
      const tint = colors.map((el) => gsap.quickTo(el, "opacity", { duration: 0.5, ease: "power2.out" }));
      const section = root.current!;
      const onMove = (e: PointerEvent) => {
        const r = figure.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const inside = e.clientY > r.top - 40 && e.clientY < r.bottom;
        strips.forEach((_, i) => {
          const center = (i + 0.5) / STRIPS;
          const f = inside ? Math.exp(-Math.pow((x - center) / 0.085, 2)) : 0;
          lift[i](-18 * f);
          tint[i](Math.min(1, f * 1.25));
        });
      };
      const onLeave = () => {
        lift.forEach((fn) => fn(0));
        tint.forEach((fn) => fn(0));
      };
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-bg"
    >
      {/* Rim light behind the figure */}
      <div
        data-rim
        aria-hidden
        className="pointer-events-none absolute bottom-[-25%] left-1/2 h-[100%] w-[min(1300px,150vw)] -translate-x-1/2 lg:left-[64%]"
        style={{
          background:
            "radial-gradient(48% 48% at 50% 55%, rgb(41 151 255 / 0.30), rgb(41 151 255 / 0.07) 52%, transparent 74%)",
        }}
      />

      {/* The name, stacked, behind the portrait */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+4svh)]">
        <div className="wrap">
          <p
            data-word
            data-word-omar
            data-hide-until-ready
            className="font-display t-metal select-none text-[26vw] leading-[0.95] tracking-[-0.035em] sm:text-[17vw] lg:text-[13.2vw]"
          >
            Omar
          </p>
          <p
            data-word
            data-word-builds
            data-hide-until-ready
            className="font-display t-metal select-none text-[26vw] leading-[0.95] tracking-[-0.035em] sm:text-[17vw] lg:text-[13.2vw]"
          >
            Builds
          </p>
        </div>
      </div>

      {/* The portrait, cut into strips: black and white, colour where the pointer is */}
      <div
        data-figure
        role="img"
        aria-label="Omar Abi Farraj in sunglasses and a black beanie"
        className="absolute bottom-[calc(24svh+24px)] left-1/2 aspect-square w-[min(100vw,52svh)] -translate-x-1/2 sm:bottom-0 sm:w-[min(96vw,78svh)] lg:left-[64%] lg:w-[min(58vw,96svh)]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, #000 32%), linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, transparent 0%, #000 32%), linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        {Array.from({ length: STRIPS }, (_, i) => {
          const bg = {
            backgroundImage: `url(${SRC})`,
            backgroundSize: `${STRIPS * 100}% 100%`,
            backgroundPosition: `${(i / (STRIPS - 1)) * 100}% 100%`,
            backgroundRepeat: "no-repeat",
          };
          return (
            <div
              key={i}
              className="absolute inset-y-0 overflow-hidden [clip-path:inset(0_0.75px)]"
              style={{ left: `${(i / STRIPS) * 100}%`, width: `${100 / STRIPS}%` }}
            >
              <div data-strip className="absolute inset-0 will-change-transform">
                <div className="absolute inset-0 [filter:grayscale(1)_contrast(1.12)_brightness(0.9)]" style={bg} />
                <div data-strip-color className="absolute inset-0 opacity-0" style={bg} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom fade so the copy sits on black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[34%] bg-gradient-to-t from-bg via-bg/75 to-transparent"
      />

      <div data-hero-ui className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-8 sm:pb-10">
        <div className="wrap">
          <div className="flex max-w-[520px] flex-col gap-6">
            <h1
              data-hero-h1
              data-hide-until-ready
              className="text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink"
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
    </section>
  );
}
