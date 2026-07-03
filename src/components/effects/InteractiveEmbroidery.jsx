import { useCallback, useEffect, useRef, useState } from "react";
import { EmbroideryMotifs } from "./EmbroideryMotifs";
import { drawPetal, spawnBurstParticles } from "./embroideryCanvas";
import { buildEdgeThreads, buildMotifLayout, findThreadsNearPoint } from "./embroideryLayout";
import {
  createPakistaniEmbroideryState,
  disconnectThreads,
  drawPakistaniEmbroidery,
  syncPakistaniEmbroidery,
} from "./pakistaniEmbroidery";
import styles from "./InteractiveEmbroidery.module.css";

const MOTIF_SIDES = {
  vine: "left",
  wisteria: "left",
  chrysanthemum: "left",
  bamboo: "left",
  sakura: "right",
  bloom: "right",
  maple: "right",
};

export function InteractiveEmbroidery({ pageRef }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const burstRef = useRef([]);
  const activeMotifRef = useRef(null);
  const disconnectedRef = useRef(new Set());
  const pakistaniRef = useRef(
    createPakistaniEmbroideryState((width, height, reducedMotion) =>
      buildEdgeThreads(width, height, reducedMotion)
    )
  );
  const [activeMotif, setActiveMotif] = useState(null);
  const [disconnectedMotifs, setDisconnectedMotifs] = useState(() => new Set());
  const [motifLayout, setMotifLayout] = useState(null);

  const handleActivate = useCallback((id, action) => {
    if (disconnectedRef.current.has(id)) return;

    const el = document.querySelector(`[data-motif-id="${id}"]`);
    if (!el) return;

    if (action === "enter") {
      activeMotifRef.current = id;
      setActiveMotif(id);
    }

    if (action === "leave") {
      if (activeMotifRef.current === id) {
        activeMotifRef.current = null;
        setActiveMotif(null);
      }
    }

    if (action === "click") {
      const rect = el.getBoundingClientRect();
      const anchor = {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      };

      const side = MOTIF_SIDES[id];
      const threadIds = findThreadsNearPoint(
        pakistaniRef.current.threads,
        anchor.x,
        anchor.y,
        180,
        side
      );
      disconnectThreads(pakistaniRef.current, threadIds);

      disconnectedRef.current.add(id);
      setDisconnectedMotifs(new Set(disconnectedRef.current));
      activeMotifRef.current = null;
      setActiveMotif(null);

      burstRef.current.push(...spawnBurstParticles(anchor.x, anchor.y, 16));
    }
  }, []);

  useEffect(() => {
    const page = pageRef?.current;
    if (!page) return undefined;

    const updateLayout = () => {
      const height = page.offsetHeight || document.documentElement.scrollHeight;
      setMotifLayout(buildMotifLayout(height));
    };

    updateLayout();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateLayout) : null;
    observer?.observe(page);

    return () => observer?.disconnect();
  }, [pageRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationId = 0;
    let lastWidth = 0;
    let lastHeight = 0;

    const getSize = () => {
      const page = pageRef?.current;
      const width = page?.clientWidth ?? window.innerWidth;
      const height = page?.offsetHeight ?? page?.scrollHeight ?? document.documentElement.scrollHeight;
      return { width, height };
    };

    const syncCanvas = (width, height) => {
      lastWidth = width;
      lastHeight = height;
      syncPakistaniEmbroidery(width, height, reducedMotion, pakistaniRef.current);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = getSize();

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncCanvas(width, height);
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, lastWidth, lastHeight);
      drawPakistaniEmbroidery(ctx, time, reducedMotion, pakistaniRef.current);

      burstRef.current = burstRef.current.filter((particle) => {
        particle.life -= particle.decay;
        if (particle.life <= 0) return false;

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.02;
        particle.rotation += particle.spin;

        drawPetal(
          ctx,
          particle.x,
          particle.y,
          particle.radius * 1.6,
          particle.rotation,
          particle.color,
          particle.life * particle.alpha
        );
        return true;
      });

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      if (!reducedMotion) {
        animationId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw(0);

    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);

    const page = pageRef?.current;
    const resizeObserver =
      page && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.requestAnimationFrame(resize);
          })
        : null;
    resizeObserver?.observe(page);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", resize);
      resizeObserver?.disconnect();
    };
  }, [pageRef]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      {motifLayout && (
        <EmbroideryMotifs
          layout={motifLayout}
          onActivate={handleActivate}
          activeMotif={activeMotif}
          disconnectedMotifs={disconnectedMotifs}
        />
      )}
    </div>
  );
}
