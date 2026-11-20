"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { contact } from "@/lib/content";
import LocalTime from "./local-time";
import Reveal from "./reveal";
import TechText from "./tech-text";

const channels = [
  { label: "Email Omar", href: contact.email, external: false },
  { label: "WhatsApp", href: contact.whatsapp, external: true },
  { label: "GitHub", href: contact.github, external: true },
  { label: "LinkedIn", href: contact.linkedin, external: true },
  { label: "Instagram", href: contact.instagram, external: true },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  // A round arrow follows the pointer across the big call to action.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-cta-text]", { type: "chars", mask: "chars", charsClass: "t-metal" });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: "[data-cta-text]", start: "top 88%", once: true },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-[clamp(112px,16vh,180px)]">
      {/* Blue horizon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-80"
        style={{ background: "radial-gradient(60% 55% at 50% 100%, rgb(41 151 255 / 0.28), transparent 70%)" }}
      />

      <div className="wrap relative">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-label mb-6">Contact</p>
            <h2 id="contact-title" className="t-h2 max-w-[14ch]">
              Tell me what you are <span className="t-serif t-sky pr-[0.06em]">building.</span>
            </h2>
          </div>
          <p className="t-lead max-w-[34ch]">
            Send a few lines about the product and the date it has to go live. I answer every message myself.
          </p>
        </Reveal>

        <a
          href={contact.email}
          className="group relative mt-16 block border-y border-line py-10 lg:mt-24 lg:py-14"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
          }}
        >
          <span
            data-cta-text
            className="t-metal block whitespace-nowrap pb-[0.06em] text-[clamp(56px,11.6vw,196px)] font-bold leading-[0.92] tracking-[-0.065em] transition-[filter] duration-700 group-hover:brightness-125"
          >
            Start a project
          </span>
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 hidden size-28 -ml-14 -mt-14 scale-50 place-items-center rounded-full bg-accent text-white opacity-0 transition-[opacity,scale] duration-500 ease-[var(--ease-out)] group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)]:grid"
          >
            <svg width="28" height="28" viewBox="0 0 14 14">
              <path d="M3 11l8-8M4.5 3H11v6.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </a>

        <ul className="mt-10 flex flex-wrap gap-3">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="btn btn--ghost !min-h-12 !text-[15px]"
              >
                {c.label}
                <svg className="btn__arrow" width="11" height="11" viewBox="0 0 12 12" aria-hidden>
                  <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Interactive signature: hover a letter to see its outline and metrics, drag or click it */}
        <div className="mt-24 h-[clamp(160px,22vw,340px)] text-ink lg:mt-32">
          <TechText
            text="Omar Abi Farraj"
            fontWeight={700}
            fontSize={280}
            letterSpacing={-0.06}
            color="#f5f5f7"
            accentColor="#2997ff"
            reveal="letter"
            intro="metrics"
            introDuration={2.4}
            guides
            specks={14}
            dashLength={5}
            dashGap={3}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Omar Abi Farraj</p>
          <p className="flex items-center gap-2">
            <span className="live-dot" aria-hidden />
            <span>
              Beirut, <LocalTime />
            </span>
          </p>
          <p>Product names and logos are trademarks of their owners.</p>
        </div>
      </div>
    </footer>
  );
}
