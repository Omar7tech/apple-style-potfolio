import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

// Inter with its optical-size axis: large sizes switch to the Display cut, close to SF Pro Display.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
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
