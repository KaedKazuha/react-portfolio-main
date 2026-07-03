import {
  bellCluster,
  berryCluster,
  leafShape,
  petalFlower,
  pointOnCubic,
  subBranch,
  tangentOnCubic,
  twigStem,
} from "./flourishShapes";

const PETAL_KINDS = new Set(["blossom", "daisy", "pom"]);

function fmt(n) {
  return Math.round(n * 10) / 10;
}

function pt(p) {
  return `${fmt(p.x)} ${fmt(p.y)}`;
}

/**
 * Build an organic branch — solid stem, alternating leaves with veins,
 * and terminal blossoms/berries on short twigs.
 */
let bloomSeed = 0;

function makeBloom({ jx, jy, angle, stemLen, type, size, rotation, interactive }, twigs) {
  const stem = twigStem(jx, jy, angle, stemLen);
  twigs.push({ path: stem.path, junction: { x: jx, y: jy } });

  // pendulum pivot: a point ~72% up the twig, close to the flower head
  const baseX = jx + (stem.endX - jx) * 0.72;
  const baseY = jy + (stem.endY - jy) * 0.72;

  bloomSeed += 1;

  const flower = PETAL_KINDS.has(type) ? petalFlower(size, type) : null;

  return {
    type,
    kind: PETAL_KINDS.has(type) ? "petal" : type,
    size,
    rotation: rotation ?? 0,
    interactive,
    cx: stem.endX,
    cy: stem.endY,
    baseX,
    baseY,
    seed: bloomSeed,
    petals: flower ? flower.petals : null,
    center: flower ? flower.center : 0,
    bells: type === "bell" ? bellCluster(size) : null,
    berries: type === "berry" ? berryCluster(size) : null,
  };
}

export function buildFlourish({ segments, rootTip, leafDefs = [], bloomDefs = [], veinDefs = [], extraPaths = [] }) {
  if (segments.length === 0) {
    return { rootAnchor: "", trunk: "", subStems: [], leaves: [], twigs: [], blooms: [], extras: extraPaths };
  }

  const first = segments[0];
  let trunk = `M${pt(first.from)} C${pt(first.c1)} ${pt(first.c2)} ${pt(first.to)}`;
  for (let i = 1; i < segments.length; i += 1) {
    const seg = segments[i];
    trunk += ` C${pt(seg.c1)} ${pt(seg.c2)} ${pt(seg.to)}`;
  }

  // Root anchor extends straight backward along the trunk's initial tangent,
  // so the branch reads as one continuous line from its origin (no L-kink).
  const dirX = first.c1.x - first.from.x;
  const dirY = first.c1.y - first.from.y;
  const dirLen = Math.hypot(dirX, dirY) || 1;
  const backLen = 24;
  const rootStart = {
    x: first.from.x - (dirX / dirLen) * backLen,
    y: first.from.y - (dirY / dirLen) * backLen,
  };
  const rootAnchor = `M${pt(rootStart)} L${pt(first.from)}`;

  const sampleSeg = (segment, t) => {
    const seg = segments[segment];
    const point = pointOnCubic(seg.from.x, seg.from.y, seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.to.x, seg.to.y, t);
    const tangent = tangentOnCubic(seg.from.x, seg.from.y, seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.to.x, seg.to.y, t);
    return { point, tangentDeg: (tangent * 180) / Math.PI };
  };

  // helper: sample a point + tangent along an arbitrary cubic
  const sampleCubic = (c, t) => {
    const point = pointOnCubic(c.from.x, c.from.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, c.end.x, c.end.y, t);
    const tangent = tangentOnCubic(c.from.x, c.from.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, c.end.x, c.end.y, t);
    return { point, tangentDeg: (tangent * 180) / Math.PI };
  };

  const leaves = [];
  const twigs = [];
  const blooms = [];
  const subStems = [];

  leafDefs.forEach(({ t, segment, side, length = 18, width = 9, angleOffset = 0 }) => {
    const { point, tangentDeg } = sampleSeg(segment, t);
    const angle = tangentDeg + side * 52 + angleOffset;
    const { outline, vein } = leafShape(point.x, point.y, angle, length, width);
    leaves.push({ outline, vein, junction: point });
  });

  bloomDefs.forEach(({ t, segment, side, stemLen = 16, type = "blossom", size = 10, rotation, interactive = false, angleOffset = 0 }) => {
    const { point, tangentDeg } = sampleSeg(segment, t);
    const angle = tangentDeg + side * 58 + angleOffset;
    blooms.push(makeBloom({ jx: point.x, jy: point.y, angle, stemLen, type, size, rotation, interactive }, twigs));
  });

  // Sub-branches (veins) — each sprouts its own leaves + tip bloom
  veinDefs.forEach(({ t, segment, side, length = 44, bow = 1, leafCount = 3, tip }) => {
    const { point, tangentDeg } = sampleSeg(segment, t);
    const angle = tangentDeg + side * 46;
    const vein = subBranch(point.x, point.y, angle, length, bow);
    subStems.push({ path: vein.path });

    // leaves alternating along the sub-branch
    for (let k = 0; k < leafCount; k += 1) {
      const lt = 0.35 + (k / Math.max(1, leafCount)) * 0.55;
      const leafSide = k % 2 === 0 ? 1 : -1;
      const sample = sampleCubic(vein, lt);
      const lAngle = sample.tangentDeg + leafSide * 55;
      const lLen = length * 0.32;
      const { outline, vein: leafVein } = leafShape(sample.point.x, sample.point.y, lAngle, lLen, lLen * 0.5);
      leaves.push({ outline, vein: leafVein, junction: sample.point });
    }

    if (tip) {
      const tipSample = sampleCubic(vein, 1);
      blooms.push(
        makeBloom(
          {
            jx: tipSample.point.x,
            jy: tipSample.point.y,
            angle: tipSample.tangentDeg,
            stemLen: tip.stemLen ?? 10,
            type: tip.type ?? "blossom",
            size: tip.size ?? 9,
            rotation: tip.rotation ?? 0,
            interactive: tip.interactive ?? false,
          },
          twigs
        )
      );
    }
  });

  return { rootAnchor, trunk, subStems, leaves, twigs, blooms, extras: extraPaths, root: { ...first.from } };
}

/**
 * transform-origin (as a CSS string) pinned to a branch's rooted point,
 * so cursor-driven rotation pivots there and the root never drifts.
 */
export function branchRootFraction(id, branch) {
  const vb = BRANCH_VIEWBOX[id];
  if (!vb || !branch?.root) return { x: 0, y: 0.5 };
  const [, , w, h] = vb.split(" ").map(Number);
  return { x: branch.root.x / w, y: branch.root.y / h };
}

export function branchRootOrigin(id, branch) {
  const { x, y } = branchRootFraction(id, branch);
  return `${fmt(x * 100)}% ${fmt(y * 100)}%`;
}

/** Left-edge branches */
export const LEFT_BRANCHES = {
  vine: buildFlourish({
    rootTip: { x: 0, y: 150 },
    segments: [
      { from: { x: 0, y: 132 }, c1: { x: 34, y: 122 }, c2: { x: 74, y: 104 }, to: { x: 116, y: 84 } },
      { from: { x: 116, y: 84 }, c1: { x: 158, y: 64 }, c2: { x: 196, y: 50 }, to: { x: 232, y: 38 } },
    ],
    leafDefs: [
      { t: 0.28, segment: 0, side: 1, length: 20, width: 10 },
      { t: 0.5, segment: 0, side: -1, length: 18, width: 9 },
      { t: 0.34, segment: 1, side: 1, length: 18, width: 9 },
      { t: 0.6, segment: 1, side: -1, length: 16, width: 8 },
    ],
    bloomDefs: [
      { t: 0.8, segment: 1, side: 1, stemLen: 14, type: "blossom", size: 11 },
      { t: 0.95, segment: 1, side: -1, stemLen: 11, type: "berry", size: 6 },
    ],
    veinDefs: [
      { t: 0.42, segment: 0, side: -1, length: 46, bow: -1, leafCount: 3, tip: { type: "blossom", size: 9 } },
      { t: 0.55, segment: 1, side: 1, length: 40, bow: 1, leafCount: 2, tip: { type: "berry", size: 6 } },
    ],
  }),

  wisteria: buildFlourish({
    rootTip: { x: 0, y: 378 },
    segments: [
      { from: { x: 0, y: 312 }, c1: { x: 42, y: 272 }, c2: { x: 66, y: 236 }, to: { x: 44, y: 190 } },
      { from: { x: 44, y: 190 }, c1: { x: 24, y: 148 }, c2: { x: 34, y: 92 }, to: { x: 78, y: 46 } },
    ],
    extraPaths: ["M78 46 C100 28 118 38 100 58 C86 72 70 68 78 46 Z"],
    leafDefs: [
      { t: 0.22, segment: 0, side: 1, length: 20, width: 10 },
      { t: 0.4, segment: 0, side: -1, length: 18, width: 9 },
      { t: 0.58, segment: 0, side: 1, length: 19, width: 9 },
      { t: 0.75, segment: 0, side: -1, length: 16, width: 8 },
      { t: 0.32, segment: 1, side: 1, length: 17, width: 8 },
      { t: 0.55, segment: 1, side: -1, length: 15, width: 7 },
    ],
    bloomDefs: [
      { t: 0.85, segment: 1, side: 1, stemLen: 15, type: "bell", size: 12 },
      { t: 0.62, segment: 1, side: -1, stemLen: 13, type: "bell", size: 10 },
    ],
    veinDefs: [
      { t: 0.4, segment: 0, side: 1, length: 50, bow: 1, leafCount: 3, tip: { type: "bell", size: 10 } },
      { t: 0.65, segment: 0, side: -1, length: 42, bow: -1, leafCount: 3, tip: { type: "bell", size: 9 } },
      { t: 0.4, segment: 1, side: -1, length: 38, bow: -1, leafCount: 2, tip: { type: "bell", size: 9 } },
    ],
  }),

  chrysanthemum: buildFlourish({
    rootTip: { x: 0, y: 118 },
    segments: [
      { from: { x: 0, y: 96 }, c1: { x: 46, y: 56 }, c2: { x: 104, y: 60 }, to: { x: 140, y: 92 } },
      { from: { x: 140, y: 92 }, c1: { x: 178, y: 120 }, c2: { x: 216, y: 110 }, to: { x: 242, y: 74 } },
    ],
    leafDefs: [
      { t: 0.34, segment: 0, side: 1, length: 17, width: 9 },
      { t: 0.62, segment: 0, side: -1, length: 15, width: 8 },
      { t: 0.45, segment: 1, side: 1, length: 15, width: 8 },
    ],
    bloomDefs: [
      { t: 0.82, segment: 1, side: 1, stemLen: 16, type: "pom", size: 13, interactive: true },
    ],
    veinDefs: [
      { t: 0.5, segment: 0, side: -1, length: 36, bow: -1, leafCount: 3, tip: { type: "pom", size: 10, interactive: true } },
    ],
  }),

  bamboo: buildFlourish({
    rootTip: { x: 0, y: 418 },
    segments: [
      { from: { x: 0, y: 332 }, c1: { x: 44, y: 292 }, c2: { x: 64, y: 244 }, to: { x: 44, y: 196 } },
      { from: { x: 44, y: 196 }, c1: { x: 24, y: 150 }, c2: { x: 36, y: 92 }, to: { x: 76, y: 44 } },
    ],
    leafDefs: [
      { t: 0.24, segment: 0, side: 1, length: 26, width: 6 },
      { t: 0.44, segment: 0, side: -1, length: 24, width: 6 },
      { t: 0.66, segment: 0, side: 1, length: 22, width: 5 },
      { t: 0.28, segment: 1, side: -1, length: 22, width: 5 },
      { t: 0.5, segment: 1, side: 1, length: 20, width: 5 },
      { t: 0.72, segment: 1, side: -1, length: 18, width: 4 },
    ],
    bloomDefs: [
      { t: 0.88, segment: 1, side: 1, stemLen: 13, type: "berry", size: 7, interactive: true },
      { t: 0.95, segment: 1, side: -1, stemLen: 11, type: "berry", size: 6, interactive: true },
    ],
    veinDefs: [
      { t: 0.4, segment: 0, side: 1, length: 48, bow: 1, leafCount: 3, tip: { type: "berry", size: 6, interactive: true } },
      { t: 0.55, segment: 1, side: -1, length: 42, bow: -1, leafCount: 3, tip: { type: "berry", size: 6, interactive: true } },
    ],
  }),
};

/** Right-edge branches */
export const RIGHT_BRANCHES = {
  sakura: buildFlourish({
    rootTip: { x: 418, y: 0 },
    segments: [
      { from: { x: 338, y: 18 }, c1: { x: 300, y: 66 }, c2: { x: 256, y: 54 }, to: { x: 214, y: 94 } },
      { from: { x: 214, y: 94 }, c1: { x: 166, y: 136 }, c2: { x: 168, y: 204 }, to: { x: 110, y: 236 } },
    ],
    leafDefs: [
      { t: 0.3, segment: 0, side: -1, length: 19, width: 9 },
      { t: 0.52, segment: 0, side: 1, length: 17, width: 8 },
      { t: 0.34, segment: 1, side: -1, length: 19, width: 9 },
      { t: 0.58, segment: 1, side: 1, length: 16, width: 8 },
    ],
    bloomDefs: [
      { t: 0.72, segment: 0, side: -1, stemLen: 14, type: "blossom", size: 12 },
      { t: 0.85, segment: 1, side: -1, stemLen: 13, type: "berry", size: 6 },
    ],
    veinDefs: [
      { t: 0.45, segment: 0, side: 1, length: 46, bow: 1, leafCount: 3, tip: { type: "blossom", size: 9 } },
      { t: 0.5, segment: 1, side: 1, length: 40, bow: 1, leafCount: 2, tip: { type: "berry", size: 6 } },
    ],
  }),

  bloom: buildFlourish({
    rootTip: { x: 478, y: 188 },
    segments: [
      { from: { x: 338, y: 150 }, c1: { x: 298, y: 114 }, c2: { x: 248, y: 120 }, to: { x: 206, y: 146 } },
      { from: { x: 206, y: 146 }, c1: { x: 156, y: 178 }, c2: { x: 98, y: 150 }, to: { x: 34, y: 110 } },
    ],
    leafDefs: [
      { t: 0.25, segment: 0, side: -1, length: 18, width: 9 },
      { t: 0.45, segment: 0, side: 1, length: 16, width: 8 },
      { t: 0.3, segment: 1, side: -1, length: 19, width: 9 },
      { t: 0.55, segment: 1, side: 1, length: 16, width: 8 },
    ],
    bloomDefs: [
      { t: 0.38, segment: 0, side: -1, stemLen: 18, type: "daisy", size: 15, interactive: true },
      { t: 0.58, segment: 1, side: -1, stemLen: 16, type: "daisy", size: 12, interactive: true },
      { t: 0.78, segment: 1, side: 1, stemLen: 14, type: "berry", size: 7, interactive: true },
    ],
    veinDefs: [
      { t: 0.5, segment: 0, side: 1, length: 44, bow: 1, leafCount: 3, tip: { type: "daisy", size: 10, interactive: true } },
      { t: 0.6, segment: 1, side: -1, length: 40, bow: -1, leafCount: 2, tip: { type: "berry", size: 6, interactive: true } },
    ],
  }),

  maple: buildFlourish({
    rootTip: { x: 398, y: 268 },
    segments: [
      { from: { x: 318, y: 220 }, c1: { x: 280, y: 200 }, c2: { x: 240, y: 166 }, to: { x: 212, y: 158 } },
      { from: { x: 212, y: 158 }, c1: { x: 160, y: 146 }, c2: { x: 120, y: 96 }, to: { x: 50, y: 66 } },
    ],
    extraPaths: ["M212 158 C190 142 182 116 200 104 C214 96 226 112 212 158 Z"],
    leafDefs: [
      { t: 0.32, segment: 0, side: -1, length: 17, width: 13 },
      { t: 0.55, segment: 0, side: 1, length: 15, width: 12 },
      { t: 0.42, segment: 1, side: -1, length: 16, width: 13 },
    ],
    bloomDefs: [
      { t: 0.68, segment: 0, side: -1, stemLen: 15, type: "berry", size: 8, interactive: true },
      { t: 0.82, segment: 1, side: -1, stemLen: 14, type: "berry", size: 7, interactive: true },
    ],
    veinDefs: [
      { t: 0.45, segment: 0, side: 1, length: 46, bow: 1, leafCount: 3, tip: { type: "berry", size: 7, interactive: true } },
      { t: 0.55, segment: 1, side: 1, length: 40, bow: 1, leafCount: 2, tip: { type: "berry", size: 6, interactive: true } },
    ],
  }),
};

export const BRANCH_VIEWBOX = {
  vine: "0 0 250 170",
  wisteria: "0 0 180 350",
  chrysanthemum: "0 0 255 155",
  bamboo: "0 0 165 350",
  sakura: "0 0 345 300",
  bloom: "0 0 350 195",
  maple: "0 0 325 245",
};

/** Rendered width per motif — keeps tall branches from becoming oversized. */
export const BRANCH_WIDTH = {
  vine: "min(22vw, 220px)",
  wisteria: "min(16vw, 170px)",
  chrysanthemum: "min(26vw, 260px)",
  bamboo: "min(15vw, 160px)",
  sakura: "min(26vw, 300px)",
  bloom: "min(28vw, 320px)",
  maple: "min(26vw, 300px)",
};
