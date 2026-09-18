"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SIMPLEX_3D, useInView, useWebGLReady } from "@/lib/webgl";

// 3000 is the mobile-safe baseline; raise only after profiling on a real phone.
const COUNT = 3000;

const vertex = /* glsl */ `
precision highp float;

attribute float aSeed;
attribute float aScale;

uniform float uTime;
uniform float uEnergy;   // 0 idle drift .. 1 gathered into a ring
uniform float uPixelRatio;

varying float vAlpha;

${SIMPLEX_3D}

void main(){
  vec3 pos = position;

  // Slow curl-like drift. Two offset noise lookups approximate a divergence-free
  // field closely enough at this scale and cost a fraction of a real curl.
  float t = uTime * 0.08 + aSeed * 6.28;
  vec3 n = vec3(
    snoise(vec3(pos.xy * 0.45, t)),
    snoise(vec3(pos.yx * 0.45, t + 11.3)),
    snoise(vec3(pos.xy * 0.30, t + 27.1))
  );
  pos += n * vec3(0.55, 0.55, 0.35);

  // On hover the field collapses toward a ring: the "lens" reading of the section.
  float ang = aSeed * 6.2831853;
  float radius = 2.35 + sin(aSeed * 31.7) * 0.12;
  vec3 ring = vec3(cos(ang) * radius, sin(ang) * radius * 0.62, 0.0);
  pos = mix(pos, ring + n * 0.28, uEnergy);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (27.0 / -mv.z);

  vAlpha = (0.13 + aScale * 0.20) * (0.55 + uEnergy * 0.45);
}
`;

const fragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
uniform vec3 uColor;

void main(){
  // Soft round sprite without a texture fetch.
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

function Points({ energy }: { energy: React.RefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const scale = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Sample a disc with sqrt so density stays even toward the rim.
      const r = Math.sqrt(Math.random()) * 3.1;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.62;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      seed[i] = Math.random();
      scale[i] = 0.5 + Math.random() * 1.4;
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    return g;
  }, []);

  // The geometry is created here, not by R3F, so R3F will not dispose it.
  // Without this the position buffers stay in VRAM after the section unmounts.
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color("#145e58") },
    }),
    []
  );

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uPixelRatio.value = Math.min(state.viewport.dpr, 2);
    u.uEnergy.value += (energy.current - u.uEnergy.value) * Math.min(1, delta * 3);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/**
 * Ambient particle layer for the conditions grid. `active` is passed as a ref so
 * hovering a card does not re-render the React tree 60 times a second.
 */
export default function ParticleField({
  active,
  className,
}: {
  active: React.RefObject<number>;
  className?: string;
}) {
  const ready = useWebGLReady();
  const { ref, inView, seen } = useInView<HTMLDivElement>();
  const [lost, setLost] = useState(false);

  return (
    <div ref={ref} className={className} aria-hidden>
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
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.2], fov: 50 }}
        frameloop={inView ? "always" : "never"}
      >
        <Points energy={active} />
      </Canvas>
      )}
    </div>
  );
}
