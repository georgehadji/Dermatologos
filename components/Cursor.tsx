"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Two-part cursor: a precise dot plus a lagging ring. Elements opt into a mode
 * with `data-cursor="link|lens|drag|call"`; `data-cursor-label` sets the caption.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<string>("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    setActive(true);

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);

      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      setMode(el?.dataset.cursor ?? "");
      setLabel(el?.dataset.cursorLabel ?? "");
    };

    const onLeave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  if (!active) return null;

  // The ring is drawn at its largest size and scaled down, so the transition
  // is transform-only. vector-effect keeps the stroke 1px at every scale.
  const RING_MAX = 120;
  const ringSize = mode === "lens" ? RING_MAX : mode === "link" || mode === "call" ? 56 : 32;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] size-[6px] rounded-full bg-accent transition-opacity duration-200"
        style={{ opacity: mode === "lens" ? 0 : 1 }}
      />
      <div
        ref={ring}
        className="absolute grid place-items-center"
        style={{
          width: RING_MAX,
          height: RING_MAX,
          marginLeft: -RING_MAX / 2,
          marginTop: -RING_MAX / 2,
        }}
      >
        <svg
          viewBox={`0 0 ${RING_MAX} ${RING_MAX}`}
          className="absolute inset-0 size-full transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `scale(${ringSize / RING_MAX})` }}
        >
          <circle
            cx={RING_MAX / 2}
            cy={RING_MAX / 2}
            r={RING_MAX / 2 - 1}
            fill="none"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="transition-[stroke] duration-300"
            stroke={mode ? "var(--color-accent)" : "var(--color-ink-3)"}
          />
        </svg>
        {label && (
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
