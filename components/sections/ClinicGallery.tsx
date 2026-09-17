"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import LensReveal from "@/components/LensReveal";
import SplitLines from "@/components/SplitLines";
import { clinicImages } from "@/lib/site";

export default function ClinicGallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Horizontal pinning only makes sense where there is room for it; on a phone
    // the track stays a normal swipeable row.
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el) return;

      const distance = () => el.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Velocity skew: the row leans into the direction of travel and settles.
      let skew = 0;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const target = gsap.utils.clamp(-7, 7, self.getVelocity() / -320);
          if (Math.abs(target) > Math.abs(skew)) {
            skew = target;
            gsap.to(el, {
              skewX: skew,
              duration: 0.8,
              ease: "power3",
              onComplete: () => {
                skew = 0;
                gsap.to(el, { skewX: 0, duration: 0.5, ease: "power3" });
              },
            });
          }
        },
      });

      return () => {
        tween.kill();
        st.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="iatreio" ref={root} className="relative overflow-hidden py-24 md:py-0">
      <div className="shell pb-12 pt-0 md:pt-28">
        <p className="eyebrow">Ο χώρος</p>
        <SplitLines as="h2" className="display mt-5 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)]">
          Το ιατρείο
        </SplitLines>
      </div>

      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,5vw,5rem)] pb-14 md:gap-8 md:overflow-visible md:pb-28"
      >
        {clinicImages.map((img, i) => (
          <li
            key={img.src}
            className="w-[78vw] shrink-0 snap-center sm:w-[58vw] md:w-[36vw] lg:w-[30vw]"
          >
            <LensReveal
              src={img.src}
              alt={img.alt}
              className={`w-full rounded-sm ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-[3/4] md:mt-16"}`}
              radius={96}
              width={1200}
              height={1500}
            />
            <p className="mt-4 flex items-baseline gap-3 text-sm text-ink-2">
              <span className="font-sans text-xs tabular-nums text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              {img.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
