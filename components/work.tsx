"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects } from "@/lib/content";
import { ProjectMock } from "./mocks";
import { StackRow } from "./brand-icon";
import Reveal from "./reveal";

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/link inline-flex min-h-11 items-center gap-1.5 text-[16px] font-medium text-accent"
    >
      <span className="link-draw">{label}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
        <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function ProjectText({ p, i }: { p: (typeof projects)[number]; i: number }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="t-label">
        0{i + 1} / 0{projects.length} · {p.kind}
      </p>
      <h3 className="t-h2">{p.name}</h3>
      <p className="max-w-[40ch] text-[17px] leading-relaxed text-muted">{p.summary}</p>
      <StackRow stack={p.stack} />
      <ProjectLink {...p.link} />
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Horizontal gallery where there is room; phones and tablets scroll the list normally.
      mm.add("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const move = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-work-stage]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            snap: {
              snapTo: 1 / (projects.length - 1),
              duration: { min: 0.3, max: 0.8 },
              delay: 0.05,
              ease: "power3.inOut",
            },
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set("[data-work-progress]", { scaleX: self.progress }),
          },
        });

        // Each preview settles from slightly small to full size as it reaches the middle.
        gsap.utils.toArray<HTMLElement>("[data-panel-mock]").forEach((m, i) => {
          if (i === 0) return;
          gsap.fromTo(
            m,
            { scale: 0.88, opacity: 0.35 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: m.closest("article"),
                containerAnimation: move,
                start: "left 100%",
                end: "left 15%",
                scrub: true,
              },
            },
          );
        });
        ScrollTrigger.refresh();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative">
      <div className="wrap pt-[clamp(112px,16vh,180px)]">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label mb-6">Selected work, 2024 to 2026</p>
            <h2 id="work-title" className="t-display">
              Products built <span className="t-serif t-sky pr-[0.06em]">end to end.</span>
            </h2>
          </div>
          <p className="t-lead lg:col-span-4">
            Four of the apps on my GitHub, each with its database, API and interface written by me.
          </p>
        </Reveal>
      </div>

      {/* Desktop: pinned horizontal track */}
      <div data-work-stage className="relative hidden h-[100svh] overflow-hidden lg:block motion-reduce:hidden">
        <div ref={track} className="flex h-full w-max items-center">
          {projects.map((p, i) => (
            <article key={p.id} className="h-full w-screen shrink-0">
              <div className="wrap grid h-full grid-cols-12 items-center gap-10 py-24">
              <div className="col-span-4">
                <ProjectText p={p} i={i} />
              </div>
              <div className="col-span-8 h-[min(620px,68svh)]">
                <div data-panel-mock className="relative h-full will-change-transform">
                  <div
                    aria-hidden
                    className="absolute -inset-16 -z-10 opacity-70 blur-3xl"
                    style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(41 151 255 / 0.22), transparent)" }}
                  />
                  <ProjectMock id={p.id} />
                </div>
              </div>
              </div>
            </article>
          ))}
        </div>
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-8">
          <div className="h-px w-full bg-line">
            <div data-work-progress className="h-px origin-left scale-x-0 bg-ink" />
          </div>
        </div>
      </div>

      {/* Phone, tablet and reduced motion: stacked */}
      <div className="wrap pb-[clamp(112px,16vh,180px)] pt-16 lg:hidden motion-reduce:lg:block">
        <ol className="flex flex-col gap-20">
          {projects.map((p, i) => (
            <li key={p.id}>
              <Reveal className="flex flex-col gap-8">
                <div className="h-[360px] sm:h-[480px]">
                  <ProjectMock id={p.id} />
                </div>
                <ProjectText p={p} i={i} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
