"use client";

import { useEffect, useRef } from "react";

export function ProductShowroomScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navConnection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let starting = false;

    async function init3D() {
      if (starting || disposed || navConnection?.saveData) return;
      starting = true;

      try {
        const THREE = await import("three");
        if (disposed || !container) return;

        // Canvas Setup
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
        if (!context) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          context,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        container.appendChild(canvas);

        // Scene & Camera Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(2.5, 2.2, 7.5);
        camera.lookAt(0.8, 0.4, 0);

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xf5f3ef, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.8);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.0001;
        scene.add(keyLight);

        const goldRimLight = new THREE.SpotLight(0xd2ad45, 3.5, 15, Math.PI / 4, 0.5);
        goldRimLight.position.set(-4, 4, 3);
        scene.add(goldRimLight);

        const fillLight = new THREE.DirectionalLight(0x90a4ae, 0.8);
        fillLight.position.set(-3, -2, -3);
        scene.add(fillLight);

        // Group for all showroom objects
        const showroomGroup = new THREE.Group();
        showroomGroup.position.set(0.9, -0.6, 0);
        scene.add(showroomGroup);

        // Materials
        const darkSlateMaterial = new THREE.MeshStandardMaterial({
          color: 0x1c1c1f,
          roughness: 0.35,
          metalness: 0.4,
        });

        const goldMetalMaterial = new THREE.MeshStandardMaterial({
          color: 0xc59b27,
          roughness: 0.2,
          metalness: 0.85,
        });

        const blackMatteMaterial = new THREE.MeshStandardMaterial({
          color: 0x111113,
          roughness: 0.6,
          metalness: 0.1,
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.45,
          roughness: 0.1,
          metalness: 0.1,
          transmission: 0.85,
          ior: 1.4,
        });

        // 1. Base Main Plinth (Podium)
        const baseGeometry = new THREE.CylinderGeometry(2.4, 2.6, 0.5, 64);
        const basePlinth = new THREE.Mesh(baseGeometry, darkSlateMaterial);
        basePlinth.receiveShadow = true;
        basePlinth.castShadow = true;
        showroomGroup.add(basePlinth);

        // Gold Trim Ring around base plinth
        const ringGeometry = new THREE.TorusGeometry(2.42, 0.03, 16, 64);
        const trimRing = new THREE.Mesh(ringGeometry, goldMetalMaterial);
        trimRing.rotation.x = Math.PI / 2;
        trimRing.position.y = 0.25;
        showroomGroup.add(trimRing);

        // 2. Secondary Elevated Pedestal
        const pedestalGeometry = new THREE.CylinderGeometry(1.1, 1.2, 0.7, 48);
        const pedestal = new THREE.Mesh(pedestalGeometry, darkSlateMaterial);
        pedestal.position.set(-0.6, 0.55, 0.3);
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        showroomGroup.add(pedestal);

        const pedRingGeo = new THREE.TorusGeometry(1.11, 0.025, 16, 48);
        const pedTrimRing = new THREE.Mesh(pedRingGeo, goldMetalMaterial);
        pedTrimRing.rotation.x = Math.PI / 2;
        pedTrimRing.position.set(-0.6, 0.9, 0.3);
        showroomGroup.add(pedTrimRing);

        // 3. Abstract Luxury Perfume Bottle (Placed on secondary pedestal)
        const perfumeGroup = new THREE.Group();
        perfumeGroup.position.set(-0.6, 1.35, 0.3);

        const bottleGeo = new THREE.BoxGeometry(0.55, 0.85, 0.35);
        const bottleBody = new THREE.Mesh(bottleGeo, glassMaterial);
        bottleBody.castShadow = true;
        perfumeGroup.add(bottleBody);

        const collarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 24);
        const bottleCollar = new THREE.Mesh(collarGeo, goldMetalMaterial);
        bottleCollar.position.y = 0.48;
        perfumeGroup.add(bottleCollar);

        const capGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const bottleCap = new THREE.Mesh(capGeo, blackMatteMaterial);
        bottleCap.position.y = 0.65;
        perfumeGroup.add(bottleCap);

        showroomGroup.add(perfumeGroup);

        // 4. Luxury Watch Display (Placed right side on main plinth)
        const watchGroup = new THREE.Group();
        watchGroup.position.set(0.9, 0.55, -0.2);
        watchGroup.rotation.y = -Math.PI / 6;

        const bezelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 32);
        const watchBezel = new THREE.Mesh(bezelGeo, goldMetalMaterial);
        watchBezel.castShadow = true;
        watchGroup.add(watchBezel);

        const dialGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.11, 32);
        const watchDial = new THREE.Mesh(dialGeo, blackMatteMaterial);
        watchGroup.add(watchDial);

        const strapGeo = new THREE.TorusGeometry(0.48, 0.08, 16, 32, Math.PI * 1.2);
        const watchStrap = new THREE.Mesh(strapGeo, darkSlateMaterial);
        watchStrap.rotation.x = Math.PI / 2;
        watchStrap.rotation.y = Math.PI / 2;
        watchGroup.add(watchStrap);

        showroomGroup.add(watchGroup);

        // 5. Premium Gift Box / Shopping Box (Placed back side)
        const boxGeo = new THREE.BoxGeometry(1.2, 0.7, 0.9);
        const giftBox = new THREE.Mesh(boxGeo, blackMatteMaterial);
        giftBox.position.set(0.4, 0.55, -0.9);
        giftBox.rotation.y = Math.PI / 8;
        giftBox.castShadow = true;
        giftBox.receiveShadow = true;
        showroomGroup.add(giftBox);

        const boxRibbonGeo = new THREE.BoxGeometry(1.22, 0.72, 0.12);
        const giftRibbon = new THREE.Mesh(boxRibbonGeo, goldMetalMaterial);
        giftRibbon.position.set(0.4, 0.55, -0.9);
        giftRibbon.rotation.y = Math.PI / 8;
        showroomGroup.add(giftRibbon);

        // 6. Floating Abstract Geometric Accents
        const floatingGroup = new THREE.Group();

        const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
        const goldSphere = new THREE.Mesh(sphereGeo, goldMetalMaterial);
        goldSphere.position.set(1.6, 1.8, 0.5);
        goldSphere.castShadow = true;
        floatingGroup.add(goldSphere);

        const ringFloatGeo = new THREE.TorusGeometry(0.35, 0.02, 16, 32);
        const floatRing = new THREE.Mesh(ringFloatGeo, goldMetalMaterial);
        floatRing.position.set(-1.6, 1.6, -0.2);
        floatRing.rotation.x = Math.PI / 3;
        floatingGroup.add(floatRing);

        const smallBoxGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const floatBox = new THREE.Mesh(smallBoxGeo, darkSlateMaterial);
        floatBox.position.set(0.1, 2.2, 0.8);
        floatBox.rotation.set(0.5, 0.5, 0);
        floatingGroup.add(floatBox);

        showroomGroup.add(floatingGroup);

        // Handle Resize
        const handleResize = () => {
          if (!container) return;
          const { width, height } = container.getBoundingClientRect();
          const targetW = Math.max(width, 1);
          const targetH = Math.max(height, 1);
          renderer.setSize(targetW, targetH);
          camera.aspect = targetW / targetH;
          camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize();

        // Animation Loop & Interaction
        let isVisible = true;
        let pointerX = 0;
        let pointerY = 0;

        const onPointerMove = (e: PointerEvent) => {
          if (e.pointerType !== "touch") {
            pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
            pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
          }
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });

        const clock = new THREE.Clock();

        const render = () => {
          const elapsedTime = clock.getElapsedTime();

          if (!mediaQuery.matches) {
            // Gentle rotation & floating motions
            showroomGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.18 + pointerX * 0.12;
            showroomGroup.rotation.x = pointerY * 0.05;

            perfumeGroup.position.y = 1.35 + Math.sin(elapsedTime * 1.5) * 0.04;
            perfumeGroup.rotation.y = elapsedTime * 0.3;

            floatingGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;
            goldSphere.rotation.y = elapsedTime * 0.5;
            floatRing.rotation.z = elapsedTime * 0.4;
            floatBox.rotation.y = elapsedTime * 0.3;
          }

          renderer.render(scene, camera);
        };

        const updateLoop = () => {
          if (isVisible && !document.hidden) {
            renderer.setAnimationLoop(render);
          } else {
            renderer.setAnimationLoop(null);
          }
        };

        const visibilityObserver = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          updateLoop();
        });
        visibilityObserver.observe(container);

        const onVisibilityChange = () => updateLoop();
        document.addEventListener("visibilitychange", onVisibilityChange);

        updateLoop();

        // Cleanup
        cleanup = () => {
          renderer.setAnimationLoop(null);
          visibilityObserver.disconnect();
          resizeObserver.disconnect();
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("visibilitychange", onVisibilityChange);

          // Dispose Geometries & Materials
          [baseGeometry, ringGeometry, pedestalGeometry, pedRingGeo, bottleGeo, collarGeo, capGeo, bezelGeo, dialGeo, strapGeo, boxGeo, boxRibbonGeo, sphereGeo, ringFloatGeo, smallBoxGeo].forEach((g) => g.dispose());
          [darkSlateMaterial, goldMetalMaterial, blackMatteMaterial, glassMaterial].forEach((m) => m.dispose());
          renderer.dispose();
          canvas.remove();
        };
      } catch {
        /* Fallback canvas rendered if WebGL fails */
      }
    }

    const startObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void init3D();
      }
    });

    startObserver.observe(container);

    return () => {
      disposed = true;
      startObserver.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
