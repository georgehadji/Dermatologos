import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { doctor } from "./site";
import { greekUpper } from "./format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (...p: string[]) => join(process.cwd(), ...p);

/**
 * Fonts are read from disk rather than fetched: the build must not depend on
 * network access, and these are the Greek subsets — Satori has no fallback that
 * can draw Greek glyphs, so a missing file would render blank boxes.
 */
const garamond = readFileSync(asset("assets", "fonts", "ebgaramond-500.woff"));
const manrope = readFileSync(asset("assets", "fonts", "manrope-600.woff"));

/** Inlined as a data URI because Satori cannot resolve site-relative paths. */
const background = `data:image/png;base64,${readFileSync(
  asset("public", "images", "og-background.png")
).toString("base64")}`;

/*
 * Satori has no CSSOM, so the palette cannot be read from `@theme` here — this
 * is the one place the values are repeated. Mirror of app/globals.css; keep in
 * sync. (`#8b949b` lived on here long after globals.css retired it at 2.83:1.)
 */
const PAPER = "#f7f5f0";
const INK = "#10161a";
const INK_2 = "#4a5560";
const INK_3 = "#606a72";
const LINE = "#e2ded4";
const ACCENT = "#145e58";

export function ogImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: PAPER,
          fontFamily: "Manrope",
        }}
      >
        <img
          src={background}
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />

        {/* Legibility wash: the photograph stays visible, the type stays readable. */}
        {/*
          Explicit box, not `inset: 0`: Satori supports a subset of CSS and
          ignores the shorthand, which collapses the wash to zero size and
          leaves the headline sitting on bare photograph.
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            background:
              "linear-gradient(105deg, rgba(247,245,240,0.97) 0%, rgba(247,245,240,0.93) 52%, rgba(247,245,240,0.62) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 68,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 3, backgroundColor: ACCENT }} />
            <div
              style={{
                fontSize: 21,
                letterSpacing: 3.4,
                color: INK_2,
              }}
            >
              {greekUpper(eyebrow)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "EB Garamond",
                fontSize: title.length > 46 ? 66 : 88,
                lineHeight: 1.06,
                color: INK,
                maxWidth: 950,
                letterSpacing: -1.5,
              }}
            >
              {title}
            </div>

            {subtitle && (
              <div
                style={{
                  marginTop: 24,
                  fontSize: 27,
                  lineHeight: 1.4,
                  color: INK_2,
                  maxWidth: 820,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${LINE}`,
              paddingTop: 26,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, color: INK }}>
                {title === doctor.name ? doctor.specialty : doctor.name}
              </div>
              <div style={{ fontSize: 22, color: INK_3, marginTop: 6 }}>
                {title === doctor.name ? doctor.addressLine : doctor.specialty}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 24, color: ACCENT }}>{doctor.phoneDisplay}</div>
              {/*
                One interpolation, not `{a}, {b}`: Satori treats each expression
                as a separate child and refuses a multi-child div that has no
                explicit display.
              */}
              <div style={{ fontSize: 20, color: INK_3, marginTop: 6 }}>
                {`${doctor.address.area}, ${doctor.address.region}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "EB Garamond", data: garamond, style: "normal", weight: 500 },
        { name: "Manrope", data: manrope, style: "normal", weight: 600 },
      ],
    }
  );
}
