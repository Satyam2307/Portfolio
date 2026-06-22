"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CinematicLayer
 * A transparent, full-bleed Three.js canvas that renders slow-floating
 * warm-orange + white bokeh particles with additive blending and a soft
 * mouse-parallax camera move. Purely decorative — sits between the video
 * layer and the text content (z-index controlled by parent).
 */
export default function CinematicLayer({ particleCount = 140 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Respect reduced-motion preference: render a single static frame.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- Soft circular sprite texture (drawn once on a canvas) ----
    const spriteCanvas = document.createElement("canvas");
    const spriteSize = 128;
    spriteCanvas.width = spriteSize;
    spriteCanvas.height = spriteSize;
    const ctx = spriteCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
      spriteSize / 2,
      spriteSize / 2,
      0,
      spriteSize / 2,
      spriteSize / 2,
      spriteSize / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, spriteSize, spriteSize);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);
    spriteTexture.needsUpdate = true;

    // ---- Particle geometry ----
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const baseX = new Float32Array(count);
    const baseY = new Float32Array(count);

    // Warm orange + white palette
    const palette = [
      new THREE.Color("#ff9b4a"), // warm orange
      new THREE.Color("#ffd9a8"), // soft amber-white
      new THREE.Color("#ffffff"), // pure white
      new THREE.Color("#ffb070"), // mid orange
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 14;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      baseX[i] = x;
      baseY[i] = y;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 1.6 + 0.4;
      speeds[i] = Math.random() * 0.4 + 0.15;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.4,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse parallax state ----
    const mouse = { x: 0, y: 0 };
    const targetCamPos = { x: 0, y: 0 };

    function handlePointerMove(e) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.x = nx;
      mouse.y = ny;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    function handleResize() {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    let rafId;
    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;

      for (let i = 0; i < count; i++) {
        const t = elapsed * speeds[i] + phases[i];
        posAttr.array[i * 3] = baseX[i] + Math.sin(t) * 0.9;
        posAttr.array[i * 3 + 1] = baseY[i] + Math.cos(t * 0.8) * 0.6;
      }
      posAttr.needsUpdate = true;

      // Smooth parallax camera follow
      targetCamPos.x += (mouse.x * 1.4 - targetCamPos.x) * 0.03;
      targetCamPos.y += (-mouse.y * 0.9 - targetCamPos.y) * 0.03;
      camera.position.x = targetCamPos.x;
      camera.position.y = targetCamPos.y;
      camera.lookAt(0, 0, 0);

      points.rotation.y = Math.sin(elapsed * 0.02) * 0.05;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [particleCount]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
