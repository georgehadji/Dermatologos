"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { doctor, nav } from "@/lib/site";
import { getOpenState, type OpenState } from "@/lib/hours";
import Magnetic from "./Magnetic";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const [state, setState] = useState<OpenState | null>(null);
  const pathname = usePathname();

  // Computed after mount only: the server has no idea what time it is in Athens
  // for this visitor's request, and a mismatch would hydrate-error.
  useEffect(() => {
    setState(getOpenState());
    const id = window.setInterval(() => setState(getOpenState()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last && y > 160;
      gsap.to(bar.current, {
        yPercent: goingDown ? -100 : 0,
        duration: 0.5,
        ease: "expo.out",
        overwrite: true,
      });
      bar.current?.classList.toggle("is-stuck", y > 40);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-[80] transition-colors duration-500 [&.is-stuck]:bg-paper/85 [&.is-stuck]:backdrop-blur-xl"
      >
        <div className="shell flex items-center justify-between gap-6 py-5">
          <Link href="/" data-cursor="link" className="group flex flex-col leading-none">
            <span className="display text-xl tracking-tight md:text-2xl">
              Αθ. Χρυσοσπάθης
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-3">
              Δερματολόγος · Αφροδισιολόγος
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="link"
                className="group relative py-1 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {state && (
              <span className="hidden items-center gap-2 text-xs text-ink-2 xl:flex">
                <span
                  className={`size-1.5 rounded-full ${state.open ? "bg-accent-2" : "bg-ink-3"}`}
                  style={state.open ? { boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-accent-2) 22%, transparent)" } : undefined}
                />
                {state.label}
              </span>
            )}

            <Magnetic strength={10}>
              <a
                href={`tel:${doctor.phone}`}
                data-cursor="call"
                data-cursor-label="Κλήση"
                className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-ink md:inline-block"
              >
                {doctor.phoneDisplay}
              </a>
            </Magnetic>

            <button
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-label={menu ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              className="grid size-10 cursor-pointer place-items-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-400 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-400 ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet overlay */}
      <div
        className={`fixed inset-0 z-[75] flex flex-col justify-center bg-paper px-[clamp(1rem,5vw,5rem)] transition-[opacity,visibility] duration-500 lg:hidden ${
          menu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="space-y-2">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <Link
                href={item.href}
                className="display block py-2 text-[clamp(2rem,10vw,3.5rem)] transition-[color,transform] duration-500"
                style={{
                  transform: menu ? "translateY(0)" : "translateY(110%)",
                  transitionDelay: `${menu ? 120 + i * 60 : 0}ms`,
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={`tel:${doctor.phone}`}
          className="mt-10 inline-block self-start rounded-full bg-accent px-7 py-3.5 font-semibold text-paper"
        >
          {doctor.phoneDisplay}
        </a>
        {state && <p className="mt-6 text-sm text-ink-2">{state.label}</p>}
      </div>
    </>
  );
}
