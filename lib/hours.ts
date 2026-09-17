import { doctor } from "./site";

export type OpenState = { open: boolean; label: string };

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const DAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/**
 * Evaluated in Europe/Athens, not the visitor's timezone — a patient in Berlin
 * still needs to know whether the Perea office is open right now.
 */
export function getOpenState(now: Date = new Date()): OpenState {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(now);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = DAY_INDEX[get("weekday")] ?? 0;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  const isWeekday = (doctor.hours.weekdays as readonly number[]).includes(day);
  const open =
    isWeekday &&
    minutes >= toMinutes(doctor.hours.open) &&
    minutes < toMinutes(doctor.hours.close);

  if (open) return { open: true, label: `Ανοιχτά τώρα · έως ${doctor.hours.close}` };
  if (isWeekday && minutes < toMinutes(doctor.hours.open))
    return { open: false, label: `Ανοίγει σήμερα στις ${doctor.hours.open}` };
  return { open: false, label: `Κλειστά · ${doctor.hours.label} ${doctor.hours.open}–${doctor.hours.close}` };
}
