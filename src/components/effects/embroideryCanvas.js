export const PARTICLE_COLORS = [
  "#fdf2f8", // pink white
  "#fce7f3", // pink white
  "#fff1f2", // rose white
  "#fbcfe8", // light pink
  "#e0e7ff", // blue white
  "#eef2ff", // whitish blue
  "#c7d2fe", // indigo white
  "#ddd6fe", // violet white
];

export function createAmbientParticle(width, height, reducedMotion) {
  return {
    kind: "ambient",
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.12),
    vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.12),
    radius: Math.random() * 1.6 + 0.6,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    alpha: Math.random() * 0.28 + 0.18,
    pulse: Math.random() * Math.PI * 2,
  };
}

export function spawnBurstParticles(x, y, count = 14) {
  return Array.from({ length: count }, (_, i) => ({
    kind: "burst",
    x,
    y,
    vx: (Math.random() - 0.5) * 1.8,
    vy: (Math.random() - 0.5) * 1.8 - 0.8,
    radius: Math.random() * 2.2 + 1.2,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    alpha: 0.85,
    life: 1,
    decay: 0.012 + Math.random() * 0.01,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.08,
  }));
}

export function drawPetal(ctx, x, y, radius, rotation, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.4, radius * 0.35, radius * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
