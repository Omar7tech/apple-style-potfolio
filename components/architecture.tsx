"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BrandIcon } from "./brand-icon";
import Reveal from "./reveal";
import type { IconKey } from "@/lib/icons";

type Node = { id: string; label: string; sub: string; icons: IconKey[]; x: number; y: number };

// Coordinates in a 1000 x 460 box.
const nodes: Node[] = [
  { id: "web", label: "Your website", sub: "What customers use", icons: ["nextjs", "react"], x: 140, y: 230 },
  { id: "api", label: "Your system", sub: "Your business rules", icons: ["laravel", "nodejs"], x: 480, y: 230 },
  { id: "db", label: "Your data", sub: "Stored safely", icons: ["postgresql", "mysql"], x: 850, y: 70 },
  { id: "queue", label: "Automatic tasks", sub: "Emails and reminders", icons: ["redis", "rabbitmq"], x: 850, y: 230 },
  { id: "pay", label: "Payments", sub: "Cards, through Stripe", icons: ["stripe"], x: 850, y: 390 },
];

const edges: [string, string][] = [
  ["web", "api"],
  ["api", "db"],
  ["api", "queue"],
  ["api", "pay"],
];

function pathFor(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x + 70} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 70} ${b.y}`;
}

const facts = [
  { title: "Mistakes are caught early", body: "Every form checks what people type, so wrong or broken details never reach your records." },
  { title: "Busy days don't slow it down", body: "Emails, reports and payment updates run in the background and try again if something fails." },
  { title: "Hosted where it suits you", body: "On a fast cloud host or your own server, with written steps your team can follow." },
];

export default function Architecture() {
  const root = useRef<HTMLElement>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<SVGPathElement>("[data-edge]");
        lines.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-diagram]", start: "top 70%", once: true },
          defaults: { ease: "expo.out" },
        });
        tl.from("[data-node]", { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.08 })
          .to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: "power2.inOut" }, 0.25)
          .from("[data-pulse]", { autoAlpha: 0, duration: 0.4 }, 1.2);

        // Requests travel along the lines, one cycle every 3 seconds.
        gsap.utils.toArray<SVGCircleElement>("[data-pulse]").forEach((dot, i) => {
          const path = lines[i];
          if (!path) return;
          const len = path.getTotalLength();
          const state = { t: 0 };
          gsap.to(state, {
            t: 1,
            duration: 3,
            delay: 1.4 + i * 0.35,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
              const pt = path.getPointAtLength(state.t * len);
              dot.setAttribute("cx", String(pt.x));
              dot.setAttribute("cy", String(pt.y));
              dot.setAttribute("opacity", String(Math.sin(state.t * Math.PI)));
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="arch-title" className="section overflow-hidden">
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-label mb-5">What sits behind your app</p>
            <h2 id="arch-title" className="t-h2">
              One system, <span className="t-serif text-accent">designed</span> before it is coded.
            </h2>
          </div>
          <p className="t-lead lg:col-span-4 lg:col-start-9">
            The website is only the part people see. Behind it, one system keeps your data safe, sends the emails and takes the payments.
          </p>
        </Reveal>

        <div data-diagram className="relative mt-14 lg:mt-20">
          {/* Desktop and tablet: the drawn diagram */}
          <div className="relative hidden aspect-[1000/460] w-full md:block">
            <svg viewBox="0 0 1000 460" className="absolute inset-0 size-full" aria-hidden>
              <defs>
                <linearGradient id="edge" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="800" y2="0">
                  <stop offset="0" stopColor="rgb(255 255 255 / 0.15)" />
                  <stop offset="1" stopColor="rgb(110 165 255 / 0.7)" />
                </linearGradient>
              </defs>
              {edges.map(([a, b]) => (
                <path key={`${a}-${b}`} data-edge d={pathFor(byId[a], byId[b])} stroke="url(#edge)" strokeWidth="1.5" fill="none" />
              ))}
              {edges.map(([a, b]) => (
                <circle key={`p-${a}-${b}`} data-pulse r="4" fill="#9cc2ff" opacity="0" cx={byId[a].x + 70} cy={byId[a].y} />
              ))}
            </svg>
            {nodes.map((n) => (
              <div
                key={n.id}
                data-node
                className="absolute flex w-[16%] min-w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-[20px] bg-surface-2 p-4 shadow-[inset_0_0_0_0.5px_var(--line-strong)]"
                style={{ left: `${n.x / 10}%`, top: `${(n.y / 460) * 100}%` }}
              >
                <div className="flex gap-1.5">
                  {n.icons.map((k) => (
                    <span key={k} className="grid size-9 place-items-center rounded-[10px] bg-white">
                      <BrandIcon name={k} size={20} className="text-black" />
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[16px] font-semibold tracking-[-0.02em]">{n.label}</p>
                  <p className="text-[13px] text-muted">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Phone: the same system as a vertical list */}
          <ol className="flex flex-col gap-3 md:hidden">
            {nodes.map((n, i) => (
              <li key={n.id} className="flex items-center gap-4 rounded-[20px] bg-surface-2 p-4 shadow-[inset_0_0_0_0.5px_var(--line-strong)]" style={{ marginLeft: i > 1 ? 24 : 0 }}>
                <div className="flex gap-1.5">
                  {n.icons.map((k) => (
                    <span key={k} className="grid size-9 place-items-center rounded-[10px] bg-white">
                      <BrandIcon name={k} size={20} className="text-black" />
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[16px] font-semibold tracking-[-0.02em]">{n.label}</p>
                  <p className="text-[13px] text-muted">{n.sub}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-3 lg:mt-20">
          {facts.map((f, i) => (
            <Reveal as="li" key={f.title} index={i}>
              <h3 className="text-[19px] font-semibold tracking-[-0.022em]">{f.title}</h3>
              <p className="mt-2 max-w-[36ch] text-[16px] leading-relaxed text-muted">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
