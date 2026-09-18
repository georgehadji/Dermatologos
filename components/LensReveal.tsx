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

  const place = (el: HTMLDivElement, e: React.PointerEvent<HTMLDivElement>) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!el) return;
    // On touch the lens only tracks once it has been opened, so an ordinary
    // scroll drag across the image does not drag the dermatoscope with it.
    if (!isFinePointer() && !on) return;
    place(el, e);
  };

  const enter = () => isFinePointer() && setOn(true);
  const leave = () => isFinePointer() && setOn(false);

  /*
   * Touch alternative. There is no hover on a phone, so the dermatoscope opens
   * where the finger lands and stays there until the next tap — without this
   * the whole interaction simply did not exist below a mouse.
   */
  const tap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFinePointer()) return;
    const el = box.current;
    if (!el) return;
    place(el, e);
    setOn((v) => !v);
  };

  const mask = `radial-gradient(circle var(--lr, 0px) at var(--lx, 50%) var(--ly, 50%), #000 62%, rgba(0,0,0,0.35) 82%, transparent 100%)`;

  return (
    <div
      ref={box}
      onPointerMove={move}
      onPointerDown={tap}
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
        className="size-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-expo)]"
      />

      {/*
        Touch affordance. Hidden wherever hover exists, because there the lens
        follows the pointer and needs no instruction.
      */}
      <span
        className={`pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1.5 text-[11px] font-medium text-paper backdrop-blur transition-opacity t-quick [@media(hover:hover)]:hidden ${
          on ? "opacity-0" : "opacity-100"
        }`}
      >
        Πατήστε για μεγέθυνση
      </span>

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

      {/*
        Lens barrel: ring, accent halo and crosshair. The wrapper is laid out
        once at full size; only the SVG inside scales, so dilating the lens is
        a transform + opacity transition and never touches layout.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: radius * 2,
          height: radius * 2,
          left: "var(--lx, 50%)",
          top: "var(--ly, 50%)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="size-full transition-[transform,opacity] t-base"
          style={{
            transform: `scale(${on ? 1 : 0})`,
            opacity: on ? 1 : 0,
            filter: "drop-shadow(0 18px 30px rgba(16,22,26,0.35))",
          }}
        >
          <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(20,94,88,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(247,245,240,0.75)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="50" y1="43" x2="50" y2="57" stroke="rgba(247,245,240,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="43" y1="50" x2="57" y2="50" stroke="rgba(247,245,240,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
