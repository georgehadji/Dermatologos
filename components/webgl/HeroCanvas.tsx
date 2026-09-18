"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SIMPLEX_3D, useInView, useWebGLReady } from "@/lib/webgl";

const vertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * "Light through tissue": two domain-warped noise fields stand in for a
 * subsurface layer. Kept low-contrast on purpose — it sits behind editorial
 * type and must never compete with it for attention.
 */
const fragment = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2  uMouse;      // 0..1, eased
uniform float uAspect;
uniform float uScroll;     // 0..1 through the hero
uniform vec3  uPaper;
uniform vec3  uSkin;
uniform vec3  uAccent;

${SIMPLEX_3D}

void main(){
  vec2 uv = vUv;
  vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);

  float t = uTime * 0.045;

  // Domain warp: the second lookup is offset by the first, which turns
  // isotropic noise into the stretched, vein-like structures we want.
  vec3 q = vec3(p * 1.35, t);
  float w1 = fbm(q);
  float w2 = fbm(q + vec3(w1 * 0.9 + 1.7, w1 * 0.6 - 4.3, t * 0.7));
  float field = fbm(vec3(p * 2.1 + w2 * 0.55, t * 1.2));

  // Pointer acts as a soft light source pressed against the surface.
  vec2 m = vec2((uMouse.x - 0.5) * uAspect, uMouse.y - 0.5);
  float d = length(p - m);
  float glow = smoothstep(0.46, 0.0, d);

  float depth = field * 0.5 + 0.5;
  depth = mix(depth, depth + glow * 0.30, 0.85);

  // Vignette keeps the edges paper-clean so the section blends into the page.
  float edge = smoothstep(1.02, 0.28, length(p * vec2(0.85, 1.18)));

  /*
   * Art direction, not decoration. The headline occupies the upper left and
   * the actions sit along the bottom, so the light is confined to the upper
   * right: one ramp across x, one up from the baseline. Type always lands on
   * flat paper, and the shader becomes a composition element instead of a
   * field of haze behind everything.
   */
  /*
   * On a wide screen the right third of the hero is empty, so the light lives
   * there. On a narrow one the type runs full width and the only free area is
   * the strip above the headline, so the mask rotates from a column into a
   * band. One uniform, two compositions, type never sits on moving colour.
   */
  float narrow = step(uAspect, 1.0);
  float column = mix(smoothstep(0.44, 0.76, uv.x), 1.0, narrow);
  float band = mix(smoothstep(0.06, 0.30, uv.y), smoothstep(0.60, 0.92, uv.y), narrow);
  float mask = edge * column * band;

  /*
   * Thresholds are high and mix amounts low on purpose: only the brightest
   * folds take colour, so the surface reads as light caught on skin rather
   * than a tinted cloud. Earlier values (0.55 skin, 0.22 accent, from 0.42)
   * covered most of the frame once the layer became visible.
   */
  vec3 col = uPaper;
  col = mix(col, uSkin, smoothstep(0.42, 0.92, depth) * 0.55 * mask);
  col = mix(col, uAccent, smoothstep(0.72, 1.0, depth) * 0.17 * mask);

  // Faint specular ridge where the warp folds over itself.
  float ridge = smoothstep(0.55, 0.58, abs(w2));
  col += ridge * 0.035 * mask;

  // Fades out as the hero scrolls away, so the section below stays flat.
  float fade = 1.0 - smoothstep(0.0, 0.85, uScroll);
  col = mix(uPaper, col, fade);

  gl_FragColor = vec4(col, 1.0);
}
`;

function Surface() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uScroll: { value: 0 },
      uPaper: { value: new THREE.Color("#f7f5f0") },
      uSkin: { value: new THREE.Color("#eccbb8") },
      uAccent: { value: new THREE.Color("#2a9d8f") },
    }),
    []
  );

  useEffect(() => {
    const u = mat.current?.uniforms;
    if (u) u.uAspect.value = size.width / size.height;
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;

    // Pointer comes in normalised to [-1,1] from R3F; remap and ease so the
    // highlight trails the cursor instead of snapping to it.
    target.current.set(
      (state.pointer.x + 1) / 2,
      (state.pointer.y + 1) / 2
    );
    u.uMouse.value.lerp(target.current, Math.min(1, delta * 2.6));

    u.uScroll.value = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroCanvas({ className }: { className?: string }) {
  const ready = useWebGLReady();
  const { ref, inView, seen } = useInView<HTMLDivElement>();
  const [lost, setLost] = useState(false);

  return (
    <div ref={ref} className={className} aria-hidden>
      {/* Painted fallback: identical paper tone, so the swap is invisible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 46% at 78% 22%, #eccbb840 0%, transparent 66%), radial-gradient(34% 32% at 92% 6%, #2a9d8f1a 0%, transparent 64%), var(--color-paper)",
        }}
      />
      {ready && seen && !lost && (
        <Canvas
          onCreated={({ gl }) => {
            // A lost context leaves a dead black rectangle. Every one of these
            // canvases already paints a CSS fallback behind itself, so the
            // honest recovery is to unmount and show it.
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setLost(true);
            });
          }}
          className="!absolute inset-0"
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 1], fov: 50 }}
          frameloop={inView ? "always" : "never"}
        >
          <Surface />
        </Canvas>
      )}
    </div>
  );
}
