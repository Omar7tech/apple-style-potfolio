"use client";

import { useEffect, useRef } from "react";

/**
 * A portrait drawn entirely from source code.
 *
 * The cut-out photo is sampled into a grid of monospace cells. Each cell prints one character
 * of real code, and the cell's brightness sets the character's opacity, so the face appears
 * out of the code. The code flows slowly through the face, types in line by line on load,
 * scrambles and turns blue around the pointer, and a click sends a blue ripple through it.
 *
 * Drawing is batched: characters are grouped into a few opacity levels and each level of a
 * row is drawn with one fillText call, so a full frame is a few hundred calls, capped at 30 fps.
 */

const CODE = `Route::post('/orders',[OrderController::class,'store']);export default function Store({products}){return <Grid items={products}/>}$order=Order::create($request->validated());const{data}=await fetch('/api/bookings');Schema::create('customers',function(Blueprint $table){$table->id();$table->string('email')->unique();});<Button onClick={checkout}>Pay now</Button>$invoice=Stripe::invoices()->create(['customer'=>$user->stripe_id]);useEffect(()=>{socket.on('order.updated',refresh)},[]);Mail::to($customer)->queue(new BookingConfirmed($booking));const total=cart.reduce((sum,i)=>sum+i.price*i.qty,0);`.replace(
  /\s+/g,
  "",
);
const SCRAMBLE = "<>/{}[]()=+-*;:$#@%&|!?_~";
const LEVELS = 7;
const FPS = 30;

type Props = { src: string; className?: string };

export default function CodePortrait({ src, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(canvas).fontFamily || "monospace";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let font = 10;
    let cellW = 6;
    let cellH = 11;
    let cols = 0;
    let rows = 0;
    let bright = new Float32Array(0);
    let image: HTMLImageElement | null = null;
    let start = 0;
    let raf = 0;
    let lastDraw = 0;
    let visible = true;
    let alive = true;
    const pointer = { x: -9999, y: -9999, inside: false, r: 0 };
    const ripples: { x: number; y: number; t: number }[] = [];

    const sample = () => {
      if (!image || cols === 0 || rows === 0) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      // Contain the square photo in the grid, accounting for tall cells.
      const gridAspect = (cols * cellW) / (rows * cellH);
      let dw = cols;
      let dh = rows;
      if (gridAspect > 1) dw = cols / gridAspect;
      else dh = rows * gridAspect;
      o.clearRect(0, 0, cols, rows);
      o.drawImage(image, (cols - dw) / 2, rows - dh, dw, dh);
      const data = o.getImageData(0, 0, cols, rows).data;
      bright = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const a = data[i * 4 + 3] / 255;
        const lum = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
        // Lift the mid-tones so skin reads; the black sweater and glasses stay sparse.
        const v = Math.min(1, Math.max(0, (lum - 0.06) / 0.78));
        bright[i] = Math.pow(v, 0.85) * a;
      }
    };

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      font = Math.max(6, Math.min(11, width / 104));
      cellW = font * 0.6;
      cellH = font * 1.08;
      cols = Math.floor(width / cellW);
      rows = Math.floor(height / cellH);
      sample();
      draw(performance.now(), true);
    };

    const draw = (now: number, force = false) => {
      if (!force && now - lastDraw < 1000 / FPS) return;
      lastDraw = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (!bright.length) return;

      ctx.font = `500 ${font}px ${family}`;
      ctx.textBaseline = "top";

      const t = reduce ? 10 : (now - start) / 1000;
      const flow = reduce ? 0 : Math.floor(t * 7);
      const intro = reduce ? 2 : Math.min(2, t / 1.4);
      const radius = pointer.r;
      const accent: { x: number; y: number; ch: string; a: number }[] = [];

      // Ripples expire after 1.4 s.
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > 1400) ripples.splice(i, 1);

      const levels: string[][] = Array.from({ length: LEVELS }, () => new Array<string>(cols));
      for (let r = 0; r < rows; r++) {
        for (let k = 0; k < LEVELS; k++) levels[k].fill(" ");
        // Typing-in: rows appear top to bottom; the leading rows scramble before settling.
        const rowGate = intro * rows - r;
        if (rowGate <= 0) continue;
        const settling = rowGate < 6;
        const y = r * cellH;
        for (let c = 0; c < cols; c++) {
          const b = bright[r * cols + c];
          if (b < 0.05) continue;
          let ch = CODE[(r * cols + c + flow) % CODE.length];
          if (settling) ch = SCRAMBLE[(c * 7 + r * 13 + Math.floor(t * 30)) % SCRAMBLE.length];

          const x = c * cellW;
          let hot = 0;
          if (radius > 0) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < radius) hot = 1 - d / radius;
          }
          for (const rp of ripples) {
            const age = (now - rp.t) / 1400;
            const ring = age * Math.max(width, height) * 1.1;
            const d = Math.hypot(x - rp.x, y - rp.y);
            const band = Math.max(0, 1 - Math.abs(d - ring) / 60) * (1 - age);
            hot = Math.max(hot, band);
          }
          if (hot > 0.04) {
            const scrambled = hot > 0.35 ? SCRAMBLE[(c * 31 + r * 17 + Math.floor(t * 24)) % SCRAMBLE.length] : ch;
            accent.push({ x, y, ch: scrambled, a: Math.min(1, b + hot * 0.9) * (0.5 + hot * 0.5) });
            continue;
          }
          const k = Math.min(LEVELS - 1, Math.floor(b * LEVELS));
          levels[k][c] = ch;
        }
        for (let k = 0; k < LEVELS; k++) {
          const line = levels[k].join("");
          if (!line.trim()) continue;
          ctx.fillStyle = `rgba(245,245,247,${0.1 + (0.9 * (k + 1)) / LEVELS})`;
          ctx.fillText(line, 0, y);
        }
      }

      for (const p of accent) {
        ctx.fillStyle = p.a > 0.85 ? `rgba(220,236,255,${p.a})` : `rgba(41,151,255,${Math.max(0.35, p.a)})`;
        ctx.fillText(p.ch, p.x, p.y);
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!alive || !visible) return;
      // Ease the pointer radius in and out.
      const target = pointer.inside ? Math.max(110, width * 0.2) : 0;
      pointer.r += (target - pointer.r) * 0.18;
      draw(now);
      if (!reduce || pointer.inside || pointer.r > 1 || ripples.length) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && alive && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      const pad = 80;
      pointer.inside =
        pointer.x > -pad && pointer.y > -pad && pointer.x < rect.width + pad && pointer.y < rect.height + pad;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      ripples.push({ x, y, t: performance.now() });
      if (ripples.length > 3) ripples.shift();
      wake();
    };

    const img = new Image();
    img.decoding = "async";
    img.onload = async () => {
      image = img;
      try {
        await document.fonts.load(`500 10px ${family}`);
      } catch {}
      if (!alive) return;
      layout();
      start = performance.now();
      wake();
    };
    img.src = src;

    const ro = new ResizeObserver(() => layout());
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full font-mono" aria-hidden />
    </div>
  );
}
