"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WebShooterCursor.module.css";

export default function WebShooterCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Active web shooter animations
    let webs = [];

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }

      // Check if hovering over clickable element
      const target = e.target;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest('[role="button"]') ||
          target.closest('[tabindex]:not([tabindex="-1"])'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Spider-Man Web Shoot Animation on Click
    const handleMouseDown = (e) => {
      setIsClicking(true);

      const originX = e.clientX;
      const originY = e.clientY;
      const strandCount = 9;
      const strands = [];

      for (let i = 0; i < strandCount; i++) {
        const baseAngle = (i / strandCount) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 0.35;
        const angle = baseAngle + jitter;
        const maxDist = 45 + Math.random() * 55; // 45px to 100px web spread
        strands.push({
          angle,
          maxDist,
        });
      }

      webs.push({
        x: originX,
        y: originY,
        strands,
        progress: 0,
        opacity: 1,
        startTime: performance.now(),
        duration: 480, // 480ms duration
      });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Main Animation Loop
    let animId;
    const render = (time) => {
      // 1. Lerp cursor ring position smoothly
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      // 2. Render Web-Shooter bursts on canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (webs.length > 0) {
        webs = webs.filter((web) => {
          const elapsed = time - web.startTime;
          const t = Math.min(1, elapsed / web.duration);

          // Fast outward shoot then smooth fade out
          const shootProgress = Math.sin((t * Math.PI) / 2);
          web.opacity = Math.max(0, 1 - Math.pow(t, 1.8));

          ctx.save();
          ctx.globalAlpha = web.opacity;

          // Draw central web impact node
          ctx.beginPath();
          ctx.arc(web.x, web.y, 3 * (1 - t), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ff7a18";
          ctx.shadowBlur = 10;
          ctx.fill();

          // Draw radiating silk web strands
          web.strands.forEach((strand) => {
            const currentDist = strand.maxDist * shootProgress;
            const endX = web.x + Math.cos(strand.angle) * currentDist;
            const endY = web.y + Math.sin(strand.angle) * currentDist;

            ctx.beginPath();
            ctx.moveTo(web.x, web.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "rgba(255, 230, 210, 0.9)";
            ctx.lineWidth = 1.3 * (1 - t * 0.5);
            ctx.stroke();

            // Web anchor tip
            ctx.beginPath();
            ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ff7a18";
            ctx.fill();
          });

          // Draw concentric connecting silk spider web arcs
          const arcRings = [0.35, 0.65, 0.95];
          arcRings.forEach((ringPercent) => {
            if (shootProgress > ringPercent * 0.7) {
              ctx.beginPath();
              web.strands.forEach((strand, idx) => {
                const r = strand.maxDist * shootProgress * ringPercent;
                const ptX = web.x + Math.cos(strand.angle) * r;
                const ptY = web.y + Math.sin(strand.angle) * r;

                if (idx === 0) {
                  ctx.moveTo(ptX, ptY);
                } else {
                  // Slight curved sag between strands for spider-web look
                  const prevStrand = web.strands[idx - 1];
                  const prevX = web.x + Math.cos(prevStrand.angle) * r;
                  const prevY = web.y + Math.sin(prevStrand.angle) * r;
                  const midAngle = (prevStrand.angle + strand.angle) / 2;
                  const sagR = r * 0.88;
                  const cpx = web.x + Math.cos(midAngle) * sagR;
                  const cpy = web.y + Math.sin(midAngle) * sagR;
                  ctx.quadraticCurveTo(cpx, cpy, ptX, ptY);
                }
              });
              // Close last strand to first
              const lastStrand = web.strands[web.strands.length - 1];
              const firstStrand = web.strands[0];
              const r = firstStrand.maxDist * shootProgress * ringPercent;
              const fX = web.x + Math.cos(firstStrand.angle) * r;
              const fY = web.y + Math.sin(firstStrand.angle) * r;
              const midAngle = (lastStrand.angle + firstStrand.angle + Math.PI * 2) / 2;
              const cpx = web.x + Math.cos(midAngle) * (r * 0.88);
              const cpy = web.y + Math.sin(midAngle) * (r * 0.88);
              ctx.quadraticCurveTo(cpx, cpy, fX, fY);

              ctx.strokeStyle = "rgba(255, 122, 24, 0.55)";
              ctx.lineWidth = 0.9 * (1 - t * 0.6);
              ctx.stroke();
            }
          });

          ctx.restore();

          return t < 1;
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`${styles.cursorContainer} ${isHovering ? styles.hovering : ""} ${
        isClicking ? styles.clicking : ""
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.webCanvas} />
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={ringRef} className={styles.cursorRing} />
    </div>
  );
}
