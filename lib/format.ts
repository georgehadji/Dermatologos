const MONTHS_GR = [
  "Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου",
  "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου",
];

/**
 * Greek long date from an ISO string, built by hand rather than with
 * Intl.DateTimeFormat("el-GR"): this renders on the server during a static
 * export, and full ICU data is not guaranteed in every build environment.
 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_GR[m - 1]} ${y}`;
}

/**
 * Greek uppercase drops the acute accent: Πρόληψη becomes ΠΡΟΛΗΨΗ, not
 * ΠΡΌΛΗΨΗ. Browsers apply this rule for CSS `text-transform`, but Satori
 * (which renders the Open Graph cards) does not, so the cards need it done
 * in JS. The diaeresis is left alone — it is not an accent and ΑΪ keeps it.
 */
export function greekUpper(input: string): string {
  const COMBINING_ACUTE = 0x0301;
  return Array.from(input.toUpperCase().normalize("NFD"))
    .filter((ch) => ch.codePointAt(0) !== COMBINING_ACUTE)
    .join("")
    .normalize("NFC");
}
