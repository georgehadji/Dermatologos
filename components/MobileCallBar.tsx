"use client";

import { useEffect, useState } from "react";
import { MapPinIcon, PhoneIcon } from "./Icon";
import { doctor, mapsLink } from "@/lib/site";

/**
 * Walk-in practice: the whole site exists so someone can phone or find the
 * door. On a phone, a condition page runs several screens long and both of
 * those live at the very bottom, so this keeps them one thumb away.
 *
 * Hidden at the top of the page — the hero already carries both actions — and
 * hidden from md up, where the header keeps the number on screen anyway.
 */
export default function MobileCallBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShown(window.scrollY > 600));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      // `inert` rather than `hidden`: the bar keeps its slide transition, but a
      // keyboard or screen reader never lands on an off-screen control.
      inert={!shown}
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-[65] border-t border-line bg-paper-2/95 backdrop-blur transition-transform t-slow md:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-px bg-line">
        <a
          href={`tel:${doctor.phone}`}
          className="press-sm flex min-h-14 flex-1 items-center justify-center gap-2.5 bg-accent font-semibold text-paper"
        >
          <PhoneIcon className="size-4" />
          {doctor.phoneDisplay}
        </a>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 items-center justify-center gap-2 bg-paper-2 px-5 font-medium text-ink"
        >
          <MapPinIcon className="size-4" />
          Χάρτης
        </a>
      </div>
    </div>
  );
}
