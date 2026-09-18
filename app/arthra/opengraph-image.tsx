import { ogImage, size, contentType } from "@/lib/og";
import { articles } from "@/lib/articles";

export const alt = "Άρθρα δερματολογίας για ασθενείς — Αθανάσιος Χρυσοσπάθης";
export { size, contentType };
// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    eyebrow: "Αρθρογραφία",
    title: "Άρθρα Δερματολογίας",
    subtitle: `${articles.length} κείμενα για ασθενείς: ακμή, ψωρίαση, ατοπική δερματίτιδα, τριχόπτωση, σπίλοι και αντηλιακή προστασία.`,
  });
}
