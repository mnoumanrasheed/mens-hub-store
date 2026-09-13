"use client";

import { useEffect, useRef } from "react";

/** Decorative light threads, loaded only when visible and motion is permitted. */
export function AtelierScene({ fabric = false }: { fabric?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;
    let destroy: (() => void) | undefined;
    let starting = false;
    async function start() {
      if (starting || disposed || media.matches || connection?.saveData) return;
      starting = true;
      try {
        const THREE = await import("three");
        if (disposed || media.matches || !element) return;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { alpha: true, antialias: false });
        if (!context) return;
        const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        element.appendChild(canvas);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
        camera.position.z = 8;
        const threads = new THREE.Group();
        const material = new THREE.LineBasicMaterial({ color: 0xd2ad45, transparent: true, opacity: 0.2 });
        const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
        for (let row = 0; row < 13; row++) {
          const points = [];
          for (let column = 0; column <= 90; column++) {
            const x = column / 90 * 14 - 7;
            points.push(new THREE.Vector3(x, Math.sin(x * 0.46 + row * 0.09) * 0.65 + row * 0.07 - 1.9, Math.cos(x * 0.3 + row * 0.12) * 0.5));
          }
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          geometries.push(geometry);
          threads.add(new THREE.Line(geometry, material));
        }
        scene.add(threads);
        const fabricGeometry = fabric ? new THREE.PlaneGeometry(7, 9, 40, 52) : null;
        const fabricMaterial = fabric ? new THREE.MeshStandardMaterial({ color: 0x79602b, metalness: 0.65, roughness: 0.42, side: THREE.DoubleSide }) : null;
        if (fabricGeometry && fabricMaterial) {
          scene.remove(threads);
          const cloth = new THREE.Mesh(fabricGeometry, fabricMaterial);
          cloth.rotation.z = -0.18;
          scene.add(cloth, new THREE.AmbientLight(0xf5f2ea, 0.7));
          const key = new THREE.DirectionalLight(0xf5f2ea, 3);
          key.position.set(-3, 4, 5);
          const rim = new THREE.DirectionalLight(0xd2ad45, 2);
          rim.position.set(4, -2, 3);
          scene.add(key, rim);
        }
        const resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect();
          renderer.setSize(Math.max(width, 1), Math.max(height, 1));
          camera.aspect = width / Math.max(height, 1);
          camera.updateProjectionMatrix();
        });
        resize.observe(element);
        let visible = true;
        let pointerX = 0;
        const onPointer = (event: PointerEvent) => { if (event.pointerType !== "touch") pointerX = event.clientX / window.innerWidth - 0.5; };
        let lastFrame = 0;
        const render = (time: number) => {
          if (fabric && time - lastFrame < 32) return;
          lastFrame = time;
          if (fabricGeometry) {
            const positions = fabricGeometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
              const x = positions.getX(i), y = positions.getY(i);
              positions.setZ(i, Math.sin(x * 2.2 + y * 0.35 + time * 0.0002) * 0.42 + Math.sin(y * 0.8 + time * 0.00012) * 0.18);
            }
            positions.needsUpdate = true;
            fabricGeometry.computeVertexNormals();
          }
          threads.rotation.y += (pointerX * 0.1 - threads.rotation.y) * 0.025;
          threads.rotation.z = Math.sin(time * 0.00012) * 0.035;
          renderer.render(scene, camera);
        };
        const updateLoop = () => renderer.setAnimationLoop(visible && !document.hidden && !media.matches ? render : null);
        const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateLoop(); });
        visibility.observe(element);
        const onContextLost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); };
        canvas.addEventListener("webglcontextlost", onContextLost);
        document.addEventListener("visibilitychange", updateLoop);
        element.parentElement?.addEventListener("pointermove", onPointer, { passive: true });
        updateLoop();
        destroy = () => {
          renderer.setAnimationLoop(null);
          visibility.disconnect(); resize.disconnect();
          document.removeEventListener("visibilitychange", updateLoop);
          element.parentElement?.removeEventListener("pointermove", onPointer);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          geometries.forEach((geometry) => geometry.dispose()); material.dispose(); renderer.dispose();
          fabricGeometry?.dispose(); fabricMaterial?.dispose();
          canvas.remove();
        };
      } catch { /* Photography and navigation remain usable without WebGL. */ }
    }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void start(); });
    observer.observe(element);
    const preferenceChanged = () => { destroy?.(); destroy = undefined; starting = false; if (!media.matches) void start(); };
    media.addEventListener("change", preferenceChanged);
    return () => { disposed = true; observer.disconnect(); media.removeEventListener("change", preferenceChanged); destroy?.(); };
  }, [fabric]);
  return <div ref={host} className="atelier-scene" aria-hidden="true" />;
}

