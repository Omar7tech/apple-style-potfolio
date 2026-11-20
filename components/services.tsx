"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { services } from "@/lib/content";
import { icons } from "@/lib/icons";
import { BrandIcon } from "./brand-icon";
import Reveal from "./reveal";
import Spotlight from "./spotlight";

const words = ["Billing.", "Dashboards.", "Real-time.", "Storefronts."];
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/** A plan switcher that changes plan every three seconds. */
function PlanSwitch() {
  const plans = ["Starter", "Pro", "Team"];
  const [on, setOn] = useState(1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setOn((v) => (v + 1) % plans.length), 3000);
    return () => window.clearInterval(id);
  }, [plans.length]);
  return (
    <div aria-hidden className="inline-flex rounded-full bg-white/[0.06] p-1 text-[13px] shadow-[inset_0_0_0_0.5px_var(--line-strong)]">
      {plans.map((p, i) => (
        <span key={p} className={`relative rounded-full px-4 py-1.5 transition-colors duration-500 ${i === on ? "text-black" : "text-muted"}`}>
          {i === on && (
            <motion.span layoutId="plan" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
          )}
          <span className="relative">{p}</span>
        </span>
      ))}
    </div>
  );
}

/** Three presence dots, as a live app shows who is online. */
function Presence() {
  return (
    <div aria-hidden className="flex items-center gap-3 text-[13px] text-muted">
      <div className="flex -space-x-2">
        {["#2997ff", "#30d158", "#ff9f0a"].map((c) => (
          <span key={c} className="size-7 rounded-full ring-2 ring-[var(--surface)]" style={{ background: `linear-gradient(135deg, ${c}, ${c}66)` }} />
        ))}
      </div>
      <span className="flex items-center gap-2">
        <span className="live-dot" /> 3 online now
      </span>
    </div>
  );
}

const extras = [<PlanSwitch key="a" />, null, <Presence key="c" />, null];

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="wrap">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label mb-6">Services</p>
            <h2 id="services-title" className="t-display">
              Four kinds of project <span className="text-faint">I have shipped before.</span>
            </h2>
          </div>
          <p className="t-lead lg:col-span-4">
            Each comes with the backend, the front end and the deploy, so there is no hand-off between people.
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-4 lg:mt-24 lg:grid-cols-12">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} index={i % 2} className={`h-full ${spans[i]}`}>
              <Spotlight className="flex h-full min-h-[380px] flex-col justify-between gap-12 p-7 [container-type:inline-size] sm:p-10 lg:min-h-[460px]">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center">
                    {s.stack.map((k, j) => (
                      <span
                        key={k}
                        title={icons[k].name}
                        className="grid size-12 place-items-center rounded-[14px] bg-surface-2 shadow-[inset_0_0_0_0.5px_var(--line-strong),0_8px_20px_-10px_rgb(0_0_0/0.8)]"
                        style={{ marginLeft: j ? -8 : 0, zIndex: 10 - j }}
                      >
                        <BrandIcon name={k} size={22} />
                      </span>
                    ))}
                  </div>
                  {extras[i]}
                </div>
                <div>
                  <p aria-hidden className="t-metal pb-[0.06em] text-[clamp(44px,15.5cqw,112px)] font-bold leading-[0.9] tracking-[-0.06em]">
                    {words[i]}
                  </p>
                  <h3 className="t-h3 mt-6">{s.title}</h3>
                  <p className="mt-2 max-w-[42ch] text-[17px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
