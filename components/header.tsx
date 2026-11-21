"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, contact } from "@/lib/content";
import Logo from "./logo";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, show on scroll up, like Apple's product pages.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is on screen for the active pill.
  useEffect(() => {
    const els = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(null),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // Lock scroll while the phone menu is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
        initial={false}
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="wrap">
          <div
            className={`mx-auto flex h-14 items-center justify-between rounded-full pl-5 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
              scrolled || open ? "glass" : ""
            }`}
          >
            <a
              href="#top"
              className="flex min-h-11 items-center"
              aria-label="Omar Builds, back to top"
              onClick={() => setOpen(false)}
            >
              <Logo />
            </a>

            <nav aria-label="Main" className="hidden items-center md:flex">
              <ul className="flex items-center">
                {nav.map((item) => (
                  <li key={item.id} className="relative">
                    <a
                      href={`#${item.id}`}
                      className={`relative z-10 block rounded-full px-4 py-2 text-[14px] transition-colors duration-300 ${
                        active === item.id ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                      aria-current={active === item.id ? "true" : undefined}
                    >
                      {item.label}
                    </a>
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a href={contact.email} className="btn hidden !min-h-10 !px-5 !text-[14px] sm:inline-flex">
                Start a project
              </a>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full md:hidden"
                aria-expanded={open}
                aria-controls="phone-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="relative block h-3 w-5" aria-hidden>
                  <motion.span
                    className="absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-ink"
                    animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-ink"
                    animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="phone-menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <nav aria-label="Phone">
              <ul className="flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.05 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-[44px] font-semibold leading-none tracking-[-0.045em]"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            >
              <a href={contact.email} className="btn w-full" onClick={() => setOpen(false)}>
                Start a project
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
