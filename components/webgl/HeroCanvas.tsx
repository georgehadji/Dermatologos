"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SIMPLEX_3D, useWebGLReady } from "@/lib/webgl";

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
  float glow = smoothstep(0.62, 0.0, d);

  float depth = field * 0.5 + 0.5;
  depth = mix(depth, depth + glow * 0.42, 0.85);

  // Vignette keeps the edges paper-clean so the section blends into the page.
  float edge = smoothstep(0.95, 0.25, length(p * vec2(0.82, 1.15)));

  vec3 col = uPaper;
  col = mix(col, uSkin, smoothstep(0.42, 0.95, depth) * 0.55 * edge);
  col = mix(col, uAccent, smoothstep(0.72, 1.0, depth) * 0.22 * edge);

  // Faint specular ridge where the warp folds over itself.
  float ridge = smoothstep(0.55, 0.58, abs(w2));
  col += ridge * 0.03 * edge;

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

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;
    u.uAspect.value = size.width / size.height;

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

  return (
    <div className={className} aria-hidden>
      {/* Painted fallback: identical paper tone, so the swap is invisible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 62% 42%, #eccbb855 0%, transparent 62%), radial-gradient(45% 40% at 28% 70%, #2a9d8f22 0%, transparent 60%), var(--color-paper)",
        }}
      />
      {ready && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 1], fov: 50 }}
          frameloop="always"
        >
          <Surface />
        </Canvas>
      )}
    </div>
  );
}
