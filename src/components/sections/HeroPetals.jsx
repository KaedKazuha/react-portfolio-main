import { useEffect, useRef } from "react";

import { drawPetal } from "../effects/embroideryCanvas";
import { isLiteMode } from "../../hooks/useMobileProfile";

import styles from "./Hero.module.css";

const PETAL_TINTS = ["#fbcfe8", "#fce7f3", "#fdf2f8", "#f9a8d4", "#f5d0e6"];

/** Gentle cherry-blossom petals drifting down across the hero. */
export function HeroPetals() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    if (isLiteMode()) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = (a, b) => a + Math.random() * (b - a);
    const make = (seeded) => ({
      x: rand(0, width),
      y: seeded ? rand(0, height) : rand(-40, -10),
      size: rand(6, 12),
      vy: rand(0.25, 0.7),
      drift: rand(0.3, 1),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.008, 0.02),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.02, 0.02),
      color: PETAL_TINTS[Math.floor(Math.random() * PETAL_TINTS.length)],
      alpha: rand(0.35, 0.72),
    });

    const count = Math.max(10, Math.min(24, Math.round(width / 70)));
    let petals = Array.from({ length: count }, () => make(true));

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((p) => {
        p.phase += p.sway;
        p.x += Math.sin(p.phase) * p.drift;
        p.y += p.vy;
        p.rot += p.spin;
        drawPetal(ctx, p.x, p.y, p.size, p.rot, p.color, p.alpha);
        if (p.y > height + 24) Object.assign(p, make(false));
      });
      raf = window.requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.petalCanvas} aria-hidden="true" />;
}
