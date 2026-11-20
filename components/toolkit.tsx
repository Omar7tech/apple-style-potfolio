"use client";

import { useState } from "react";
import { icons, type IconKey } from "@/lib/icons";
import { BrandIcon } from "./brand-icon";
import Reveal from "./reveal";

const rowA: IconKey[] = ["laravel", "react", "nextjs", "typescript", "tailwindcss", "livewire", "inertia", "php"];
const rowB: IconKey[] = ["postgresql", "mysql", "redis", "rabbitmq", "stripe", "shopify", "docker", "nodejs", "gsap"];

function Row({ items, dir, outline }: { items: IconKey[]; dir: "l" | "r"; outline?: boolean }) {
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className="marquee-track" data-dir={dir} aria-hidden>
        {list.map((k, i) => (
          <li key={i} className="group flex shrink-0 items-center gap-[0.35em] px-[0.45em] text-[clamp(48px,7.5vw,128px)] font-bold leading-[1.05] tracking-[-0.055em]">
            <BrandIcon name={k} size={64} className="size-[0.62em] shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-110" />
            <span
              className={
                outline
                  ? "text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--faint)] group-hover:text-ink group-hover:[-webkit-text-stroke-color:transparent]"
                  : "text-surface-3 transition-colors duration-500 group-hover:text-ink"
              }
            >
              {icons[k].name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Toolkit() {
  const [paused, setPaused] = useState(false);
  const all = [...rowA, ...rowB].map((k) => icons[k].name).join(", ");

  return (
    <section aria-labelledby="tools-title" className="section overflow-hidden" data-paused={paused}>
      <div className="wrap">
        <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-label mb-6">Toolkit</p>
            <h2 id="tools-title" className="t-h2 max-w-[16ch]">
              The tools behind <span className="text-faint">every build.</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="btn btn--ghost !min-h-11 self-start !px-5 !text-[14px] sm:self-auto"
          >
            {paused ? "Play the list" : "Pause the list"}
          </button>
        </Reveal>
        <p className="sr-only">{all}</p>
      </div>
      <div className="mt-16 flex flex-col gap-2 lg:mt-20">
        <Row items={rowA} dir="l" />
        <Row items={rowB} dir="r" outline />
      </div>
    </section>
  );
}
