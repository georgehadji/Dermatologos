"use client";

import { useEffect, useRef, useState } from "react";
import { conditions, contactEmail } from "@/lib/site";

/**
 * The site is a static export, so there is no server of ours to post to.
 * FormSubmit relays the submission to `contactEmail` without any backend.
 *
 * Two things to do before this goes live (see README, "Contact form"):
 *  1. Submit the form once — FormSubmit emails an activation link that has to
 *     be clicked, otherwise nothing is delivered.
 *  2. Replace the address in ENDPOINT with the random alias FormSubmit issues,
 *     so the inbox address is not sitting in the public bundle for scrapers.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${contactEmail}`;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message" | "consent" | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Field caps, enforced in JS as well as with maxLength so a script cannot bypass them. */
const LIMITS = { name: 120, email: 180, phone: 40, topic: 120, message: 4000 } as const;

/** A human needs at least a few seconds to fill this in; a bot posts instantly. */
const MIN_FILL_MS = 3_000;
const COOLDOWN_MS = 30_000;
const MAX_PER_SESSION = 3;

/**
 * Drops C0/C1 control characters. They never appear in legitimate input and
 * are the payload shape used for header-injection through a mail relay.
 * Written as a code-point filter rather than a regex so the source carries no
 * escape sequences that a toolchain could mangle into literal control bytes.
 */
const clean = (v: string, max: number) =>
  Array.from(v)
    .filter((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c > 31 && c !== 127 && !(c >= 128 && c <= 159);
    })
    .join("")
    .trim()
    .slice(0, max);

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const mountedAt = useRef(0);
  const lastSentAt = useRef(0);
  const sentCount = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // ——— Bot traps ———
    // The honeypot is hidden from humans; anything in it is automated.
    // The timing check catches the same class of submitter that ignores CSS.
    // Both fail silently as a success so the bot has no signal to adapt to.
    if (String(data.get("_honey") ?? "") !== "" || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("sent");
      return;
    }

    // ——— Abuse limits ———
    if (sentCount.current >= MAX_PER_SESSION) {
      setErrors({ form: "Έχετε στείλει ήδη αρκετά μηνύματα. Καλέστε μας τηλεφωνικά." });
      return;
    }
    if (Date.now() - lastSentAt.current < COOLDOWN_MS && lastSentAt.current > 0) {
      setErrors({ form: "Περιμένετε λίγο πριν στείλετε νέο μήνυμα." });
      return;
    }

    const name = clean(String(data.get("name") ?? ""), LIMITS.name);
    const email = clean(String(data.get("email") ?? ""), LIMITS.email);
    const phone = clean(String(data.get("phone") ?? ""), LIMITS.phone);
    const topic = clean(String(data.get("topic") ?? ""), LIMITS.topic);
    const message = clean(String(data.get("message") ?? ""), LIMITS.message);
    const consent = data.get("consent") === "on";

    const next: Errors = {};
    if (name.length < 2) next.name = "Συμπληρώστε το ονοματεπώνυμό σας.";
    if (!EMAIL_RE.test(email) || email.length > LIMITS.email)
      next.email = "Συμπληρώστε έγκυρη διεύθυνση email.";
    if (message.length < 10)
      next.message = "Γράψτε λίγα λόγια για το αίτημά σας (τουλάχιστον 10 χαρακτήρες).";
    if (!consent) next.consent = "Απαιτείται η συγκατάθεσή σας για την επικοινωνία.";

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[data-field="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      // An explicit allow-list, not Object.fromEntries: only these five fields
      // ever leave the browser, whatever a tampered DOM adds to the form.
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          name,
          email,
          phone,
          topic: topic || "Γενική ερώτηση",
          message,
          _subject: "Νέο μήνυμα από την ιστοσελίδα",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      lastSentAt.current = Date.now();
      sentCount.current += 1;
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="hairline pt-10" role="status" aria-live="polite">
        <p className="display text-3xl md:text-4xl">Το μήνυμα στάλθηκε.</p>
        <p className="mt-4 max-w-md text-ink-2">
          Θα λάβετε απάντηση το συντομότερο δυνατό. Για επείγον περιστατικό καλέστε
          απευθείας στο ιατρείο.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 cursor-pointer text-sm font-semibold text-accent underline underline-offset-4"
        >
          Αποστολή νέου μηνύματος
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-8">
      {/*
        Honeypot. Moved off-screen rather than display:none — some crawlers skip
        hidden inputs, and a field that is technically rendered is more likely to
        be filled. Never focusable, never announced.
      */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="_honey">Μην συμπληρώσετε αυτό το πεδίο</label>
        <input
          id="_honey"
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Field id="name" label="Ονοματεπώνυμο" error={errors.name} required>
          <input
            id="name"
            name="name"
            data-field="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            className={inputClass}
            placeholder=" "
          />
        </Field>

        <Field id="email" label="Email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            data-field="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            className={inputClass}
            placeholder=" "
          />
        </Field>

        <Field id="phone" label="Τηλέφωνο (προαιρετικό)">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            className={inputClass}
            placeholder=" "
          />
        </Field>

        <Field id="topic" label="Θέμα">
          <select id="topic" name="topic" className={`${inputClass} cursor-pointer`} defaultValue="">
            <option value="">Γενική ερώτηση</option>
            {conditions.map((c) => (
              <option key={c.slug} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label="Το μήνυμά σας" error={errors.message} required>
        <textarea
          id="message"
          name="message"
          data-field="message"
          rows={5}
          maxLength={LIMITS.message}
          className={`${inputClass} resize-y`}
          placeholder=" "
        />
      </Field>

      <p className="rounded-lg border border-line bg-paper-2 px-4 py-3 text-xs leading-relaxed text-ink-2">
        Μην αποστέλλετε μέσω της φόρμας ιατρικά δεδομένα, ιστορικό, εξετάσεις ή
        φωτογραφίες δερματικών βλαβών. Η φόρμα προορίζεται μόνο για γενικά
        ερωτήματα και στοιχεία επικοινωνίας. Για ιατρικό ζήτημα, επισκεφθείτε το
        ιατρείο ή καλέστε τηλεφωνικά.
      </p>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            name="consent"
            data-field="consent"
            className="mt-1 size-4 shrink-0 cursor-pointer accent-[var(--color-accent)]"
          />
          <span>
            Συναινώ στην επεξεργασία των στοιχείων μου με μοναδικό σκοπό την απάντηση
            στο αίτημά μου, σύμφωνα με την{" "}
            <a href="/politiki-aporritou" className="text-accent underline underline-offset-4">
              Πολιτική Απορρήτου
            </a>
            .
          </span>
        </label>
        {errors.consent && <p className={errClass}>{errors.consent}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          data-cursor="link"
          className="group relative cursor-pointer overflow-hidden rounded-full bg-accent px-8 py-4 font-semibold text-paper transition-colors duration-300 hover:bg-ink disabled:cursor-wait disabled:opacity-70"
        >
          <span className="relative z-10">
            {status === "sending" ? "Αποστολή…" : "Αποστολή μηνύματος"}
          </span>
        </button>

        {status === "error" && (
          <p className="text-sm text-[var(--color-destructive,#dc2626)]" role="alert">
            Η αποστολή απέτυχε. Δοκιμάστε ξανά ή καλέστε μας τηλεφωνικά.
          </p>
        )}

        {errors.form && (
          <p className="text-sm text-[var(--color-destructive,#dc2626)]" role="alert">
            {errors.form}
          </p>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "peer w-full border-0 border-b border-line bg-transparent pb-3 pt-6 text-ink outline-none transition-colors duration-300 focus:border-accent";

const errClass = "mt-2 text-xs font-medium text-[var(--color-destructive,#dc2626)]";

/** Floating label that lifts on focus or when the control holds a value. */
function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-6 origin-left text-ink-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:top-0 peer-focus:scale-[0.78] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.78] peer-[select]:top-0 peer-[select]:scale-[0.78]"
      >
        {label}
        {required && <span aria-hidden className="text-accent"> *</span>}
      </label>
      {error && (
        <p className={errClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
