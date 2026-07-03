import { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import {
  BRANCH_VIEWBOX,
  BRANCH_WIDTH,
  LEFT_BRANCHES,
  RIGHT_BRANCHES,
  branchRootFraction,
  branchRootOrigin,
} from "./branchPaths";
import { useCursorBend } from "./useCursorBend";
import styles from "./InteractiveEmbroidery.module.css";

const MotifMount = forwardRef(function MotifMount(
  { side, top, width, className = "", interactive = false, disconnected = false, children },
  ref
) {
  const sideClass = side === "left" ? styles.fromLeft : styles.fromRight;
  return (
    <div
      ref={ref}
      className={`${styles.motifMount} ${sideClass} ${className}${interactive ? ` ${styles.interactiveMount}` : ""}${disconnected ? ` ${styles.motifDisconnected}` : ""}`}
      style={{ top: `${top}%`, ...(width ? { width } : {}) }}
    >
      {children}
    </div>
  );
});

function FlourishBloom({ bloom, enlarged, liteMode = false }) {
  const scale = enlarged && !liteMode ? 1.5 : 1;
  const petalClass = bloom.interactive ? styles.flourishPetalInteractive : styles.flourishPetal;

  const amp = enlarged ? 1.5 : 3 + (bloom.seed % 4);
  const dur = 3 + (bloom.seed % 5) * 0.45;
  const delay = (bloom.seed % 7) * 0.35;

  const offset = `translate(${bloom.cx - bloom.baseX} ${bloom.cy - bloom.baseY})`;

  let head;
  if (bloom.kind === "berry") {
    head = (
      <g transform={offset}>
        {bloom.berries.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} className={styles.flourishBerry} />
        ))}
      </g>
    );
  } else if (bloom.kind === "bell") {
    const bellGroup = (
      <>
        {bloom.bells.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            transform={`rotate(${b.rotate} ${b.cx} ${b.cy})`}
            className={petalClass}
          />
        ))}
      </>
    );

    head = liteMode ? (
      <g transform={offset}>{bellGroup}</g>
    ) : (
      <motion.g
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        transform={offset}
      >
        {bellGroup}
      </motion.g>
    );
  } else {
    const petalGroup = (
      <>
        {bloom.petals.map((petal) => (
          <ellipse
            key={petal.rotate}
            cx="0"
            cy={petal.cy}
            rx={petal.rx}
            ry={petal.ry}
            transform={`rotate(${petal.rotate})`}
            className={petalClass}
          />
        ))}
        <circle cx="0" cy="0" r={bloom.center} className={styles.flourishBloomCenter} />
      </>
    );

    head = liteMode ? (
      <g transform={`${offset} rotate(${bloom.rotation})`}>{petalGroup}</g>
    ) : (
      <motion.g
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        transform={`${offset} rotate(${bloom.rotation})`}
      >
        {petalGroup}
      </motion.g>
    );
  }

  if (liteMode) {
    return (
      <g transform={`translate(${bloom.baseX} ${bloom.baseY})`}>
        {head}
      </g>
    );
  }

  return (
    <g transform={`translate(${bloom.baseX} ${bloom.baseY})`}>
      <motion.g
        animate={{ rotate: [-amp, amp, -amp] }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        {head}
      </motion.g>
    </g>
  );
}

export function FlourishBranch({ branch, hovered, liteMode = false, children }) {
  return (
    <>
      {branch.rootAnchor && <path d={branch.rootAnchor} className={styles.rootAnchor} />}
      {branch.extras?.map((d) => (
        <path key={d} d={d} className={styles.flourishLoop} />
      ))}
      <path d={branch.trunk} className={styles.flourishStem} />
      {branch.subStems?.map((sub) => (
        <path key={sub.path} d={sub.path} className={styles.flourishVein} />
      ))}
      {branch.leaves.map((leaf) => (
        <g key={leaf.outline}>
          <path d={leaf.outline} className={styles.flourishLeaf} />
          <path d={leaf.vein} className={styles.flourishLeafVein} />
        </g>
      ))}
      {branch.twigs.map((twig) => (
        <path key={twig.path} d={twig.path} className={styles.flourishTwig} />
      ))}
      {branch.blooms.map((bloom) => (
        <FlourishBloom
          key={`${bloom.cx}-${bloom.cy}`}
          bloom={bloom}
          enlarged={hovered}
          liteMode={liteMode}
        />
      ))}
      {children}
    </>
  );
}

const INTERACTIVE_IDS = new Set(["chrysanthemum", "bamboo", "bloom", "maple"]);

const HIT_AREAS = {
  vine: <rect x="0" y="0" width="250" height="170" className={styles.hitArea} />,
  wisteria: <rect x="0" y="0" width="180" height="350" className={styles.hitArea} />,
  sakura: <rect x="0" y="0" width="345" height="300" className={styles.hitArea} />,
  chrysanthemum: <rect x="0" y="0" width="255" height="155" className={styles.hitArea} />,
  bamboo: <rect x="0" y="0" width="165" height="350" className={styles.hitArea} />,
  bloom: <rect x="0" y="0" width="350" height="195" className={styles.hitArea} />,
  maple: <rect x="0" y="0" width="325" height="245" className={styles.hitArea} />,
};

function BranchMotif({ id, side, top, onActivate, active, disconnected, liteMode = false }) {
  const branch = side === "left" ? LEFT_BRANCHES[id] : RIGHT_BRANCHES[id];
  const viewBox = BRANCH_VIEWBOX[id];
  const hitArea = HIT_AREAS[id];
  const isInteractive = INTERACTIVE_IDS.has(id);

  const mountRef = useRef(null);
  const bend = useCursorBend(mountRef, {
    rootFrac: branchRootFraction(id, branch),
    radius: 150,
    maxRotate: 20,
  });
  const transformOrigin = branchRootOrigin(id, branch);

  return (
    <MotifMount
      ref={mountRef}
      side={side}
      top={top}
      width={BRANCH_WIDTH[id]}
      interactive
      disconnected={disconnected}
    >
      <motion.div
        className={styles.physicsWrap}
        style={
          disconnected || liteMode
            ? { transformOrigin }
            : { rotate: bend.rotate, transformOrigin }
        }
      >
        <svg
          data-motif-id={id}
          className={`${styles.motif} ${styles.interactive}${disconnected ? ` ${styles.motifDisconnectedSvg}` : ""}`}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => !disconnected && !liteMode && onActivate(id, "enter")}
          onMouseLeave={() => !disconnected && !liteMode && onActivate(id, "leave")}
          onClick={() => !disconnected && !liteMode && onActivate(id, "click")}
          role={isInteractive ? "img" : undefined}
          aria-label={isInteractive ? "Interactive flourish — click to snip thread" : undefined}
          aria-hidden={isInteractive ? undefined : "true"}
        >
          <FlourishBranch branch={branch} hovered={active && !disconnected} liteMode={liteMode}>
            {hitArea}
          </FlourishBranch>
        </svg>
      </motion.div>
    </MotifMount>
  );
}

export function EmbroideryMotifs({ layout, onActivate, activeMotif, disconnectedMotifs = new Set(), liteMode = false }) {
  if (!layout) return null;

  const renderSlot = (slot, side) => (
    <BranchMotif
      key={`${side}-${slot.key}`}
      id={slot.key}
      side={side}
      top={slot.top}
      onActivate={onActivate}
      active={activeMotif === slot.key}
      disconnected={disconnectedMotifs.has(slot.key)}
      liteMode={liteMode}
    />
  );

  return (
    <>
      {layout.leftSlots.map((slot) => renderSlot(slot, "left"))}
      {layout.rightSlots.map((slot) => renderSlot(slot, "right"))}

      <MotifMount side="left" top={88} className={styles.bottomWave}>
        <svg className={styles.motif} viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30" className={styles.wave} />
          <path d="M0 45 Q50 25 100 45 T200 45 T300 45 T400 45" className={styles.wave} />
          <path d="M0 55 Q50 35 100 55 T200 55 T300 55 T400 55" className={styles.waveFaint} />
        </svg>
      </MotifMount>
    </>
  );
}
