import { ogImage, size, contentType } from "@/lib/og";
import { doctor } from "@/lib/site";

export const alt = `${doctor.name} — ${doctor.specialty}, Περαία Θεσσαλονίκης`;
export { size, contentType };
// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";


export default function Image() {
  return ogImage({
    eyebrow: "Δερματολογικό Ιατρείο · Περαία",
    title: doctor.name,
    subtitle: `${doctor.credentials.join(" · ")}. Καθημερινά ${doctor.hours.open}–${doctor.hours.close}, ${doctor.hours.note}.`,
  });
}
