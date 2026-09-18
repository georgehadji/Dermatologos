"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the footer's shader.
 *
 * `Footer` is a server component, and `next/dynamic` with `ssr: false` is only
 * legal on the client, so the split has to happen here. The point is the split
 * itself: without it `three` and `@react-three/fiber` land in the same chunk as
 * the footer and every visitor downloads and parses them — including the ones
 * on reduced motion or without WebGL, who never render a canvas at all.
 */
const CausticsCanvas = dynamic(() => import("./CausticsCanvas"), { ssr: false });

export default function FooterCaustics({ className }: { className?: string }) {
  return <CausticsCanvas className={className} />;
}
