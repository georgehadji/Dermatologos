"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useWebGLReady } from "@/lib/webgl";

const vertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Water caustics for the footer — light read as clarity and hygiene.
 * Built from layered sine interference rather than noise: it is roughly four
 * times cheaper and the regular banding is exactly what caustics look like.
 */
const fragment = /* glsl */ `
precision mediump float;

varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform vec3  uInk;
uniform vec3  uAccent;

float caustic(vec2 p, float t){
  float v = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 q = p * (1.0 + fi * 0.62);
    q += vec2(sin(t * 0.37 + fi * 1.7), cos(t * 0.29 + fi * 2.3)) * 0.55;
    v += sin(q.x * 3.1 + t * 0.5 + fi) * sin(q.y * 2.7 - t * 0.41 + fi * 1.3);
  }
  v /= 4.0;
  // Sharpen the crests so the bright lines read as focused light, not haze.
  return pow(max(0.0, v * 0.5 + 0.5), 4.5);
}

void main(){
  vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5) * 2.4;
  float c = caustic(p, uTime);

  // Only the top edge is lit, as if the light entered from above the fold.
  float falloff = smoothstep(0.0, 0.85, vUv.y);

  vec3 col = uInk;
  col = mix(col, uAccent, c * 0.55 * falloff);
  col += c * 0.10 * falloff;

  gl_FragColor = vec4(col, 1.0);
}
`;

function Water() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uInk: { value: new THREE.Color("#10161a") },
      uAccent: { value: new THREE.Color("#145e58") },
    }),
    []
  );

  useFrame((_, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta * 0.6;
    u.uAspect.value = size.width / size.height;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function CausticsCanvas({ className }: { className?: string }) {
  const ready = useWebGLReady();

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-ink" />
      {ready && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: false }}
          camera={{ position: [0, 0, 1], fov: 50 }}
        >
          <Water />
        </Canvas>
      )}
    </div>
  );
}
