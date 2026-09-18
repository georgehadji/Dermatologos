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
  /* Pointer held down: the ring contracts, so the click has a physical answer. */
  const [pressed, setPressed] = useState(false);

  // Two passes on purpose. The dot and ring only exist once `active` is true,
  // so wiring quickTo in the same pass that flips the flag binds it to null
  // refs — GSAP warns "target null not found" and the cursor never moves.
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active || !dot.current || !ring.current) return;

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

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [active]);

  if (!active) return null;

  // The ring is drawn at its largest size and scaled down, so the transition
  // is transform-only. vector-effect keeps the stroke 1px at every scale.
  const RING_MAX = 120;
  const base = mode === "lens" ? RING_MAX : mode === "link" || mode === "call" ? 56 : 32;
  // A press reads as the ring closing in on the target, not as a separate effect.
  const ringSize = pressed && mode !== "lens" ? base * 0.78 : base;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] size-[6px] rounded-full bg-accent transition-opacity t-quick"
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
          className="absolute inset-0 size-full transition-transform t-slow"
          style={{ transform: `scale(${ringSize / RING_MAX})` }}
        >
          <circle
            cx={RING_MAX / 2}
            cy={RING_MAX / 2}
            r={RING_MAX / 2 - 1}
            fill="none"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="transition-[stroke] t-quick"
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
