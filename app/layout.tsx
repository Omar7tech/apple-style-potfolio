import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

// Inter with its optical-size axis: large sizes switch to the Display cut, close to SF Pro Display.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Malinton: the display face for big headings, numbers and accent words. Body text stays in Inter.
const malinton = localFont({
  src: [
    { path: "./fonts/Malinton-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Malinton-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Malinton-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Malinton-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Malinton-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Malinton-ExtBd.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Malinton-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-malinton",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "Omar Builds — Websites and business software by Omar Abi Farraj";
const description =
  "Omar Abi Farraj builds websites, custom business software and online stores. Five years of experience, based in Beirut, working with clients anywhere.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Omar Abi Farraj", url: "https://github.com/Omar7tech" }],
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/omar.webp", width: 1254, height: 1254, alt: "Portrait of Omar Abi Farraj" }],
    siteName: "Omar Builds",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/omar.webp"] },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${malinton.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Mark JS early so hero lines can start hidden without a flash; no-JS keeps them visible. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');history.scrollRestoration='manual'" }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
