import type { IconKey } from "./icons";

/** Every fact on the page comes from Omar's public GitHub profile and repositories. */
export const person = {
  name: "Omar Abi Farraj",
  role: "Full-stack engineer",
  city: "Beirut",
  years: "Five years",
  publicRepos: 107,
  timeZone: "Asia/Beirut",
};

export const contact = {
  email:
    "mailto:omar.7tech@gmail.com?subject=" + encodeURIComponent("New project for Omar"),
  whatsapp: "https://wa.me/96171387946",
  github: "https://github.com/Omar7tech",
  linkedin: "https://shorturl.at/FRLxn",
  instagram: "https://www.instagram.com/omar.af7",
};

export const nav = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
] as const;

export type ProjectId = "tmtools" | "saas" | "chat" | "hrms";

export type Project = {
  id: ProjectId;
  name: string;
  kind: string;
  summary: string;
  stack: IconKey[];
  link: { href: string; label: string };
  window: string;
};

export const projects: Project[] = [
  {
    id: "tmtools",
    name: "TM Tools",
    kind: "Web app, installable PWA",
    summary:
      "Free browser tools for marketers: WhatsApp links, QR codes, vCards and UTM URLs. Everything runs on the device and nothing is uploaded.",
    stack: ["nextjs", "typescript", "tailwindcss", "gsap"],
    link: { href: "https://linkflow-ten.vercel.app", label: "Open TM Tools" },
    window: "tmtools.app / whatsapp-link",
  },
  {
    id: "saas",
    name: "SaaS starter with Stripe",
    kind: "Open-source starter kit",
    summary:
      "Laravel 12 and React 19 with sign-in, Stripe subscriptions and a credit system, so a new SaaS starts with billing that already works.",
    stack: ["laravel", "react", "typescript", "stripe"],
    link: {
      href: "https://github.com/Omar7tech/Laravel-React-Stripe-SASS",
      label: "Read the code",
    },
    window: "app / billing",
  },
  {
    id: "chat",
    name: "Private rooms",
    kind: "Real-time chat",
    summary:
      "A two-person chat room that deletes itself after 10 minutes. Messages arrive live through Redis and are stored encrypted with AES-256.",
    stack: ["nextjs", "typescript", "redis", "tailwindcss"],
    link: {
      href: "https://nextjs16-elysiajs-private-room-real.vercel.app",
      label: "Open a room",
    },
    window: "room / k7f-29q",
  },
  {
    id: "hrms",
    name: "HR management system",
    kind: "Internal tool",
    summary:
      "Employees, schedules, interviews and leave in one Laravel app, with admin and moderator roles and charts for the numbers HR reports on.",
    stack: ["laravel", "php", "mysql", "livewire"],
    link: { href: "https://github.com/Omar7tech/HRMS", label: "Read the code" },
    window: "hrms / employees",
  },
];

export const services: {
  title: string;
  body: string;
  stack: IconKey[];
}[] = [
  {
    title: "Builds SaaS products with billing",
    body: "Accounts, teams, subscriptions and usage credits on Stripe, with the admin side to run it.",
    stack: ["laravel", "react", "stripe", "postgresql"],
  },
  {
    title: "Builds dashboards and internal tools",
    body: "Staff, stock, orders or bookings in one place, with roles, reports and exports.",
    stack: ["laravel", "livewire", "mysql", "php"],
  },
  {
    title: "Adds real-time features",
    body: "Live chat, status updates and notifications over websockets, with queues for the slow work.",
    stack: ["redis", "rabbitmq", "nodejs", "docker"],
  },
  {
    title: "Ships Shopify stores and fast sites",
    body: "Shopify themes and Next.js sites that load fast and move well on a phone.",
    stack: ["shopify", "nextjs", "tailwindcss", "gsap"],
  },
];

export const steps = [
  {
    title: "Call",
    body: "We talk through what the product has to do, who uses it and when it has to be live.",
  },
  {
    title: "Plan",
    body: "You get a written scope with screens, data and a price before any code is written.",
  },
  {
    title: "Build",
    body: "Work ships to a preview link as it is done, so you can click through it and comment.",
  },
  {
    title: "Launch",
    body: "I deploy it, hand over the code and access, and stay on for fixes after launch.",
  },
];
