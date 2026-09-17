"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { doctor } from "@/lib/site";

export const PRELOADER_DONE = "preloader:done";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = () => window.dispatchEvent(new Event(PRELOADER_DONE));

    if (prefersReducedMotion()) {
      gsap.set(root.current, { display: "none" });
      finish();
      return;
    }

    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    const n = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        getLenis()?.start();
        finish();
      },
    });

    tl.to(n, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(n.v);
        if (count.current) count.current.textContent = String(v).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${n.v / 100})`;
      },
    })
      .to(".pre-word", { yPercent: -110, duration: 0.7, stagger: 0.06, ease: "expo.inOut" }, "-=0.25")
      .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.35")
      .set(root.current, { display: "none" });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-paper px-[clamp(1rem,5vw,5rem)] py-10"
    >
      <div className="eyebrow overflow-hidden">
        <span className="pre-word block">Δερματολογικό Ιατρείο · Περαία Θεσσαλονίκης</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <h1 className="display text-[clamp(2.5rem,9vw,7rem)]">
          <span className="block overflow-hidden">
            <span className="pre-word block">{doctor.firstName}</span>
          </span>
          <span className="block overflow-hidden italic text-accent">
            <span className="pre-word block">{doctor.lastName}</span>
          </span>
        </h1>
        <span ref={count} className="font-sans text-[clamp(1rem,3vw,2rem)] tabular-nums text-ink-3">
          000
        </span>
      </div>

      <div className="h-px w-full bg-line">
        <div ref={bar} className="h-px w-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
