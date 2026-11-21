/**
 * Live-HTML previews of each project, drawn from what the repositories do.
 * Text inside them is UI, not page copy.
 */
import type { ProjectId } from "@/lib/content";

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="app-frame flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.08] bg-[#2a2a2c] px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center rounded-md bg-white/[0.06] px-3 font-mono text-[11px] text-[#98989d]">
          <span className="truncate">{title}</span>
        </div>
        <span className="w-[52px]" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#1c1c1e] text-[#f5f5f7]">{children}</div>
    </div>
  );
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="1.6" />
      <rect x="1" y="1" width="5" height="5" rx="1.1" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" rx="0.7" />
    </g>
  );
}

/* Deterministic QR-like pattern so the server and client render the same grid. */
function QrGrid() {
  const n = 21;
  const cells: React.ReactNode[] = [];
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      const v = (x * 73 + y * 151 + x * y * 7) % 11;
      if (v < 5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="size-full" aria-hidden>
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fff" rx="1" />
      <g fill="#111">
        {cells}
        <Finder x={0} y={0} />
        <Finder x={n - 7} y={0} />
        <Finder x={0} y={n - 7} />
      </g>
    </svg>
  );
}

function TmTools() {
  return (
    <Chrome title="tmtools.app/whatsapp-link">
      <div className="grid h-full grid-cols-[150px_1fr] text-[13px]">
        <aside className="hidden flex-col gap-0.5 border-r border-white/[0.08] bg-[#232325] p-3 sm:flex">
          <p className="mb-2 px-2 text-[11px] font-semibold tracking-[-0.01em]">
            TM <span className="text-[#30d158]">TOOLS</span>
          </p>
          {["WhatsApp link", "QR code", "vCard", "UTM builder", "Palette", "Favicon"].map((t, i) => (
            <span
              key={t}
              className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-[#30d158]/15 font-medium text-[#30d158]" : "text-[#98989d]"}`}
            >
              {t}
            </span>
          ))}
        </aside>
        <div className="col-span-2 grid gap-4 p-4 sm:col-span-1 sm:grid-cols-[1fr_180px] sm:p-5">
          <div className="flex flex-col gap-3">
            <p className="text-[17px] font-semibold tracking-[-0.02em]">WhatsApp link</p>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-[#98989d]">Phone number</span>
              <span className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[12px]">+961 ·· ··· ···</span>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-[#98989d]">First message</span>
              <span className="rounded-lg border border-white/10 px-3 py-2 leading-snug">
                Hi, I&apos;d like to book a table for Friday.
                <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-[#30d158]" />
              </span>
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-[#30d158]/10 px-3 py-2 font-mono text-[11px] text-[#30d158]">
              <span className="truncate">wa.me/961…?text=Hi%2C%20I%27d%20like</span>
              <span className="ml-auto shrink-0 rounded-md bg-[#30d158] px-2 py-1 text-black font-sans text-[11px] font-medium text-white">
                Copy
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="text-[11px] text-[#98989d]">Saved on this device</span>
              {[
                ["Table bookings", "QR + link"],
                ["Spring menu flyer", "QR, SVG"],
                ["Delivery orders", "Link"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-[12px]">
                  <span>{a}</span>
                  <span className="text-[11px] text-[#98989d]">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden flex-col items-center gap-2 sm:flex">
            <div className="w-full rounded-xl border border-white/[0.08] bg-white p-2.5 ">
              <QrGrid />
            </div>
            <span className="text-[11px] text-[#98989d]">PNG · SVG · 1024 px</span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function Saas() {
  return (
    <Chrome title="app.example/billing">
      <div className="flex h-full flex-col gap-4 p-4 text-[13px] sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Billing</p>
          <span className="rounded-full bg-[#635bff]/20 px-2.5 py-1 text-[11px] font-medium text-[#a8a3ff]">
            Stripe connected
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { n: "Starter", p: "$9", c: "500 credits" },
            { n: "Pro", p: "$29", c: "2,000 credits", on: true },
            { n: "Team", p: "$79", c: "6,000 credits" },
          ].map((p) => (
            <div
              key={p.n}
              className={`rounded-xl border p-3 ${p.on ? "border-[#2997ff] shadow-[0_0_0_1px_#2997ff]" : "border-white/[0.08]"}`}
            >
              <p className="text-[11px] text-[#98989d]">{p.n}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                {p.p}
                <span className="text-[11px] font-normal text-[#98989d]">/mo</span>
              </p>
              <p className="mt-1 text-[11px] text-[#98989d]">{p.c}</p>
              <span
                className={`mt-2.5 block rounded-md py-1.5 text-center text-[11px] font-medium ${p.on ? "bg-[#f5f5f7] text-black" : "bg-white/[0.08]"}`}
              >
                {p.on ? "Current plan" : "Switch"}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.08] p-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] text-[#98989d]">Credits this month</p>
            <p className="font-mono text-[12px]">1,284 / 2,000</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="mock-bar h-full w-[64%] rounded-full bg-[#2997ff]" />
          </div>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] text-[12px]">
          {[
            ["INV-0031", "Pro, monthly", "$29.00", "Paid"],
            ["INV-0030", "Credit top-up", "$12.00", "Paid"],
            ["INV-0029", "Pro, monthly", "$29.00", "Paid"],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-[1fr_1.4fr_auto_auto] items-center gap-3 px-3 py-2">
              <span className="font-mono text-[11px] text-[#98989d]">{r[0]}</span>
              <span className="truncate">{r[1]}</span>
              <span className="font-mono">{r[2]}</span>
              <span className="rounded-full bg-[#30d158]/15 px-2 py-0.5 text-[11px] text-[#30d158]">{r[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function Chat() {
  return (
    <Chrome title="rooms.app/room/k7f-29q">
      <div className="flex h-full flex-col bg-[#111113] text-[13px] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="font-mono text-[12px] text-white/80">room k7f-29q</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">2 of 2</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#ff453a]/15 px-2.5 py-1 font-mono text-[11px] text-[#ff6961]">
            Self-destructs in 07:42
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2.5 p-4">
          <div className="max-w-[72%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2">
            Sending the server keys here so they never sit in email.
          </div>
          <div className="ml-auto max-w-[72%] rounded-2xl rounded-br-md bg-[#2997ff] px-3.5 py-2">
            Got them. Room closes on its own, right?
          </div>
          <div className="max-w-[72%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2">
            In under eight minutes, and the history goes with it.
          </div>
          <div className="mock-typing flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-3" aria-hidden>
            <span className="size-1.5 rounded-full bg-white/70" />
            <span className="size-1.5 rounded-full bg-white/70" />
            <span className="size-1.5 rounded-full bg-white/70" />
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 p-3">
          <span className="flex-1 rounded-full bg-white/8 px-4 py-2 text-white/40">Write a private message</span>
          <span className="grid size-8 place-items-center rounded-full bg-[#2997ff]">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M6 10V2m-3.5 3.5L6 2l3.5 3.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Chrome>
  );
}

function Hrms() {
  const rows = [
    ["EMP-0142", "Front desk", "Morning", "On shift"],
    ["EMP-0138", "Accounting", "Day", "On leave"],
    ["EMP-0127", "Sales", "Evening", "On shift"],
    ["EMP-0119", "IT", "Day", "Interview"],
  ];
  const tone: Record<string, string> = {
    "On shift": "bg-[#30d158]/15 text-[#30d158]",
    "On leave": "bg-[#ff9f0a]/15 text-[#ff9f0a]",
    Interview: "bg-[#2997ff]/10 text-[#1f55b8]",
  };
  const bars = [38, 52, 46, 64, 58, 72, 66];
  return (
    <Chrome title="hrms.app/employees">
      <div className="flex h-full flex-col gap-3.5 p-4 text-[13px] sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Employees</p>
          <div className="flex gap-1.5 text-[11px]">
            <span className="rounded-md bg-white/[0.08] px-2 py-1">Admin</span>
            <span className="rounded-md bg-[#f5f5f7] px-2 py-1 text-black">Add employee</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            ["Headcount", "48"],
            ["On shift now", "31"],
            ["Interviews this week", "6"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/[0.08] p-3">
              <p className="truncate text-[11px] text-[#98989d]">{k}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] text-[12px]">
            {rows.map((r) => (
              <div key={r[0]} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2">
                <span className="font-mono text-[11px] text-[#98989d]">{r[0]}</span>
                <span className="truncate">
                  {r[1]} <span className="text-[#98989d]">· {r[2]}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${tone[r[3]]}`}>{r[3]}</span>
              </div>
            ))}
          </div>
          <div className="hidden flex-col rounded-xl border border-white/[0.08] p-3 sm:flex">
            <p className="text-[11px] text-[#98989d]">Hours logged, last 7 days</p>
            <div className="mt-auto flex h-[70%] items-end gap-1.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="mock-col flex-1 rounded-t-[4px] bg-[#2997ff]/85"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

export function ProjectMock({ id }: { id: ProjectId }) {
  switch (id) {
    case "tmtools":
      return <TmTools />;
    case "saas":
      return <Saas />;
    case "chat":
      return <Chat />;
    case "hrms":
      return <Hrms />;
  }
}
