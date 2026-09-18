"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { doctor } from "@/lib/site";

export const PRELOADER_DONE = "preloader:done";
const SEEN_KEY = "intro-seen";

/**
 * True once the intro has finished or been skipped in this page load. Components
 * that mount after that point would otherwise wait for an event that already
 * fired and only ever reach their fallback timer.
 */
export const isPreloaderDone = () =>
  typeof document !== "undefined" && document.documentElement.dataset.intro === "done";

const seenThisSession = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = () => {
      document.documentElement.dataset.intro = "done";
      window.dispatchEvent(new Event(PRELOADER_DONE));
    };

    // Once per session. The intro sets the tone on arrival; replaying it on
    // every full page load only delays the phone number and the address.
    if (prefersReducedMotion() || seenThisSession()) {
      gsap.set(root.current, { display: "none" });
      finish();
      return;
    }

    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        getLenis()?.start();
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // Private mode or blocked storage: the intro simply plays again next time.
        }
        finish();
      },
    });

    /*
     * No progress counter. There was one, tweening 000→100 over 600ms while
     * measuring nothing — a number invented to look like loading. What is left
     * is the wipe itself, and it is short: the practice's phone number is
     * behind this curtain.
     */
    tl.to(".pre-word", { yPercent: -110, duration: 0.5, stagger: 0.05, ease: "expo.inOut" })
      .to(root.current, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "-=0.35")
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
        {/*
          Not an <h1>. Hero owns the page heading, and while the intro is on
          screen both were in the DOM at once.
        */}
        <p className="display text-[clamp(2.5rem,9vw,7rem)]">
          <span className="block overflow-hidden">
            <span className="pre-word block">{doctor.firstName}</span>
          </span>
          <span className="block overflow-hidden not-italic text-accent">
            <span className="pre-word block">{doctor.lastName}</span>
          </span>
        </p>
      </div>

      <div aria-hidden className="h-px w-full bg-line" />
    </div>
  );
}
