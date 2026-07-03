export function hashSeed(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function buildMotifLayout(pageHeight) {
  // vine + sakura live in the hero flourishes, so keep them out of the page
  // overlay to avoid identical branches sitting next to each other.
  const leftSlots = [
    { key: "wisteria", top: 22 + hashSeed(2) * 10 },
    { key: "chrysanthemum", top: 46 + hashSeed(3) * 12, interactive: true },
    { key: "bamboo", top: 68 + hashSeed(4) * 14, interactive: true },
  ];

  const rightSlots = [
    { key: "bloom", top: 24 + hashSeed(6) * 14, interactive: true },
    { key: "maple", top: 56 + hashSeed(7) * 16, interactive: true },
  ];

  return { leftSlots, rightSlots, pageHeight };
}

export function buildEdgeThreads(width, height, reducedMotion) {
  const perSide = Math.max(4, Math.min(8, Math.floor(height / 520)));
  const threads = [];

  const createThread = (side, index) => {
    const y = height * (0.08 + hashSeed(index * 11 + (side === "left" ? 3 : 9)) * 0.84);
    const reach = width * (0.18 + hashSeed(index * 19 + (side === "left" ? 7 : 13)) * 0.26);
    const wave = 32 + hashSeed(index * 23 + (side === "left" ? 0 : 5)) * 42;

    if (side === "left") {
      return {
        id: `thread-left-${index}`,
        side: "left",
        x0: 0,
        y0: y,
        x1: reach * 0.38,
        y1: y - wave,
        x2: reach * 0.72,
        y2: y + wave * 0.45,
        x3: reach,
        y3: y - wave * 0.12,
        progress: hashSeed(index * 5),
        speed: reducedMotion ? 0 : 0.0002 + hashSeed(index * 9) * 0.00022,
        disconnected: false,
      };
    }

    return {
      id: `thread-right-${index}`,
      side: "right",
      x0: width,
      y0: y,
      x1: width - reach * 0.38,
      y1: y + wave * 0.35,
      x2: width - reach * 0.72,
      y2: y - wave * 0.4,
      x3: width - reach,
      y3: y + wave * 0.1,
      progress: hashSeed(index * 5 + 1),
      speed: reducedMotion ? 0 : 0.0002 + hashSeed(index * 9 + 2) * 0.00022,
      disconnected: false,
    };
  };

  for (let i = 0; i < perSide; i += 1) {
    threads.push(createThread("left", i));
    threads.push(createThread("right", i));
  }

  return threads;
}

export function pointOnThread(thread, t) {
  const u = 1 - t;
  return {
    x:
      u ** 3 * thread.x0 +
      3 * u ** 2 * t * thread.x1 +
      3 * u * t ** 2 * thread.x2 +
      t ** 3 * thread.x3,
    y:
      u ** 3 * thread.y0 +
      3 * u ** 2 * t * thread.y1 +
      3 * u * t ** 2 * thread.y2 +
      t ** 3 * thread.y3,
  };
}

export function bindParticlesToThreads(particles, threads, width, height) {
  particles.forEach((particle, index) => {
    if (particle.boundThreadId && !particle.released) return;

    const thread = threads[index % threads.length];
    particle.boundThreadId = thread.id;
    particle.boundT = hashSeed(index * 31 + 4);
    particle.released = false;
    particle.releaseTimer = 0;
    const point = pointOnThread(thread, particle.boundT);
    particle.x = point.x + (hashSeed(index * 7) - 0.5) * 8;
    particle.y = point.y + (hashSeed(index * 13) - 0.5) * 8;
    particle.vx = 0;
    particle.vy = 0;
  });
}

export function releaseThreadParticles(particles, threadIds, burstRef, anchor) {
  const ids = new Set(threadIds);

  particles.forEach((particle) => {
    if (!particle.boundThreadId || !ids.has(particle.boundThreadId) || particle.released) return;

    particle.released = true;
    particle.releaseTimer = 90;
    particle.boundThreadId = null;

    const dx = particle.x - anchor.x;
    const dy = particle.y - anchor.y;
    const dist = Math.hypot(dx, dy) || 1;
    particle.vx += (dx / dist) * (1.8 + Math.random() * 1.2);
    particle.vy += (dy / dist) * (1.8 + Math.random() * 1.2);
  });

  burstRef.push(
    ...Array.from({ length: 12 }, (_, i) => ({
      kind: "burst",
      x: anchor.x,
      y: anchor.y,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4 - 0.6,
      radius: Math.random() * 2 + 1,
      color: ["#fdf2f8", "#e0e7ff", "#fbcfe8"][i % 3],
      alpha: 0.8,
      life: 1,
      decay: 0.014 + Math.random() * 0.01,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.08,
    }))
  );
}

export function findThreadsNearPoint(threads, x, y, radius = 140, side = null) {
  return threads
    .filter((thread) => {
      if (thread.disconnected) return false;
      if (side && thread.side !== side) return false;
      const mid = pointOnThread(thread, 0.55);
      return Math.hypot(mid.x - x, mid.y - y) < radius;
    })
    .map((thread) => thread.id);
}
