import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // A lockfile one directory up made Turbopack pick the parent as the workspace
  // root, which put the build output in the wrong place. Pin it to this project.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
