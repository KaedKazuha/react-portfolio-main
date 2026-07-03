import { useRef } from "react";
import { motion } from "framer-motion";

import { FlourishBranch } from "../effects/EmbroideryMotifs";
import {
  BRANCH_VIEWBOX,
  LEFT_BRANCHES,
  RIGHT_BRANCHES,
  branchRootFraction,
  branchRootOrigin,
} from "../effects/branchPaths";
import { useCursorBend } from "../effects/useCursorBend";

import styles from "./Hero.module.css";

function HeroFlourish({ id, side, className }) {
  const branch = (side === "left" ? LEFT_BRANCHES : RIGHT_BRANCHES)[id];
  const viewBox = BRANCH_VIEWBOX[id];
  const ref = useRef(null);
  const bend = useCursorBend(ref, {
    rootFrac: branchRootFraction(id, branch),
    radius: 150,
    maxRotate: 22,
  });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ rotate: bend.rotate, transformOrigin: branchRootOrigin(id, branch) }}>
        <svg
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.heroFlourishSvg}
          aria-hidden="true"
        >
          <FlourishBranch branch={branch} hovered={false} />
        </svg>
      </motion.div>
    </div>
  );
}

export function HeroFlourishes() {
  return (
    <div className={styles.flourishLayer} aria-hidden="true">
      <HeroFlourish id="vine" side="left" className={styles.flourishLeft} />
      <HeroFlourish id="sakura" side="right" className={styles.flourishRight} />
    </div>
  );
}
