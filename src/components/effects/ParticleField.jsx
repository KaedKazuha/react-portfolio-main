import { useEffect, useRef } from "react";
import styles from "./ParticleField.module.css";

const PARTICLE_COLORS = ["#f472b6", "#e879f9", "#f0abfc", "#a78bfa", "#818cf8"];

export function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationId = 0;
    let particles = [];

    const createParticles = (width, height) => {
      const count = Math.min(55, Math.max(28, Math.floor(width / 28)));

      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.12),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.12),
        radius: Math.random() * 1.4 + 0.4,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: Math.random() * 0.22 + 0.06,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { innerWidth, innerHeight } = window;

      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = createParticles(innerWidth, innerHeight);
    };

    const draw = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }

        const twinkle = reducedMotion
          ? particle.alpha
          : particle.alpha + Math.sin(time * 0.001 + particle.pulse) * 0.06;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = Math.max(0.04, twinkle);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        animationId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw(0);

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
