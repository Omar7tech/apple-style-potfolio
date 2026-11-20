"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/** The page's one easing curve, also used by Motion and CSS. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const GSAP_EASE = "power4.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
