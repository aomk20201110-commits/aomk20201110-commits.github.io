import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useMotionPreference } from "../../lib/motion";
import { useIsMobile } from "../../lib/useMediaQuery";

export type PointerTarget = { x: number; y: number };

const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uLight;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  float wave(vec2 p, vec2 source, float freq, float speed, float phase) {
    float d = distance(p, source);
    return sin(d * freq - uTime * speed + phase) * exp(-d * 0.16);
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xz;

    float h = 0.0;
    h += wave(p, vec2(-3.4, -1.4), 2.05, 1.10, 0.0);
    h += wave(p, vec2(2.9, 1.0), 1.70, -0.90, 1.7);
    h += wave(p, vec2(0.4, 2.6), 2.50, 0.72, 3.4);
    h *= 0.34;

    vec2 pointerPlane = uPointer * vec2(8.5, 5.5);
    float pd = distance(p, pointerPlane);
    h += sin(pd * 2.6 - uTime * 2.0) * exp(-pd * 0.55) * 0.40;

    float edge = smoothstep(0.0, 1.0, 1.0 - length(p) / 8.6);
    pos.y += h * (0.55 + edge * 0.45);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float energy = smoothstep(-0.35, 0.80, h + (aSeed - 0.5) * 0.16);
    vec3 low = mix(vec3(0.100, 0.240, 0.330), vec3(0.020, 0.170, 0.140), uLight);
    vec3 mid = mix(vec3(0.420, 0.800, 0.920), vec3(0.020, 0.430, 0.360), uLight);
    vec3 high = mix(vec3(0.880, 0.990, 1.000), vec3(0.000, 0.260, 0.210), uLight);
    vec3 color = mix(low, mid, energy);
    color = mix(color, high, smoothstep(0.76, 1.0, energy));
    vColor = color;
    vAlpha = mix(0.28, 0.40, uLight) + energy * mix(0.78, 0.62, uLight);

    float size = (1.1 + energy * 2.6) * uPixelRatio;
    gl_PointSize = clamp(size * (7.4 / max(-mvPosition.z, 0.1)), 1.0, 6.4 * uPixelRatio);
  }
`;

const waveFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float alpha = smoothstep(0.25, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

const gridVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragment = /* glsl */ `
  uniform float uTime;
  uniform float uLight;
  varying vec2 vUv;

  void main() {
    vec2 coord = (vUv - 0.5) * vec2(48.0, 30.0);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    float dist = length(vUv - 0.5);
    float fade = smoothstep(0.55, 0.06, dist);
    float ripple = 0.5 + 0.5 * sin(dist * 26.0 - uTime * 0.55);
    vec3 darkCol = mix(vec3(0.08, 0.18, 0.23), vec3(0.34, 0.76, 0.86), ripple * 0.55);
    vec3 lightCol = mix(vec3(0.07, 0.26, 0.21), vec3(0.01, 0.46, 0.37), ripple * 0.55);
    vec3 col = mix(darkCol, lightCol, uLight);
    gl_FragColor = vec4(col, line * fade * mix(0.38, 0.30, uLight));
  }
`;

function WaveField({
  pointerRef,
  reduced,
  mobile,
  running,
  light,
}: {
  pointerRef: RefObject<PointerTarget>;
  reduced: boolean;
  mobile: boolean;
  running: boolean;
  light: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const gridRef = useRef<THREE.ShaderMaterial>(null);
  const elapsed = useRef(2.4);
  const smoothed = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const cols = mobile ? 78 : 138;
    const rows = mobile ? 50 : 86;
    const width = 17;
    const depth = 11;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    let i = 0;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        positions[i * 3] = (x / (cols - 1) - 0.5) * width;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (y / (rows - 1) - 0.5) * depth;
        seeds[i] = Math.random();
        i += 1;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [mobile]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: elapsed.current },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      uLight: { value: light ? 1 : 0 },
    }),
    [light],
  );

  const gridUniforms = useMemo(() => ({ uTime: { value: 0 }, uLight: { value: light ? 1 : 0 } }), [light]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const step = Math.min(delta, 0.05);
    if (running && !reduced) elapsed.current += step;
    material.uniforms.uTime.value = elapsed.current;

    const target = pointerRef.current;
    smoothed.current.x += (target.x - smoothed.current.x) * 0.055;
    smoothed.current.y += (target.y - smoothed.current.y) * 0.055;
    (material.uniforms.uPointer.value as THREE.Vector2).set(smoothed.current.x, smoothed.current.y);

    if (gridRef.current) gridRef.current.uniforms.uTime.value = elapsed.current;
  });

  return (
    <>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={waveVertex}
          fragmentShader={waveFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </points>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]}>
        <planeGeometry args={[46, 30]} />
        <shaderMaterial
          ref={gridRef}
          vertexShader={gridVertex}
          fragmentShader={gridFragment}
          uniforms={gridUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function CameraRig({ pointerRef, reduced }: { pointerRef: RefObject<PointerTarget>; reduced: boolean }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const target = pointerRef.current;
    const x = reduced ? 0 : target.x * 0.62;
    const y = reduced ? 0 : target.y * 0.26;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.55 + y, 2.2, delta);
    camera.lookAt(0, -0.18, 0);
  });

  return null;
}

/**
 * Real-time interference field rendered with a custom point shader.
 * Lazy-loaded by the Hero, paused off-screen or in a hidden tab, and rendered
 * as a single static frame when reduced motion is requested.
 */
export default function HeroField({
  pointerRef,
  active = true,
  light = false,
}: {
  pointerRef: RefObject<PointerTarget>;
  active?: boolean;
  light?: boolean;
}) {
  const { reduced } = useMotionPreference();
  const mobile = useIsMobile();
  const [hidden, setHidden] = useState(false);
  const [supported] = useState(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!supported || failed) return null;

  const running = active && !hidden && !reduced;

  return (
    <Canvas
      dpr={mobile ? [1, 1.2] : [1, 1.6]}
      camera={{ position: [0, 2.55, 7.6], fov: 42, near: 0.1, far: 80 }}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x04070a, 0);
      }}
      onError={() => setFailed(true)}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <WaveField pointerRef={pointerRef} reduced={reduced} mobile={mobile} running={running} light={light} />
      <CameraRig pointerRef={pointerRef} reduced={reduced} />
    </Canvas>
  );
}
