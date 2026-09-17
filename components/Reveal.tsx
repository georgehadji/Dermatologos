"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "li" | "header" | "footer" | "aside";
};

/**
 * Scroll-into-view reveal.
 *
 * IntersectionObserver plus a CSS class, rather than a GSAP `from()` tween:
 * the animation lives entirely in CSS and ends at the visible state, so the
 * worst case if the observer never fires — no JS, an old browser, a script
 * error elsewhere on the page — is content that simply appears without motion.
 * Nothing can leave a paragraph stranded at opacity 0.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const targets: HTMLElement[] = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];

    targets.forEach((t, i) => {
      t.classList.add("reveal-item");
      if (stagger) t.style.setProperty("--i", String(i));
    });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        targets.forEach((t) => t.classList.add("is-revealed"));
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
