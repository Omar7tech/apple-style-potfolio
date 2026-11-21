"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { archive, contact, person, type ArchiveTag } from "@/lib/content";
import { BrandIcon } from "./brand-icon";
import Reveal from "./reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const filters: { id: ArchiveTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "laravel", label: "Business systems" },
  { id: "react", label: "Web apps" },
  { id: "realtime", label: "Live features" },
  { id: "api", label: "Behind the scenes" },
];

/** A typographic index of more projects, filterable, with a label that follows the pointer. */
export default function Archive() {
  const [filter, setFilter] = useState<ArchiveTag | "all">("all");
  const [hovering, setHovering] = useState(false);
  const rows = filter === "all" ? archive : archive.filter((p) => p.tags.includes(filter));

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  return (
    <section aria-labelledby="archive-title" className="section">
      <div className="wrap">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-label mb-6">More projects</p>
            <h2 id="archive-title" className="t-h2 max-w-[14ch]">
              Twelve more builds <span className="text-faint">from the archive.</span>
            </h2>
          </div>
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={`relative min-h-11 rounded-full px-5 text-[14px] transition-colors duration-300 ${on ? "text-black" : "text-ink-2 hover:text-ink"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="archive-filter"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  {!on && <span className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]" />}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          className="relative mt-14 lg:mt-20"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
          }}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          {/* Label that follows the pointer over the list */}
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy }}
            animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none absolute left-0 top-0 z-10 -ml-[60px] -mt-[60px] hidden size-[120px] place-items-center rounded-full bg-accent text-center text-[13px] font-medium leading-tight text-white [@media(hover:hover)]:grid"
          >
            Open on
            <br />
            GitHub ↗
          </motion.span>

          <motion.ol layout className="border-t border-line">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map((p) => (
                <motion.li
                  key={p.repo}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="border-b border-line"
                >
                  <a
                    href={`${contact.github}/${p.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 transition-[padding,background-color] duration-500 ease-[var(--ease-out)] hover:bg-white/[0.025] sm:py-7 lg:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1.4fr)_auto] lg:gap-x-10 lg:px-2 lg:hover:px-5"
                  >
                    <span className="t-label hidden tabular-nums lg:block">{p.year}</span>
                    <span className="text-[clamp(22px,2.4vw,36px)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink-2 transition-colors duration-500 group-hover:text-ink">
                      {p.name}
                    </span>
                    <span className="col-span-2 max-w-[52ch] text-[16px] leading-relaxed text-muted lg:col-span-1">
                      <span className="t-label mr-2 lg:hidden">{p.year}</span>
                      {p.body}
                    </span>
                    <span className="col-start-2 row-start-1 flex items-center gap-3 lg:col-start-4">
                      <span className="hidden items-center gap-2 sm:flex">
                        {p.stack.map((k) => (
                          <BrandIcon key={k} name={k} size={18} className="opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                        ))}
                      </span>
                      <span className="grid size-10 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)] transition-[transform,background-color,color] duration-500 ease-[var(--ease-out)] group-hover:-rotate-45 group-hover:bg-ink group-hover:text-black">
                        <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
                          <path d="M1 7h11m-4.5-4.5L12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </span>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        </div>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="t-lead">
            {person.publicRepos} projects published on GitHub, from small tools to full systems.
          </p>
          <a href={contact.github} target="_blank" rel="noreferrer" className="btn btn--ghost">
            See all on GitHub
            <svg className="btn__arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
