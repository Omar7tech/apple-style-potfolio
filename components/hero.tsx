"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { contact } from "@/lib/content";
import LocalTime from "./local-time";

/**
 * The hero is one pinned scene.
 * Screen 1: "OMAR" set huge in white on black, with the portrait showing only through the letters
 * (a multiply blend: white letters pass the photo, black hides it).
 * Scrolling flies through the stroke of the O until the photo fills the screen,
 * then the closing lines arrive over it.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-name]", { type: "chars", mask: "chars" });
        const h1 = SplitText.create("[data-hero-h1]", { type: "lines", mask: "lines", linesClass: "t-metal" });
        const outro = SplitText.create("[data-outro-title]", { type: "words", mask: "words" });
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });

        // Scroll scene: fly through the O.
        const plate = root.current!.querySelector<HTMLElement>("[data-mask]")!;
        // Aim the zoom at the middle of the O's left stroke, measured from the real glyph:
        // draw the O on a canvas, scan its middle row for the first solid run of pixels.
        const setOrigin = () => {
          const o = split.chars[0] as HTMLElement;
          const prev = gsap.getProperty(plate, "scale") as number;
          gsap.set(plate, { scale: 1 });
          const r = o.getBoundingClientRect();
          const m = plate.getBoundingClientRect();
          const cs = getComputedStyle(o);

          const probe = document.createElement("span");
          probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
          o.appendChild(probe);
          const baseline = probe.getBoundingClientRect().top;
          probe.remove();

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const met = ctx.measureText("O");
          const asc = met.actualBoundingBoxAscent;
          canvas.width = Math.ceil(r.width);
          canvas.height = Math.ceil(asc + met.actualBoundingBoxDescent + 4);
          ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          ctx.fillStyle = "#fff";
          ctx.fillText("O", 0, asc + 2);
          const row = Math.round(asc / 2 + 2);
          const data = ctx.getImageData(0, row, canvas.width, 1).data;
          let a = -1;
          let b = -1;
          for (let x = 0; x < canvas.width; x++) {
            const on = data[x * 4 + 3] > 200;
            if (on && a < 0) a = x;
            if (!on && a >= 0) {
              b = x;
              break;
            }
          }
          // The canvas cannot use the optical-size axis, so its stroke runs a little wide; aim left of centre.
          const sx = a >= 0 && b > a ? a + (b - a) * 0.5 : r.width * 0.1;
          gsap.set(plate, {
            transformOrigin: `${r.left - m.left + sx}px ${baseline - m.top - asc / 2}px`,
            scale: prev,
          });
        };
        setOrigin();
        // Entrance, once on load.
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .from(split.chars, { yPercent: 110, duration: 1.5, stagger: 0.07 }, 0.1)
          .from("[data-photo-in]", { scale: 1.3, duration: 2.4 }, 0)
          .from(h1.lines, { yPercent: 105, duration: 1.2, stagger: 0.08 }, 0.6)
          .from("[data-intro-fade]", { autoAlpha: 0, y: 10, duration: 1 }, 0.9)
          .from("[data-meta] > *", { autoAlpha: 0, y: -8, duration: 1, stagger: 0.08 }, 0.7)
          .from("[data-meta-rule]", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.4)
          .from("[data-glow]", { autoAlpha: 0, duration: 2 }, 0.6);

        // Measure at rest: now, and again when the entrance has finished (fonts are loaded by then).
        intro.eventCallback("onComplete", setOrigin);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onRefresh: setOrigin,
          },
        });
        tl.to("[data-intro]", { autoAlpha: 0, y: -24, duration: 0.18 }, 0)
          .to("[data-meta-wrap]", { autoAlpha: 0, y: -16, duration: 0.14 }, 0)
          .to("[data-glow]", { autoAlpha: 0, duration: 0.2 }, 0.05)
          .to("[data-progress]", { scaleX: 1, duration: 1 }, 0)
          .to(plate, { scale: 90, duration: 0.72, ease: "power2.in" }, 0.02)
          .to(plate, { autoAlpha: 0, duration: 0.1 }, 0.64)
          .fromTo("[data-photo]", { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
          .to("[data-shade]", { autoAlpha: 1, duration: 0.3 }, 0.62)
          .fromTo(
            "[data-outro] > *",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
            0.68,
          )
          .from(outro.words, { yPercent: 110, duration: 0.24, stagger: 0.025, ease: "power3.out" }, 0.7)
          .to({}, { duration: 0.1 });

        return () => {
          split.revert();
          h1.revert();
          outro.revert();
        };
      });

      // The portrait pans behind the letters with the pointer, so the name reads as a window.
      mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const pan = root.current!.querySelector<HTMLElement>("[data-photo-pan]")!;
        const xTo = gsap.quickTo(pan, "xPercent", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(pan, "yPercent", { duration: 1.2, ease: "power3.out" });
        const gx = gsap.quickTo("[data-glow]", "xPercent", { duration: 1.6, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * -4);
          yTo(ny * -4);
          gx(nx * 20);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hide-until-ready]", { visibility: "visible" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-[100svh] overflow-hidden bg-black">
      {/* The portrait, under everything */}
      <div data-photo className="absolute inset-0 will-change-transform">
        <div data-photo-in className="absolute inset-0">
          <div data-photo-pan className="absolute -inset-[5%]">
          <Image
            src="/omar.webp"
            alt="Omar Abi Farraj in sunglasses and a black beanie under a blue sky"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[50%_44%]"
          />
          </div>
        </div>
      </div>

      {/* Shade for the closing lines */}
      <div
        data-shade
        aria-hidden
        className="invisible absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgb(0_0_0/0.78)_32%,rgb(0_0_0/0.1)_68%,rgb(0_0_0/0.4)_100%)] opacity-0"
      />

      {/* Black plate with white letters; multiply lets the photo through the letters only */}
      <div
        data-mask
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply"
      >
        <p
          data-name
          data-hide-until-ready
          className="-mt-[14vh] select-none text-center text-[50vw] font-[800] leading-[0.78] tracking-[-0.075em] text-white sm:-mt-[8vh] sm:text-[31vw] sm:leading-[0.8] lg:-mt-[12vh] lg:text-[29vw]"
        >
          OM
          <br className="sm:hidden" />
          AR
        </p>
      </div>

      {/* Ambient sky light behind the name; screen blend so it only brightens */}
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute inset-x-[-10%] bottom-[-30%] h-[80%] mix-blend-screen"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(41 151 255 / 0.28), rgb(41 151 255 / 0.06) 55%, transparent 75%)" }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Editorial meta row under the header */}
      <div data-meta-wrap className="absolute inset-x-0 top-[calc(var(--header-h)+28px)] hidden sm:block">
        <div className="wrap">
          <div data-meta className="t-label grid grid-cols-3 pb-4">
            <span>Portfolio, 2026</span>
            <span className="text-center">Full-stack engineer</span>
            <span className="text-right">Laravel, React, Next.js</span>
          </div>
          <span data-meta-rule aria-hidden className="block h-px origin-left bg-line-strong" />
        </div>
      </div>

      {/* Scene progress */}
      <span data-progress aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent motion-reduce:hidden" />

      {/* First screen copy */}
      <div data-intro className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10">
        <div className="wrap grid grid-cols-1 items-end gap-8 sm:grid-cols-12">
          <h1
            data-hero-h1
            data-hide-until-ready
            className="t-metal text-[clamp(26px,3vw,44px)] font-semibold leading-[1.06] tracking-[-0.035em] sm:col-span-8 lg:col-span-6"
          >
            Omar Abi Farraj, full-stack engineer for SaaS, dashboards and online stores.
          </h1>
          <div
            data-intro-fade
            className="flex items-end justify-between gap-6 sm:col-span-4 sm:flex-col sm:items-end lg:col-span-3 lg:col-start-10"
          >
            <p className="t-label flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              <span>
                Beirut, <LocalTime />
              </span>
            </p>
            <p className="t-label flex items-center gap-2" aria-hidden>
              Scroll
              <svg width="10" height="14" viewBox="0 0 10 14" className="animate-bounce">
                <path d="M5 1v12m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>
        </div>
      </div>

      {/* Closing lines over the full photo (the scroll scene brings them in) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-10 motion-reduce:hidden sm:pb-14">
        <div data-outro className="wrap pointer-events-auto flex flex-col items-start gap-6 [&>*]:invisible [&>*]:opacity-0">
          <p className="t-label !text-ink-2">Laravel · React · Next.js · Five years</p>
          <p data-outro-title className="t-display max-w-[13ch] text-ink">
            I build the <span className="t-serif pr-[0.08em] text-accent-2">whole</span> product.
          </p>
          <p className="t-lead max-w-[44ch] !text-ink-2">
            Database, API and interface, written by one engineer, so nothing gets lost between a backend team and a front-end team.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
    </section>
  );
}
