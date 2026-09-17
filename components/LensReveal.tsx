"use client";

import { useRef, useState } from "react";
import { isFinePointer } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  /** Optional second image revealed under the lens; defaults to a zoom of `src`. */
  detailSrc?: string;
  width?: number;
  height?: number;
  radius?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Dermatoscope lens. The revealed layer is masked to a circle that follows the
 * pointer, magnified and contrast-boosted the way a real dermatoscope image is.
 *
 * The mask is a CSS radial-gradient driven by two custom properties, so the
 * pointer handler only writes two strings per move — no React state, no layout
 * reads, and the compositor does the rest.
 */
export default function LensReveal({
  src,
  alt,
  detailSrc,
  width = 1200,
  height = 1500,
  radius = 110,
  className,
  priority = false,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!el || !isFinePointer()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };

  const enter = () => isFinePointer() && setOn(true);
  const leave = () => setOn(false);

  const mask = `radial-gradient(circle var(--lr, 0px) at var(--lx, 50%) var(--ly, 50%), #000 62%, rgba(0,0,0,0.35) 82%, transparent 100%)`;

  return (
    <div
      ref={box}
      onPointerMove={move}
      onPointerEnter={enter}
      onPointerLeave={leave}
      data-cursor="lens"
      className={`relative overflow-hidden bg-line/40 ${className ?? ""}`}
      style={
        {
          // --lr is registered in globals.css, so it interpolates here and the
          // masked child inherits the animated value frame by frame.
          "--lr": on ? `${radius}px` : "0px",
          transition: "--lr 340ms cubic-bezier(0.16,1,0.3,1)",
        } as React.CSSProperties
      }
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

      {/* Magnified layer, revealed only inside the lens. */}
      <img
        src={detailSrc ?? src}
        alt=""
        aria-hidden
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full scale-[1.55] object-cover [filter:contrast(1.14)_saturate(1.18)_brightness(1.03)]"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />

      {/* Lens barrel: ring, inner highlight and crosshair. */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-paper/70 transition-[width,height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: on ? radius * 2 : 0,
          height: on ? radius * 2 : 0,
          left: "var(--lx, 50%)",
          top: "var(--ly, 50%)",
          transform: "translate(-50%, -50%)",
          opacity: on ? 1 : 0,
          boxShadow:
            "0 0 0 1px rgba(20,94,88,0.55), 0 18px 50px -12px rgba(16,22,26,0.45), inset 0 0 40px rgba(255,255,255,0.14)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-paper/60" />
        <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-paper/60" />
      </div>
    </div>
  );
}
