/** Cubic bezier point at t */
export function pointOnCubic(x0, y0, x1, y1, x2, y2, x3, y3, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
    y: u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
  };
}

/** Tangent angle (radians) on cubic at t */
export function tangentOnCubic(x0, y0, x1, y1, x2, y2, x3, y3, t) {
  const u = 1 - t;
  const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2);
  const dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2);
  return Math.atan2(dy, dx);
}

function fmt(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Lanceolate (almond) leaf growing from a base point at angle.
 * Returns an outline path and a center-vein path.
 */
export function leafShape(baseX, baseY, angleDeg, length = 18, width = 9) {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const perpX = -dirY;
  const perpY = dirX;
  const w = width / 2;

  const tipX = baseX + dirX * length;
  const tipY = baseY + dirY * length;

  // control points at ~35% and ~65% along the leaf, bulged out to each side
  const near = 0.32;
  const far = 0.68;

  const s1a = {
    x: baseX + dirX * length * near + perpX * w,
    y: baseY + dirY * length * near + perpY * w,
  };
  const s1b = {
    x: baseX + dirX * length * far + perpX * w,
    y: baseY + dirY * length * far + perpY * w,
  };
  const s2a = {
    x: baseX + dirX * length * far - perpX * w,
    y: baseY + dirY * length * far - perpY * w,
  };
  const s2b = {
    x: baseX + dirX * length * near - perpX * w,
    y: baseY + dirY * length * near - perpY * w,
  };

  const outline =
    `M${fmt(baseX)} ${fmt(baseY)} ` +
    `C${fmt(s1a.x)} ${fmt(s1a.y)} ${fmt(s1b.x)} ${fmt(s1b.y)} ${fmt(tipX)} ${fmt(tipY)} ` +
    `C${fmt(s2a.x)} ${fmt(s2a.y)} ${fmt(s2b.x)} ${fmt(s2b.y)} ${fmt(baseX)} ${fmt(baseY)} Z`;

  const vein = `M${fmt(baseX)} ${fmt(baseY)} L${fmt(tipX)} ${fmt(tipY)}`;

  return { outline, vein, tipX, tipY };
}

/**
 * Radial petal flower relative to origin (0,0). The preset controls how many
 * petals and their proportions, so different species read distinctly:
 *   blossom — 5 rounded petals (cherry/sakura)
 *   daisy   — 9 slim petals (showy bloom)
 *   pom     — 15 thin petals (chrysanthemum pompom)
 */
const PETAL_PRESETS = {
  blossom: { count: 5, rx: 0.32, ry: 0.56, cy: 0.5, center: 0.18 },
  daisy: { count: 9, rx: 0.18, ry: 0.64, cy: 0.56, center: 0.22 },
  pom: { count: 15, rx: 0.12, ry: 0.5, cy: 0.44, center: 0.3 },
};

export function petalFlower(size = 10, kind = "blossom") {
  const preset = PETAL_PRESETS[kind] || PETAL_PRESETS.blossom;
  const step = 360 / preset.count;
  const petals = Array.from({ length: preset.count }, (_, i) => ({
    rotate: i * step,
    rx: size * preset.rx,
    ry: size * preset.ry,
    cy: -size * preset.cy,
  }));
  return { petals, center: size * preset.center };
}

/**
 * Hanging bell cluster (wisteria-style) — small teardrop petals tapering
 * downward from the twig tip.
 */
export function bellCluster(size = 10) {
  return [
    { cx: 0, cy: size * 0.1, rx: size * 0.34, ry: size * 0.52, rotate: 0 },
    { cx: -size * 0.36, cy: size * 0.6, rx: size * 0.28, ry: size * 0.46, rotate: -16 },
    { cx: size * 0.34, cy: size * 0.66, rx: size * 0.26, ry: size * 0.44, rotate: 15 },
    { cx: -size * 0.06, cy: size * 1.12, rx: size * 0.22, ry: size * 0.4, rotate: -4 },
  ];
}

/** A curved sub-branch (vein) growing from a point at an angle. */
export function subBranch(sx, sy, angleDeg, length = 40, bowSign = 1) {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const perpX = -dirY * bowSign;
  const perpY = dirX * bowSign;

  const from = { x: sx, y: sy };
  const c1 = { x: sx + dirX * length * 0.34, y: sy + dirY * length * 0.34 };
  const c2 = {
    x: sx + dirX * length * 0.7 + perpX * length * 0.2,
    y: sy + dirY * length * 0.7 + perpY * length * 0.2,
  };
  const end = {
    x: sx + dirX * length + perpX * length * 0.32,
    y: sy + dirY * length + perpY * length * 0.32,
  };

  return {
    from,
    c1,
    c2,
    end,
    path: `M${fmt(from.x)} ${fmt(from.y)} C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(end.x)} ${fmt(end.y)}`,
  };
}

/** Short curved twig stem from a junction toward a target. */
export function twigStem(jx, jy, angleDeg, length = 16) {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const endX = jx + dirX * length;
  const endY = jy + dirY * length;
  // slight sideways bow for an organic feel
  const perpX = -dirY;
  const perpY = dirX;
  const mx = jx + dirX * length * 0.5 + perpX * 3;
  const my = jy + dirY * length * 0.5 + perpY * 3;
  return {
    path: `M${fmt(jx)} ${fmt(jy)} Q${fmt(mx)} ${fmt(my)} ${fmt(endX)} ${fmt(endY)}`,
    endX,
    endY,
  };
}

/** Small berry / bud cluster relative to origin. */
export function berryCluster(size = 5) {
  return [
    { cx: 0, cy: 0, r: size * 0.42 },
    { cx: -size * 0.5, cy: size * 0.2, r: size * 0.3 },
    { cx: size * 0.48, cy: size * 0.16, r: size * 0.28 },
  ];
}
