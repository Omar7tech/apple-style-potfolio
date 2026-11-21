"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { contact } from "@/lib/content";

/**
 * Hero: Omar between his own name.
 * "Omar" sits behind the portrait and "Builds" in front of it, so the photo has depth.
 * The portrait is black and white; a soft spotlight follows the pointer and shows it in colour.
 * On load the colour blooms over the face once and settles back, so touch screens see it too.
 * Scrolling pulls the two words apart and settles the portrait back.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const color = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = color.current!;
      const figure = root.current!.querySelector<HTMLElement>("[data-figure]")!;
      const mm = gsap.matchMedia();

      // Spotlight position and size live in CSS variables on the colour layer.
      gsap.set(el, { "--mx": "56%", "--my": "38%", "--r": "0px" });

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
          .from("[data-figure-in]", { yPercent: 10, scale: 1.04, autoAlpha: 0, duration: 1.8 }, 0.2)
          .to(el, { "--r": () => `${Math.round(figure.offsetWidth * 0.42)}px`, duration: 1.4, ease: "power2.out" }, 1.1)
          .to(el, { "--r": "0px", duration: 1.6, ease: "power2.inOut" }, 2.7)
          .from("[data-hero-fade]", { autoAlpha: 0, y: 12, duration: 1 }, 1.1);

        // Scrolling out.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.5 },
          })
          .to("[data-word-omar]", { xPercent: -12 }, 0)
          .to("[data-word-builds]", { xPercent: -24 }, 0)
          .to(figure, { yPercent: 10, scale: 0.95 }, 0)
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

      // The colour spotlight follows the pointer anywhere over the hero.
      const xTo = gsap.quickTo(el, "--mx", { duration: 0.6, ease: "power3.out", unit: "px" });
      const yTo = gsap.quickTo(el, "--my", { duration: 0.6, ease: "power3.out", unit: "px" });
      const section = root.current!;
      let placed = false;
      const onMove = (e: PointerEvent) => {
        const r = figure.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (!placed) {
          gsap.set(el, { "--mx": `${x}px`, "--my": `${y}px` });
          placed = true;
        }
        xTo(x);
        yTo(y);
      };
      const onEnter = () => gsap.to(el, { "--r": "190px", duration: 0.7, ease: "power3.out", overwrite: "auto" });
      const onLeave = () => {
        placed = false;
        gsap.to(el, { "--r": "0px", duration: 0.7, ease: "power3.inOut", overwrite: "auto" });
      };
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerenter", onEnter);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerenter", onEnter);
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

      {/* The portrait: black and white, with a colour layer revealed by the spotlight */}
      <div
        data-figure
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
        <div data-figure-in className="absolute inset-0">
          <Image
            src="/omar-cutout.webp"
            alt="Omar Abi Farraj in sunglasses and a black beanie"
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 58vw, (min-width: 640px) 78vh, 118vw"
            className="object-contain object-bottom [filter:grayscale(1)_contrast(1.12)_brightness(0.9)]"
          />
          <div
            ref={color}
            aria-hidden
            className="absolute inset-0"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle var(--r) at var(--mx) var(--my), #000 0%, #000 45%, transparent 100%)",
              maskImage: "radial-gradient(circle var(--r) at var(--mx) var(--my), #000 0%, #000 45%, transparent 100%)",
            }}
          >
            <Image
              src="/omar-cutout.webp"
              alt=""
              fill
              quality={90}
              sizes="(min-width: 1024px) 58vw, (min-width: 640px) 78vh, 118vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
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
