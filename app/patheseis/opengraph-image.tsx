import { ogImage, size, contentType } from "@/lib/og";
import { conditions } from "@/lib/site";

export const alt = "Παθήσεις & υπηρεσίες — Δερματολόγος Περαία Θεσσαλονίκης";
export { size, contentType };
// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    eyebrow: "Κλινική Δερματολογία",
    title: "Παθήσεις & Υπηρεσίες",
    subtitle: `${conditions.length} πεδία κλινικής δερματολογίας, από την ακμή και την ψωρίαση έως τις παθήσεις τριχών και ονύχων.`,
  });
}
