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

  const ringSize = mode === "lens" ? 120 : mode === "link" || mode === "call" ? 56 : 32;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] size-[6px] rounded-full bg-accent transition-opacity duration-200"
        style={{ opacity: mode === "lens" ? 0 : 1 }}
      />
      <div
        ref={ring}
        className="absolute grid place-items-center rounded-full border transition-[width,height,background-color,border-color] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderColor: mode ? "var(--color-accent)" : "var(--color-ink-3)",
          backgroundColor: mode === "lens" ? "transparent" : "transparent",
          borderWidth: mode === "lens" ? 1 : 1,
        }}
      >
        {label && (
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
