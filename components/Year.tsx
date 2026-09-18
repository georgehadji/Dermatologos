"use client";

import { useEffect, useState } from "react";

/**
 * The site is a static export, so a year rendered at build time freezes on the
 * day the build ran — a copyright line that silently goes stale every January.
 * This prints the build year for crawlers and no-JS visitors (so the first
 * paint always matches the server HTML), then corrects it in the browser.
 */
export default function Year({ built }: { built: number }) {
  const [year, setYear] = useState(built);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
