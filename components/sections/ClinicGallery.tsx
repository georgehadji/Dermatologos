"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LensReveal from "@/components/LensReveal";
import { ArrowRightIcon } from "@/components/Icon";
import { prefersReducedMotion } from "@/lib/gsap";
import { clinicImages } from "@/lib/site";

/*
 * A swipeable row, at every width.
 *
 * It used to pin the viewport and drag the track sideways on scroll, with a
 * velocity-driven skew on top. Both were motion for its own sake, and pinning
 * takes the scrollbar away from someone who is only trying to reach the
 * address. The row below is the same pictures, scrolled the way the platform
 * already scrolls things.
 *
 * The native scrollbar is hidden and replaced with a pair of arrows. A raw
 * scrollbar under a row of photographs reads as a browser artefact rather than
 * a control, and on desktop it was the only thing saying more pictures exist —
 * a lot of weight for a thin grey bar that some platforms only paint while it
 * is being used. The arrows say it explicitly, and they disable themselves at
 * each end so the control always reports whether there is anywhere left to go.
 *
 * Scrolling itself is untouched: touch swipe, trackpad, shift+wheel and
 * keyboard all still work on the track, which keeps its own tab stop because a
 * scrollable region has to be reachable without a mouse.
 */
export default function ClinicGallery() {
  const track = useRef<HTMLDivElement>(null);
  /*
   * Starts with both arrows live rather than `atStart: true`. Before the
   * effect runs the real position is unknown, and a control that renders
   * disabled and then enables itself is worse than one that does the reverse.
   */
  const [edges, setEdges] = useState({ atStart: false, atEnd: false });

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // 2px of slack: snap points and fractional device pixels rarely land on 0.
    setEdges({ atStart: el.scrollLeft <= 2, atEnd: el.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // Card widths are in vw, so a resize changes what "one card" means.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    /*
     * One card plus one gap, measured rather than hard-coded: the card is sized
     * in vw and the gap changes at `md`, so any constant here would be wrong at
     * most widths.
     */
    const card = el.querySelector("li");
    // The gap lives on the inner <ul>; the scroll container itself is not the flex row.
    const list = el.querySelector("ul");
    const gap = list ? parseFloat(getComputedStyle(list).columnGap) || 0 : 0;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section id="iatreio" className="section-y">
      <div className="shell flex flex-wrap items-end justify-between gap-6 pb-12">
        <h2 className="display max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)]">Το ιατρείο</h2>

        <div className="flex items-center gap-3">
          <ArrowButton
            label="Προηγούμενες φωτογραφίες"
            onClick={() => page(-1)}
            disabled={edges.atStart}
            back
          />
          <ArrowButton
            label="Επόμενες φωτογραφίες"
            onClick={() => page(1)}
            disabled={edges.atEnd}
          />
        </div>
      </div>

      {/*
        The region wrapper is a div, not the <ul> itself. `role="region"` on a
        list replaces the list role, so a screen reader would stop announcing
        the item count — the most useful thing it can say about a row of
        photographs that extends past the edge of the screen. The scroll
        container keeps the tab stop, because a region that scrolls has to be
        reachable without a mouse.
      */}
      <div
        ref={track}
        tabIndex={0}
        role="region"
        aria-label="Φωτογραφίες του ιατρείου"
        className="no-scrollbar snap-x snap-mandatory overflow-x-auto px-[clamp(1rem,5vw,5rem)] pb-6"
      >
        <ul className="flex gap-5 md:gap-8">
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
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  onClick,
  disabled,
  back = false,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  back?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="press grid size-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,opacity] t-quick hover:border-accent hover:bg-accent hover:text-paper disabled:cursor-default disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      <ArrowRightIcon className={`size-4 ${back ? "rotate-180" : ""}`} />
    </button>
  );
}
