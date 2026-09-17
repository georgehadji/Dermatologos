"use client";

import type Lenis from "lenis";

/**
 * Module singleton: the preloader needs to freeze scrolling and anchor links need
 * to drive it, and both live outside the SmoothScroll subtree. A context provider
 * would mean wrapping the whole tree for two call sites.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
