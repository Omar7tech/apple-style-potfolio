---
name: motion-effects
description: Apply consistent, restrained appear (entrance) and scroll-reveal effects across a page without overpowering the design. Groups related content, keeps timing calm, adds subtle hover/press feedback, and respects reduced motion. Use when adding or reviewing entrance animations, scroll reveals, stagger, or hover/press feedback on any page or element. Adapted from Framer's Motion skill for this Next.js project (Motion + GSAP).
---

# Effects

Apply smooth, restrained motion. Preserve the design. Page-wide requests cover hero to footer; requests about "this," "here," or a named element stay within that target.

## Instructions

1. Inspect the full requested scope, existing effects, and all breakpoints. For page-wide work, address every eligible content section, not only the initial viewport. Preserve effects that meet these rules; replace conflicting effects rather than layering entrances.

2. Choose non-overlapping entrance groups: related heading, copy, and actions together; separate media and card collections independently. If one container includes all of them, animate either that container or its content groups, never both. Keep navigation, sticky controls, backgrounds, dividers, continuous long-form article text, and footer utility/legal links out of entrance groups. Footer promotional content is eligible.

3. Use tween `cubic-bezier(0.22, 1, 0.36, 1)` and opacity 0 to 1. Hero entrances last 0.8 seconds with no delay. Scroll reveals last 1 second with a 0.1-second delay measured from entering view, not page load. Rule 5 adds stagger offsets to these base delays. Copy, mixed-content groups, and card collections start 12px below rest; standalone media scales 0.98 to 1 without translation. Do not add blur, rotation, horizontal travel, bounce, or exit effects.

4. Start hero entrances on mount. Trigger other groups independently when 15% of the group is visible (threshold 0.15), with replay disabled. For groups taller than the viewport, use threshold 0 so the reveal remains reachable. Never schedule lower sections from page-load delays or reveal the entire page as one group.

5. Reveal each group together. Only for 2–4 sibling visuals or cards communicating steps or progression, animate the siblings instead of their parent, with 0.1 seconds between starts in reading order. Use the same entrance treatment for all siblings. Never stagger long lists, individual words, or related copy and actions.

6. Interaction feedback is separate from entrances: the restriction on nested entrances does not prohibit feedback on a button inside a revealing group. Preserve working hover and press feedback. On buttons and clickable cards without feedback, use scale 1.01 on hover, 0.99 on press, and a 0.25-second tween with the easing from rule 3 and no delay. If scale already drives the element's entrance or another effect, use opacity 0.9 on hover and 0.8 on press instead. Leave inline links and noninteractive elements unscaled.

7. Check each group's parent and visible siblings across breakpoints. Include each visible alternative only where it is shown; do not animate hidden copies. On phone, use 8px instead of 12px travel and remove only stagger offsets, retaining the 0.1-second scroll-reveal delay and the same groups, duration, and easing. Keep media scale unchanged. Preserve layout and prevent scaled feedback from clipping.

8. Reduced-motion preferences override all motion rules: keep content available without nonessential movement or sequencing. If reduced motion cannot be configured or verified, report the limitation rather than claiming compliance.

9. Verify the entire requested scope and every breakpoint for coverage, clipping, overlap, and readability. Preview load, scroll, and interrupted interactions when playback is available; screenshots verify layout, not timing. Report unverified behavior. Completion means all eligible groups were addressed, not that every element moves.

## Implementing in this project (Next.js + Motion)

The rules above come from Framer, which uses built-in effects. Here they are implemented in code. Prefer **Motion** (`motion/react`) for entrances and hover/press feedback; keep GSAP for scroll-driven sequences. Don't animate one element with both libraries.

- Put shared values in one module (e.g. `lib/motion.ts`) and reuse them; don't hard-code timings per component:
  ```ts
  export const EASE = [0.22, 1, 0.36, 1] as const;
  export const hero = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE } };
  export const reveal = { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 1, delay: 0.1, ease: EASE } };
  export const press = { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, transition: { duration: 0.25, ease: EASE } };
  ```
- Media: swap `y: 12` for `scale: 0.98 → 1`. Groups taller than the viewport: `viewport.amount: 0`.
- Stagger (rule 5 only): add `0.1 * index` to the delay; drop it below the `md` breakpoint, and use `y: 8` there.
- Reduced motion: wrap the app in `<MotionConfig reducedMotion="user">` so transforms are skipped. Check that opacity-only fades still leave content visible, and that GSAP code is gated with `gsap.matchMedia()` on `(prefers-reduced-motion: no-preference)`.
- Motion components need `"use client"`. Keep server components as wrappers and animate small client leaf components.
- Avoid hydration flashes: hero content using `initial` renders hidden until JS runs. Keep hero entrances short and never hide content that has no animation attached.
