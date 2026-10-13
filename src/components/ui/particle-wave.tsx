"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";
import { cn } from "@/lib/utils";

interface ParticleWaveProps {
  className?: string;
}

const vertexShader = `
  attribute float scale;
  uniform float uTime;
  uniform float uPixelRatio;
  void main() {
    vec3 p = position;
    p.y += sin(p.x * 0.6 + uTime) * 0.55;
    p.y += cos(p.z * 0.45 + uTime * 0.7) * 0.3;
    p.x += sin(p.z * 0.4 + uTime) * 0.2;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(scale * 26.0 / -mvPosition.z, 1.4, 3.5) * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float alpha = (1.0 - smoothstep(0.2, 0.5, radius)) * uOpacity;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function ParticleWave({ className }: ParticleWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendererStatus, setRendererStatus] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let contextLost = false;
    let animationId: number | null = null;
    let lastFrame = 0;
    let renderer: Three.WebGLRenderer | null = null;
    let geometry: Three.BufferGeometry | null = null;
    let material: Three.ShaderMaterial | null = null;
    let scene: Three.Scene | null = null;
    let camera: Three.PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let themeObserver: MutationObserver | null = null;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactScreen = window.matchMedia("(max-width: 767px)");
    const mouse = { x: 0 };

    const stop = () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
    };

    const draw = (time: number, advance: boolean) => {
      if (!renderer || !scene || !camera || !material || contextLost || disposed) return;
      if (advance) {
        const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.1) : 0;
        material.uniforms.uTime.value += delta * 0.24;
        camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
      }
      lastFrame = time;
      camera.lookAt(0, -0.5, 0);
      renderer.render(scene, camera);
    };

    const animate = (time: number) => {
      animationId = null;
      if (disposed || contextLost || document.hidden || motionPreference.matches) return;
      if (!lastFrame || time - lastFrame >= 1000 / 30) draw(time, true);
      animationId = requestAnimationFrame(animate);
    };

    const resume = () => {
      stop();
      if (!renderer || disposed || contextLost || document.hidden) return;
      lastFrame = 0;
      draw(performance.now(), false);
      if (!motionPreference.matches) animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
      if (!renderer || !camera || !material) return;
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, compactScreen.matches ? 1.25 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      material.uniforms.uPixelRatio.value = pixelRatio;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      draw(performance.now(), false);
    };

    const updateTheme = () => {
      if (!material) return;
      const dark = document.documentElement.classList.contains("dark");
      material.uniforms.uColor.value.setScalar(dark ? 1 : 0.08);
      material.uniforms.uOpacity.value = dark ? 0.16 : 0.32;
      draw(performance.now(), false);
    };

    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motionPreference.matches) return;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stop();
      if (!disposed) setRendererStatus("fallback");
    };

    const onContextRestored = () => {
      if (disposed) return;
      contextLost = false;
      setRendererStatus("webgl");
      resize();
      resume();
    };

    const disposeResources = () => {
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      geometry = null;
      material = null;
      renderer = null;
      scene = null;
      camera = null;
    };

    const initialize = async () => {
      try {
        // Load the renderer after hydration so the background does not delay content.
        const THREE = await import("three");
        if (disposed) return;
        const context = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
        if (!context) {
          setRendererStatus("fallback");
          return;
        }
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
        renderer.setClearColor(0xffffff, 0);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(65, 1, 0.1, 100);
        camera.position.set(0, 8, 10);

        const amount = compactScreen.matches ? 90 : 140;
        const gap = 0.35;
        const positions = new Float32Array(amount * amount * 3);
        const scales = new Float32Array(amount * amount);
        for (let x = 0; x < amount; x++) {
          for (let y = 0; y < amount; y++) {
            const index = x * amount + y;
            positions[index * 3] = (x - amount / 2) * gap;
            positions[index * 3 + 2] = (y - amount / 2) * gap;
            scales[index] = 1;
          }
        }
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
        material = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 1.1 },
            uPixelRatio: { value: 1 },
            uColor: { value: new THREE.Vector3(0.08, 0.08, 0.08) },
            uOpacity: { value: 0.32 },
          },
        });
        scene.add(new THREE.Points(geometry, material));

        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        themeObserver = new MutationObserver(updateTheme);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        window.addEventListener("pointermove", pointerMove, { passive: true });
        document.addEventListener("visibilitychange", resume);
        motionPreference.addEventListener("change", resume);
        resize();
        updateTheme();
        setRendererStatus("webgl");
        resume();
      } catch {
        disposeResources();
        if (!disposed) setRendererStatus("fallback");
      }
    };

    void initialize();
    return () => {
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("visibilitychange", resume);
      motionPreference.removeEventListener("change", resume);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      disposeResources();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("particle-wave", className)} data-renderer={rendererStatus} aria-hidden="true">
      <canvas ref={canvasRef} className="particle-wave-canvas" />
    </div>
  );
}
