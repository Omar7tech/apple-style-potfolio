"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { person } from "@/lib/content";

// Words wrapped in * light up in the accent colour.
const text =
  "I build the software behind a business: the *website* *your* *customers* *see* and the *system* *your* *team* *runs* *on,* for orders, bookings and payments. You deal with one person from the first call to launch day.";

const numbers = [
  { value: 5, suffix: "", label: "years building websites and apps" },
  { value: person.publicRepos, suffix: "", label: "projects published on GitHub" },
  { value: 4, suffix: "", label: "kinds of project, from stores to booking systems" },
  { value: 1, suffix: "", label: "person from first call to launch" },
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");
        ScrollTrigger.create({
          trigger: "[data-read]",
          start: "top 78%",
          end: "bottom 42%",
          scrub: true,
          onUpdate: (self) => {
            const lit = Math.round(self.progress * words.length);
            words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
          },
        });

        // Numbers count up once, as Apple's spec pages do.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el, i) => {
          const end = Number(el.dataset.count);
          const state = { v: 0 };
          gsap.to(state, {
            v: end,
            duration: 1.6 + Math.min(end, 100) / 200,
            delay: i * 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-numbers]", start: "top 80%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(state.v))),
          });
        });
        gsap.from("[data-num-cell]", {
          y: 12,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-numbers]", start: "top 80%", once: true },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-word]").forEach((w) => w.classList.add("is-lit"));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="section">
      <div className="wrap">
        <h2 id="about-title" className="t-label mb-10">
          About Omar
        </h2>
        <p
          data-read
          className="max-w-[22ch] text-[clamp(34px,5.4vw,84px)] font-semibold leading-[1.02] tracking-[-0.045em] sm:max-w-[24ch]"
        >
          {text.split(" ").map((w, i) => {
            const accent = w.includes("*");
            return (
              <span key={i} data-word className={`read-word ${accent ? "is-accent" : ""}`}>
                {w.replaceAll("*", "")}{" "}
              </span>
            );
          })}
        </p>

        <dl data-numbers className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 lg:mt-36 lg:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} data-num-cell className="flex flex-col-reverse justify-end">
              <dt className="mt-4 max-w-[18ch] text-[17px] leading-snug text-muted">{n.label}</dt>
              <dd className="font-display t-metal pb-[0.04em] text-[clamp(64px,8vw,128px)] leading-[0.95] tracking-[-0.03em] tabular-nums">
                <span data-count={n.value}>{n.value}</span>
                {n.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
