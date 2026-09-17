"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Wait for this window event before playing (used to sync with the preloader). */
  waitFor?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
};

/**
 * Masked line-by-line reveal. SplitText re-splits on resize, which matters for
 * Greek copy: it is noticeably longer than English and rewraps at more widths.
 */
export default function SplitLines({
  children,
  className,
  waitFor,
  delay = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    const play = () => {
      try {
        build();
      } catch {
        // SplitText failed (exotic font metrics, detached node). The heading is
        // already in the DOM and untouched, so leaving it alone is correct.
      }
    };

    const build = () => {
      split = new SplitText(el, {
        type: "lines",
        linesClass: "split-line",
        autoSplit: true,
        mask: "lines",
      });
      tween = gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.1,
        delay,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: waitFor ? undefined : { trigger: el, start: "top 88%", once: true },
      });

      // Watchdog. `from()` hides the lines the instant the tween is built, so a
      // tween that never advances would leave the heading permanently blank.
      // If nothing has moved after 4s, snap it to the finished state.
      window.setTimeout(() => {
        if (tween && tween.progress() === 0) tween.progress(1);
      }, 4000);
    };

    // The preloader may already have finished (repeat visit, reduced motion)
    // before this mounted; in that case the event will never come.
    if (waitFor && document.documentElement.dataset.intro === "done") {
      play();
      return () => {
        tween?.kill();
        split?.revert();
      };
    }

    if (waitFor) {
      const onDone = () => play();
      window.addEventListener(waitFor, onDone, { once: true });
      // Fallback: never leave the headline hidden if the event never fires.
      const t = window.setTimeout(() => {
        window.removeEventListener(waitFor, onDone);
        if (!split) play();
      }, 4000);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener(waitFor, onDone);
        tween?.kill();
        split?.revert();
      };
    }

    play();
    return () => {
      tween?.kill();
      split?.revert();
    };
  }, [waitFor, delay]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag ref={ref as any} className={className}>{children}</Tag>;
}
