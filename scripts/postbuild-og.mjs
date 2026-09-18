/**
 * Runs after `next build` (see package.json). Gives the Open Graph cards a
 * real file extension.
 *
 * `next/og` exports every card as a file literally named `opengraph-image`,
 * and the HTML references it as `/opengraph-image?<hash>`. On Vercel with the
 * Next.js preset that is fine; on plain static hosting — which is how this site
 * deploys — there is no extension to infer a Content-Type from, the response
 * ships without one, and Facebook/LinkedIn/X refuse to use the card.
 *
 * So: rename each card to `opengraph-image.png` and point the meta tags at it.
 * Idempotent; a second run finds nothing to do.
 */
import { readdirSync, renameSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const NAME = "opengraph-image";

let renamed = 0;
let rewritten = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (entry.name === NAME && statSync(full).isFile()) {
      renameSync(full, `${full}.png`);
      renamed++;
      continue;
    }

    if (entry.name.endsWith(".html")) {
      const before = readFileSync(full, "utf8");
      // `/opengraph-image` optionally followed by `?hash`, and NOT already
      // followed by `.png` — the lookahead keeps the rewrite idempotent.
      const after = before.replace(
        /\/opengraph-image(\?[0-9a-f]+)?(?=["'&\s<])/g,
        `/${NAME}.png`
      );
      if (after !== before) {
        writeFileSync(full, after);
        rewritten++;
      }
    }
  }
}

walk(OUT);

console.log(`postbuild-og: ${renamed} card(s) renamed to .png, ${rewritten} HTML file(s) updated`);

if (renamed === 0 && rewritten === 0) {
  // Not fatal — but if Next changes how it exports metadata routes, this is
  // the line that says so before the social cards silently break.
  console.warn("postbuild-og: nothing found under ./out — check the export layout");
}
