"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { doctor, mapsLink } from "@/lib/site";
import { getOpenState, type OpenState } from "@/lib/hours";
import { PRELOADER_DONE, isPreloaderDone } from "@/components/Preloader";
import { ArrowRightIcon, MapPinIcon, PhoneIcon } from "@/components/Icon";
import LensReveal from "@/components/LensReveal";
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

    // Repeat visit: the preloader finished before this effect ran, so the
    // event is gone. Start now instead of waiting out the fallback timer.
    if (isPreloaderDone()) {
      start();
      return;
    }

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
      className="intro-stage relative overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40"
    >
      {/*
        The wash used to be a WebGL shader. Once it settled it was a static
        gradient at every viewport, so it is a static gradient now — the same
        picture without `three` in the bundle.
      */}
      <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 -z-10" />

      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-10 lg:gap-14">
          <div className="md:col-span-7">
            {/*
              The h1 is the service and the place, not the name. The name was
              set here at 10rem and again two hundred pixels below it, while
              the two things a patient actually searches for — what this is and
              where it is — appeared in neither. The nav wordmark and the
              portrait caption still say who.
            */}
            <SplitLines
              as="h1"
              waitFor={PRELOADER_DONE}
              delay={0.15}
              className="display text-[clamp(2.1rem,6.5vw,5rem)] [overflow-wrap:anywhere]"
            >
              Κλινική δερματολογία
              <br />
              <em className="not-italic text-accent">στην Περαία</em>
            </SplitLines>

            {/*
              Credentials, not the specialty. The specialty is already in the
              nav and under the portrait; what separates this practice from the
              next listing is the doctorate and the hospital directorship.
            */}
            <ul
              className="intro-item mt-8 space-y-2 border-l-2 border-accent/30 pl-5 text-ink-2 md:mt-10"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              {/*
                `text-balance` because the directorship line is long enough to
                wrap on a phone and was breaking after "424", leaving "ΓΣΝΕ"
                alone on the second line. Balancing splits it near the middle
                instead of dropping a four-letter orphan under a full line.
              */}
              {doctor.credentials.map((c) => (
                <li key={c} className="text-balance">
                  {c}
                </li>
              ))}
            </ul>

            <div
              className="intro-item mt-10 flex flex-wrap items-center gap-5"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <a
                href={`tel:${doctor.phone}`}
                className="press inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 font-semibold text-paper transition-colors t-quick hover:bg-ink"
              >
                <PhoneIcon className="size-4" />
                {doctor.phoneDisplay}
              </a>

              <Link
                href="/patheseis"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-ink"
              >
                Δείτε τις παθήσεις
                <span className="grid size-9 place-items-center rounded-full border border-line transition-[background-color,border-color,transform] t-slow group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent">
                  <ArrowRightIcon className="size-4 text-ink transition-colors group-hover:text-paper" />
                </span>
              </Link>

              {/*
                Always laid out, filled in after mount: the badge must not push
                the two buttons sideways when the open state arrives.
              */}
              <span
                aria-live="polite"
                className="inline-flex min-h-[42px] min-w-[16rem] items-center gap-2.5 rounded-full border border-line bg-paper-2/70 px-4 py-2.5 text-sm text-ink-2 backdrop-blur xl:hidden"
                style={{ visibility: state ? "visible" : "hidden" }}
              >
                {state && (
                  <>
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
                  </>
                )}
              </span>
            </div>
          </div>

          {/*
            The portrait moved up from the section below. A physician's face is
            the strongest asset on the page and it was sitting one scroll under
            the fold while a name occupied the space it should have had.
            Capped width: at the full 5-column measure the 4:5 crop runs past
            650px and pushes everything else off the first screen.
          */}
          <figure
            className="intro-item w-full md:col-span-5 md:max-w-[26rem] md:justify-self-end"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <LensReveal
              src="/images/dermatologos-athanasios-chrysospathis.webp"
              detailSrc="/images/dermatologos-athanasios-chrysospathis.webp"
              alt={`${doctor.name}, ${doctor.specialty}`}
              className="aspect-[4/5] w-full rounded-sm"
              radius={128}
              priority
            />
            <figcaption className="mt-4 flex flex-col gap-1">
              <span className="display text-xl md:text-2xl">{doctor.name}</span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink-3">
                {doctor.specialty}
              </span>
            </figcaption>
          </figure>
        </div>

        {/*
          For a walk-in practice the product is where and when. That belongs in
          the first viewport, on one hairline, not in a sentence about
          philosophy.
        */}
        <div
          className="intro-item mt-14 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-6 text-sm md:mt-16"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <p className="text-ink">
            {doctor.address.street}, {doctor.address.area} {doctor.address.postal}
          </p>
          <p className="text-ink-2">
            {doctor.hours.label} {doctor.hours.open}–{doctor.hours.close} · {doctor.hours.note}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line-on link-line inline-flex items-center gap-2 font-semibold text-accent"
          >
            <MapPinIcon className="size-4" />
            Οδηγίες πρόσβασης
          </a>
        </div>
      </div>
    </section>
  );
}
