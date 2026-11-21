"use client";

import { motion } from "motion/react";
import { icons, type IconKey } from "@/lib/icons";
import { BrandIcon } from "./brand-icon";
import Reveal from "./reveal";
import Spotlight from "./spotlight";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Tools grouped by what they do for the client, in words a non-developer understands. */
const groups: { title: string; body: string; tools: IconKey[]; span: string }[] = [
  {
    title: "Websites and apps",
    body: "What your customers see and tap: fast pages that work on every phone.",
    tools: ["nextjs", "react", "tailwindcss", "typescript", "gsap"],
    span: "lg:col-span-7",
  },
  {
    title: "Business systems",
    body: "The engine behind the screens: accounts, orders, bookings and admin panels.",
    tools: ["laravel", "php", "livewire", "inertia"],
    span: "lg:col-span-5",
  },
  {
    title: "Your data",
    body: "Where every customer, order and file is stored safely.",
    tools: ["postgresql", "mysql", "redis"],
    span: "lg:col-span-4",
  },
  {
    title: "Payments and stores",
    body: "Card payments, subscriptions and online shops.",
    tools: ["stripe", "shopify"],
    span: "lg:col-span-4",
  },
  {
    title: "Always running",
    body: "Background tasks and setups that keep your app up and quick.",
    tools: ["docker", "rabbitmq", "nodejs"],
    span: "lg:col-span-4",
  },
];

function ToolIcon({ name, index }: { name: IconKey; index: number }) {
  const icon = icons[name];
  const glow = icon.hex === "#000000" ? "#ffffff" : icon.hex;
  return (
    <motion.li
      className="group/tool flex w-[72px] flex-col items-center gap-2.5"
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: 0.15 + index * 0.06, ease: EASE }}
    >
      <span className="relative grid size-16 place-items-center rounded-[18px] bg-surface-2 shadow-[inset_0_0_0_0.5px_var(--line-strong)] transition-transform duration-500 ease-[var(--ease-out)] group-hover/tool:-translate-y-1">
        <span
          aria-hidden
          className="absolute inset-0 rounded-[18px] opacity-0 transition-opacity duration-500 group-hover/tool:opacity-100"
          style={{
            boxShadow: `0 14px 34px -12px ${glow}`,
            background: `radial-gradient(70% 70% at 50% 0%, ${glow}22, transparent)`,
          }}
        />
        <BrandIcon name={name} size={30} className="relative" />
      </span>
      <span className="text-center text-[12.5px] leading-tight text-muted transition-colors duration-300 group-hover/tool:text-ink">
        {icon.name}
      </span>
    </motion.li>
  );
}

export default function Toolkit() {
  return (
    <section aria-labelledby="tools-title" className="section">
      <div className="wrap">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-label mb-6">Toolkit</p>
            <h2 id="tools-title" className="t-h2">
              The tools behind <span className="text-faint">every build.</span>
            </h2>
          </div>
          <p className="t-lead lg:col-span-4 lg:col-start-9">
            Proven tools used by companies of every size. You never need to touch them; they keep your app fast and secure.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {groups.map((g, i) => (
            <Reveal as="li" key={g.title} index={i % 2} className={`h-full ${g.span}`}>
              <Spotlight className="flex h-full min-h-[300px] flex-col justify-between gap-10 p-7 sm:p-9">
                <ul className="flex flex-wrap gap-x-3 gap-y-5" aria-label={`${g.title} tools`}>
                  {g.tools.map((t, j) => (
                    <ToolIcon key={t} name={t} index={j} />
                  ))}
                </ul>
                <div>
                  <h3 className="t-h3">{g.title}</h3>
                  <p className="mt-2 max-w-[40ch] text-[16px] leading-relaxed text-muted">{g.body}</p>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
