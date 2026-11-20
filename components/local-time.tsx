"use client";

import { useEffect, useState } from "react";

/** Live time in Beirut. Renders a fixed-width placeholder until mounted to avoid hydration drift. */
export default function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Beirut",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
