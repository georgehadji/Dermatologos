"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { doctor } from "@/lib/site";
import { getOpenState, type OpenState } from "@/lib/hours";
import { PRELOADER_DONE } from "@/components/Preloader";
import HeroCanvas from "@/components/webgl/HeroCanvas";
import Magnetic from "@/components/Magnetic";
import SplitLines from "@/components/SplitLines";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => setState(getOpenState()), []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    // Adding the class starts the CSS keyframes. Until it is added the copy is
    // simply visible, so a missed event costs the animation and nothing else.
    const start = () => el.classList.add("is-intro");

    window.addEventListener(PRELOADER_DONE, start, { once: true });
    const fallback = window.setTimeout(start, 3500);

    return () => {
      window.removeEventListener(PRELOADER_DONE, start);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={root}
      className="intro-stage relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-32"
    >
      <HeroCanvas className="absolute inset-0 -z-10" />

      <div className="shell">
        <p className="intro-item eyebrow" style={{ "--i": 0 } as React.CSSProperties}>
          Δερματολογικό Ιατρείο · Περαία Θεσσαλονίκης
        </p>

        <SplitLines
          as="h1"
          waitFor={PRELOADER_DONE}
          delay={0.15}
          className="display mt-6 text-[clamp(3rem,11vw,10rem)]"
        >
          {doctor.firstName}
          <br />
          <em className="not-italic text-accent">{doctor.lastName}</em>
        </SplitLines>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p
            className="intro-item text-sm font-semibold uppercase tracking-[0.14em] text-ink md:col-span-3"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            {doctor.specialty}
          </p>
          <ul
            className="intro-item space-y-1.5 text-ink-2 md:col-span-4"
            style={{ "--i": 5 } as React.CSSProperties}
          >
            {doctor.credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p
            className="intro-item max-w-sm text-ink-2 md:col-span-5"
            style={{ "--i": 6 } as React.CSSProperties}
          >
            Κλινική δερματολογία με έμφαση στη σαφή διάγνωση και σε θεραπευτικά πλάνα
            που εξηγούνται από την πρώτη επίσκεψη.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-5">
          <Magnetic strength={14}>
            <a
              href={`tel:${doctor.phone}`}
              data-cursor="call"
              data-cursor-label="Κλήση"
              className="intro-item inline-block rounded-full bg-accent px-8 py-4 font-semibold text-paper transition-colors duration-300 hover:bg-ink"
              style={{ "--i": 7 } as React.CSSProperties}
            >
              {doctor.phoneDisplay}
            </a>
          </Magnetic>

          <Link
            href="/patheseis"
            data-cursor="link"
            className="intro-item group inline-flex items-center gap-3 text-sm font-semibold text-ink"
            style={{ "--i": 8 } as React.CSSProperties}
          >
            Δείτε τις παθήσεις
            <span className="grid size-9 place-items-center rounded-full border border-line transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                className="size-4 stroke-ink transition-colors group-hover:stroke-paper"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          {state && (
            <span
              className="intro-item inline-flex items-center gap-2.5 rounded-full border border-line bg-paper-2/70 px-4 py-2.5 text-sm text-ink-2 backdrop-blur"
              style={{ "--i": 9 } as React.CSSProperties}
            >
              <span
                className={`size-1.5 rounded-full ${state.open ? "bg-accent-2" : "bg-ink-3"}`}
                style={
                  state.open
                    ? {
                        boxShadow:
                          "0 0 0 4px color-mix(in srgb, var(--color-accent-2) 22%, transparent)",
                      }
                    : undefined
                }
              />
              {state.label}
            </span>
          )}
        </div>
      </div>

      <div
        className="intro-item shell mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-ink-3"
        style={{ "--i": 10 } as React.CSSProperties}
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line" aria-hidden>
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollhint_2.2s_cubic-bezier(0.16,1,0.3,1)_infinite] bg-accent" />
        </span>
        Κυλήστε
      </div>
    </section>
  );
}
