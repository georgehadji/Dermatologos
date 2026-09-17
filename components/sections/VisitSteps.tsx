"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import SplitLines from "@/components/SplitLines";
import { visitSteps } from "@/lib/site";

export default function VisitSteps() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Progress rail fills as the list scrolls past, tying the four steps
      // together as one sequence rather than four separate cards.
      gsap.fromTo(
        ".visit-rail-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".visit-list",
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".visit-step").forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          y: 34,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: step, start: "top 85%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="episkepsi" ref={root} className="section-y bg-paper-2">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">Η επίσκεψη</p>
          <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4rem)]">
            Πώς γίνεται
            <br />
            μια επίσκεψη
          </SplitLines>
          <p className="mt-7 max-w-sm text-ink-2">
            Χωρίς ραντεβού, με σταθερό απογευματινό ωράριο. Τέσσερα βήματα, από την
            πόρτα μέχρι την επανεκτίμηση.
          </p>
        </div>

        <ol className="visit-list relative md:col-span-8 md:pl-10">
          <span aria-hidden className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-line md:block">
            <span className="visit-rail-fill block h-full w-px origin-top scale-y-0 bg-accent" />
          </span>

          {visitSteps.map((s) => (
            <li key={s.n} className="visit-step relative border-b border-line py-8 last:border-b-0 md:py-10">
              <span
                aria-hidden
                className="absolute -left-10 top-10 hidden size-2 -translate-x-1/2 rounded-full bg-accent md:block"
              />
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
                <span className="font-sans text-xs tabular-nums text-ink-3">{s.n}</span>
                <div>
                  <h3 className="display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-2">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
