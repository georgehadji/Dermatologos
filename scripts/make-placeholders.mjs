/**
 * Generates stand-in artwork for public/images so the site builds and renders
 * before the real photography exists. Replace each file with the AI-generated
 * image produced from the matching prompt in PROMPTS.md, keeping the filename.
 *
 * Writes PNG with nothing but node's zlib — no image library, no native build.
 *
 *   node scripts/make-placeholders.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

// ——— PNG container ———————————————————————————————————————————————

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** `pixels` is RGB, 3 bytes per pixel, row-major. */
function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  // 10..12 stay 0: deflate, adaptive filtering, no interlace.

  // Each scanline is prefixed with filter type 0 (None).
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ——— Artwork ————————————————————————————————————————————————————

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** Deterministic value noise, so re-running the script is idempotent. */
function hash2(x, y, seed) {
  let h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

function smoothNoise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

function render(width, height, { warm, cool, seed, light }) {
  const px = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;

      // Layered noise stands in for the soft tonal falloff of a real interior.
      let n = 0;
      let amp = 0.5;
      let freq = 3;
      for (let o = 0; o < 4; o++) {
        n += smoothNoise(u * freq, v * freq, seed + o) * amp;
        freq *= 2.1;
        amp *= 0.5;
      }

      // Diagonal light sweep from the top-left.
      const sweep = Math.max(0, 1 - Math.hypot(u - light[0], v - light[1]) * 1.35);

      let c = mix(warm, cool, Math.min(1, Math.max(0, n * 0.9 + v * 0.35)));
      c = mix(c, [255, 252, 246], sweep * 0.55);

      // Vignette.
      const r = Math.hypot(u - 0.5, v - 0.5);
      const vig = 1 - Math.min(1, Math.max(0, (r - 0.34) * 1.15));
      c = c.map((ch) => ch * (0.72 + vig * 0.28));

      // No per-pixel grain: random noise is incompressible and would push each
      // placeholder past a megabyte. The site overlays its own grain in CSS.
      const g = 0;

      const i = (y * width + x) * 3;
      px[i] = clamp(c[0] + g);
      px[i + 1] = clamp(c[1] + g);
      px[i + 2] = clamp(c[2] + g);
    }
  }

  return encodePng(width, height, px);
}

const PAPER = [247, 245, 240];
const SKIN = [236, 203, 184];
const TEAL = [20, 94, 88];
const INK = [16, 22, 26];

const FILES = [
  { name: "doctor-portrait.png", w: 880, h: 1100, warm: PAPER, cool: mix(INK, TEAL, 0.5), seed: 3, light: [0.34, 0.26] },
  { name: "clinic-01.png", w: 900, h: 1125, warm: PAPER, cool: mix(TEAL, INK, 0.35), seed: 11, light: [0.2, 0.18] },
  { name: "clinic-02.png", w: 900, h: 1125, warm: PAPER, cool: mix(SKIN, TEAL, 0.5), seed: 23, light: [0.7, 0.22] },
  { name: "clinic-03.png", w: 900, h: 1125, warm: PAPER, cool: mix(PAPER, TEAL, 0.55), seed: 37, light: [0.4, 0.14] },
  { name: "clinic-04.png", w: 900, h: 1125, warm: PAPER, cool: mix(INK, TEAL, 0.62), seed: 51, light: [0.28, 0.3] },
  { name: "clinic-05.png", w: 900, h: 1125, warm: SKIN, cool: mix(INK, TEAL, 0.4), seed: 67, light: [0.55, 0.45] },
  { name: "clinic-06.png", w: 900, h: 1125, warm: PAPER, cool: mix(SKIN, INK, 0.45), seed: 83, light: [0.16, 0.6] },
  // Wide crop reused as the Open Graph background.
  { name: "og-background.png", w: 1200, h: 630, warm: PAPER, cool: mix(TEAL, INK, 0.45), seed: 101, light: [0.24, 0.2] },
];

mkdirSync(OUT, { recursive: true });

for (const f of FILES) {
  const buf = render(f.w, f.h, { warm: f.warm, cool: f.cool, seed: f.seed, light: f.light });
  writeFileSync(resolve(OUT, f.name), buf);
  console.log(`${f.name}  ${f.w}x${f.h}  ${(buf.length / 1024).toFixed(0)} KB`);
}

console.log(`\n${FILES.length} placeholders written to public/images`);
console.log("Replace each with the matching AI image from PROMPTS.md, keeping the filename.");
