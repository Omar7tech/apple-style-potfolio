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
    kind: "Free web app",
    summary:
      "Free tools for marketers: make WhatsApp chat links, QR codes and digital business cards in seconds. It installs on a phone like an app, and nothing leaves your device.",
    stack: ["nextjs", "typescript", "tailwindcss", "gsap"],
    link: { href: "https://linkflow-ten.vercel.app", label: "Open TM Tools" },
    window: "tmtools.app / whatsapp-link",
  },
  {
    id: "saas",
    name: "Subscription app starter",
    kind: "Ready-made foundation",
    summary:
      "Everything a subscription business needs on day one: sign-up, monthly plans, card payments with Stripe and a credit balance for every customer.",
    stack: ["laravel", "react", "typescript", "stripe"],
    link: {
      href: "https://github.com/Omar7tech/Laravel-React-Stripe-SASS",
      label: "See how it's built",
    },
    window: "app / billing",
  },
  {
    id: "chat",
    name: "Private rooms",
    kind: "Private chat",
    summary:
      "A private chat room for two people that deletes itself after 10 minutes. Messages appear instantly and are encrypted, so nobody else can read them.",
    stack: ["nextjs", "typescript", "redis", "tailwindcss"],
    link: {
      href: "https://nextjs16-elysiajs-private-room-real.vercel.app",
      label: "Open a room",
    },
    window: "room / k7f-29q",
  },
  {
    id: "hrms",
    name: "Staff management system",
    kind: "Internal business tool",
    summary:
      "One place for employees, work schedules, job interviews and time off, with separate access for managers and charts for the monthly report.",
    stack: ["laravel", "php", "mysql", "livewire"],
    link: { href: "https://github.com/Omar7tech/HRMS", label: "See how it's built" },
    window: "hrms / employees",
  },
];

export const services: {
  title: string;
  body: string;
  stack: IconKey[];
}[] = [
  {
    title: "Builds subscription apps",
    body: "Your own online service with sign-up, monthly plans and card payments, plus a dashboard to manage your customers.",
    stack: ["laravel", "react", "stripe", "postgresql"],
  },
  {
    title: "Builds custom business systems",
    body: "Swap spreadsheets for one system that tracks staff, stock, orders or bookings, with reports you can download.",
    stack: ["laravel", "livewire", "mysql", "php"],
  },
  {
    title: "Adds live features",
    body: "Chat, instant notifications and live order updates, so customers see changes the moment they happen.",
    stack: ["redis", "rabbitmq", "nodejs", "docker"],
  },
  {
    title: "Builds online stores and websites",
    body: "Shopify stores and fast, polished websites that open quickly and look right on every phone.",
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
    body: "You get a written plan of every screen and feature, with the price, before any work starts.",
  },
  {
    title: "Build",
    body: "You get a private link to try the work as it is built, and you tell me what to change.",
  },
  {
    title: "Launch",
    body: "I put it live, hand over everything you own, and stay on to fix anything after launch.",
  },
];

export type ArchiveTag = "laravel" | "react" | "realtime" | "api";

/** More public projects from github.com/Omar7tech, described from their own READMEs. */
export const archive: {
  year: number;
  name: string;
  body: string;
  stack: IconKey[];
  tags: ArchiveTag[];
  repo: string;
}[] = [
  {
    year: 2026,
    name: "AI floor-plan renderer",
    body: "Upload a flat floor plan and AI turns it into a realistic 3D picture of the space.",
    stack: ["nextjs", "typescript", "react"],
    tags: ["react"],
    repo: "AI-powered-architectural-visualization-Nextjs",
  },
  {
    year: 2026,
    name: "Safe shared editing",
    body: "When two people edit the same record at once, nobody's changes get lost.",
    stack: ["laravel", "php", "mysql"],
    tags: ["laravel", "api"],
    repo: "Conflict_Resolution_API",
  },
  {
    year: 2026,
    name: "Going live on Hostinger",
    body: "A step-by-step guide to putting a web app live on affordable hosting, written for a team to follow.",
    stack: ["laravel", "php", "mysql"],
    tags: ["laravel"],
    repo: "Laravel-Production-Deployment-Guide-Hostinger-PHP-8.4-",
  },
  {
    year: 2026,
    name: "Reliable background tasks",
    body: "Emails and orders wait safely in line and still go through, even after a server restart.",
    stack: ["laravel", "rabbitmq", "docker"],
    tags: ["laravel", "realtime", "api"],
    repo: "Laravel-Rabbitmq-demo",
  },
  {
    year: 2025,
    name: "Dev Hub",
    body: "A blogging site for developers where people sign up, write posts and share them.",
    stack: ["laravel", "react", "tailwindcss"],
    tags: ["laravel", "react", "api"],
    repo: "Laravel12-React-Router-v7-Blogs-Auth-Crud-API",
  },
  {
    year: 2025,
    name: "Multi-vendor marketplace",
    body: "An online marketplace where many sellers each run their own shop on one website.",
    stack: ["laravel", "react", "typescript"],
    tags: ["laravel", "react"],
    repo: "Multi-Vendor-E-Commerce-Marketplace-with-Laravel-React",
  },
  {
    year: 2025,
    name: "Instant sync demo",
    body: "Flip a switch in one browser and it changes in every other browser at the same moment.",
    stack: ["laravel", "livewire", "php"],
    tags: ["laravel", "realtime"],
    repo: "Realtime_Laravel_Reverb_Train",
  },
  {
    year: 2025,
    name: "DevReads",
    body: "An online library of programming books to read and download, with a count of every download.",
    stack: ["laravel", "livewire", "tailwindcss"],
    tags: ["laravel"],
    repo: "DevReads",
  },
  {
    year: 2025,
    name: "Private photo storage",
    body: "Each user gets a private space for their photos, and deleted files can be brought back.",
    stack: ["laravel", "php", "mysql"],
    tags: ["laravel"],
    repo: "educational_image_file_storage",
  },
  {
    year: 2024,
    name: "Accounts and sign-in starter",
    body: "Ready-made sign-up, login and account pages for new web apps. My most-starred project.",
    stack: ["laravel", "react", "php"],
    tags: ["laravel", "react", "api"],
    repo: "React-Laravel-Auth-Crud",
  },
  {
    year: 2024,
    name: "Pixel Positions",
    body: "A job board where companies post openings and people search them by skill.",
    stack: ["laravel", "tailwindcss", "php"],
    tags: ["laravel"],
    repo: "Pixel-Positions",
  },
  {
    year: 2024,
    name: "Restaurant admin",
    body: "A dashboard where a restaurant manages its menu, categories and settings, with sales charts.",
    stack: ["laravel", "tailwindcss", "mysql"],
    tags: ["laravel"],
    repo: "Resturant_menu_advanced",
  },
];
