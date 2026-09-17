"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/lenis";

const R = 20;
const C = 2 * Math.PI * R;

/** Bottom-right progress arc that doubles as back-to-top once you are past the fold. */
export default function ScrollProgress() {
  const arc = useRef<SVGCircleElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        arc.current?.style.setProperty("stroke-dashoffset", `${C * (1 - p)}`);
        btn.current?.style.setProperty("opacity", window.scrollY > 600 ? "1" : "0");
        btn.current?.style.setProperty(
          "pointer-events",
          window.scrollY > 600 ? "auto" : "none"
        );
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={btn}
      onClick={toTop}
      aria-label="Επιστροφή στην κορυφή"
      style={{ opacity: 0, pointerEvents: "none" }}
      className="fixed bottom-6 right-6 z-50 grid size-12 cursor-pointer place-items-center rounded-full bg-paper-2/80 backdrop-blur transition-[opacity,transform] duration-500 hover:scale-110 md:bottom-10 md:right-10"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle cx="24" cy="24" r={R} fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
        <circle
          ref={arc}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <svg viewBox="0 0 24 24" className="size-4 stroke-ink" fill="none" strokeWidth="1.5">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
