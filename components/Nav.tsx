"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { doctor, nav } from "@/lib/site";
import { getOpenState, type OpenState } from "@/lib/hours";
import Magnetic from "./Magnetic";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const [state, setState] = useState<OpenState | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
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
    let frame = 0;
    // Reduced motion keeps the header put; only the stuck styling still applies.
    const reduced = prefersReducedMotion();

    const apply = () => {
      const y = window.scrollY;
      const goingDown = y > last && y > 160;
      if (!reduced) {
        gsap.to(bar.current, {
          yPercent: goingDown ? -100 : 0,
          duration: 0.5,
          ease: "expo.out",
          overwrite: true,
        });
      }
      bar.current?.classList.toggle("is-stuck", y > 40);
      last = y;
    };

    // One tween per frame, not one per scroll event.
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";

    /*
     * Everything behind the overlay goes inert while it is open. Without this,
     * tabbing past the last link in the panel walked focus into page content
     * hidden underneath it — the ring lands somewhere the user cannot see.
     */
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];
    behind.forEach((el) => el.toggleAttribute("inert", menu));

    if (!menu) return;

    // Escape closes the overlay and focus returns to the button that opened
    // it, so a keyboard user is never left stranded behind a full-screen panel.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-[80] transition-colors t-quick [&.is-stuck]:bg-paper/85 [&.is-stuck]:backdrop-blur-xl"
      >
        <div className="shell flex items-center justify-between gap-6 py-5">
          <Link href="/" data-cursor="link" className="group flex flex-col leading-none">
            <span className="display text-xl tracking-tight md:text-2xl">
              Αθ. Χρυσοσπάθης
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-ink-3">
              Δερματολόγος · Αφροδισιολόγος
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="link"
                aria-current={pathname === item.href ? "page" : undefined}
                className="group relative py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-accent"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-accent transition-transform t-slow group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Reserved width: the label fills in after mount and must not nudge the phone button. */}
            <span
              aria-live="polite"
              className="hidden min-w-[14rem] items-center justify-end gap-2 text-xs text-ink-2 xl:flex"
              style={{ visibility: state ? "visible" : "hidden" }}
            >
              {state && (
                <>
                  <span
                    className={`size-1.5 rounded-full ${state.open ? "bg-accent-2" : "bg-ink-3"}`}
                    style={state.open ? { boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-accent-2) 22%, transparent)" } : undefined}
                  />
                  {state.label}
                </>
              )}
            </span>

            <Magnetic strength={10}>
              <a
                href={`tel:${doctor.phone}`}
                data-cursor="call"
                data-cursor-label="Κλήση"
                className="press hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors t-quick hover:bg-ink md:inline-block"
              >
                {doctor.phoneDisplay}
              </a>
            </Magnetic>

            <button
              ref={toggleRef}
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              className="grid size-11 cursor-pointer place-items-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-px w-full bg-ink transition-all t-base ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-ink transition-all t-base ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!menu}
        inert={!menu}
        className={`fixed inset-0 z-[75] flex flex-col justify-center bg-paper px-[clamp(1rem,5vw,5rem)] transition-[opacity,visibility] t-slow lg:hidden ${
          menu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Κύριο μενού">
        <ul className="space-y-2">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <Link
                href={item.href}
                className="display block py-2 text-[clamp(2rem,10vw,3.5rem)] transition-[color,transform] t-slow"
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
        </nav>
        <a
          href={`tel:${doctor.phone}`}
          className="press mt-10 inline-block self-start rounded-full bg-accent px-7 py-3.5 font-semibold text-paper"
        >
          {doctor.phoneDisplay}
        </a>
        {state && <p className="mt-6 text-sm text-ink-2">{state.label}</p>}
      </div>
    </>
  );
}
