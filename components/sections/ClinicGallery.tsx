import LensReveal from "@/components/LensReveal";
import { clinicImages } from "@/lib/site";

/*
 * A swipeable row, at every width.
 *
 * It used to pin the viewport and drag the track sideways on scroll, with a
 * velocity-driven skew on top. Both were motion for its own sake, and pinning
 * takes the scrollbar away from someone who is only trying to reach the
 * address. The row below is the same pictures, scrolled the way the platform
 * already scrolls things.
 */
export default function ClinicGallery() {
  return (
    <section id="iatreio" className="section-y">
      <div className="shell pb-12">
        <h2 className="display max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)]">Το ιατρείο</h2>
      </div>

      <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,5vw,5rem)] pb-6 md:gap-8">
        {clinicImages.map((img, i) => (
          <li
            key={img.src}
            className="w-[78vw] shrink-0 snap-center sm:w-[58vw] md:w-[36vw] lg:w-[30vw]"
          >
            <LensReveal
              src={img.src}
              alt={img.alt}
              className={`w-full rounded-sm ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-[3/4] md:mt-16"}`}
              radius={96}
              width={1200}
              height={1500}
            />
            <p className="mt-4 flex items-baseline gap-3 text-sm text-ink-2">
              <span className="font-sans text-xs tabular-nums text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              {img.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
