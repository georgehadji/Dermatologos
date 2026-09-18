"use client";

import Link from "next/link";
import { useRef } from "react";
import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("@/components/webgl/ParticleField"), {
  ssr: false,
});
import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { conditions } from "@/lib/site";
import { ArrowRightIcon } from "@/components/Icon";

export default function ConditionsGrid({
  heading = "Παθήσεις & Υπηρεσίες",
  limit,
  showCta = true,
}: {
  heading?: string;
  limit?: number;
  showCta?: boolean;
}) {
  // Written by pointer handlers and read inside useFrame, so hovering a row
  // never triggers a React render.
  const energy = useRef(0);
  const items = limit ? conditions.slice(0, limit) : conditions;

  return (
    <section
      id="patheseis"
      className="relative section-y"
      onPointerEnter={() => (energy.current = 1)}
      onPointerLeave={() => (energy.current = 0)}
    >
      <ParticleField active={energy} className="pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Κλινικό αντικείμενο</p>
            <SplitLines as="h2" className="display mt-5 max-w-2xl text-[clamp(2.25rem,6vw,4.5rem)]">
              {heading}
            </SplitLines>
          </div>
          <p className="max-w-sm text-ink-2">
            Δέκα πεδία κλινικής δερματολογίας. Κάθε ενότητα εξηγεί τι να προσέξετε
            και πότε αξίζει να απευθυνθείτε σε ιατρό.
          </p>
        </div>

        <Reveal as="ul" stagger className="mt-16 border-t border-line">
          {items.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/patheseis/${c.slug}`}
                data-cursor="link"
                data-cursor-label="Άνοιγμα"
                className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-line py-7 transition-colors t-quick hover:bg-paper-2/60 md:py-8"
              >
                <span className="col-span-2 font-sans text-xs tabular-nums text-ink-3 transition-colors t-quick group-hover:text-accent md:col-span-1">
                  {c.n}
                </span>

                <span className="display col-span-10 text-[clamp(1.5rem,3.2vw,2.5rem)] transition-transform t-slow group-hover:translate-x-2 md:col-span-4">
                  {c.title}
                </span>

                <span className="col-span-12 text-sm leading-relaxed text-ink-2 md:col-span-6 md:text-base">
                  {c.text}
                </span>

                <span className="col-span-12 hidden justify-end md:col-span-1 md:flex">
                  <span className="grid size-9 place-items-center rounded-full border border-line transition-[background-color,border-color,transform] t-slow group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent">
                    <ArrowRightIcon className="size-4 text-ink transition-colors group-hover:text-paper" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>

        {showCta && limit && (
          <Link
            href="/patheseis"
            data-cursor="link"
            className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-accent link-line-on link-line"
          >
            Όλες οι παθήσεις
          </Link>
        )}
      </div>
    </section>
  );
}
