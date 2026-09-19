"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

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
      className="fixed inset-0 z-[90] flex flex-col justify-end bg-paper px-[clamp(1rem,5vw,5rem)] py-10"
    >
      {/*
        An eyebrow used to sit at the top with the opening hours. The hero
        already carries them on its utility strip and they were in the intro
        section's stat tile as well — three statements of the same fact inside
        one scroll, which is the thing this pass is removing. The curtain is
        now one line of type sitting on the rule, which is also the stronger
        composition: the wipe travels up, so type near the floor has further
        to go.
      */}
      <div className="mb-8 flex items-end justify-between gap-6">
        {/*
          Not an <h1>. Hero owns the page heading, and while the intro is on
          screen both were in the DOM at once.

          The name used to be set here at up to 7rem. It is the fourth place the
          site said it — nav, hero caption, footer — and the first thing a
          visitor saw was a person they do not know yet. The curtain now says
          what the place is; the nav says who runs it.

          Each line must stay on one line: the parent clips overflow so the
          words can slide up out of it, which is also what would hide a wrapped
          second line. Hence the lower ceiling and the shorter second string.
        */}
        <p className="display text-[clamp(2.25rem,8vw,6rem)]">
          <span className="block overflow-hidden">
            <span className="pre-word block">Δερματολογικό</span>
          </span>
          <span className="block overflow-hidden text-accent">
            <span className="pre-word block">ιατρείο Περαίας</span>
          </span>
        </p>
      </div>

      <div aria-hidden className="h-px w-full bg-line" />
    </div>
  );
}
