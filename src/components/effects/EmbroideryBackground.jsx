import { motion } from "framer-motion";
import styles from "./EmbroideryBackground.module.css";

function SakuraPetal({ cx, cy, size, rotation }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy={-size * 0.45}
          rx={size * 0.22}
          ry={size * 0.42}
          transform={`rotate(${angle})`}
          className={styles.petal}
        />
      ))}
      <circle cx="0" cy="0" r={size * 0.08} className={styles.petalCenter} />
    </g>
  );
}

function MapleLeaf({ transform, scale = 1 }) {
  return (
    <g transform={`${transform} scale(${scale})`} className={styles.leafGroup}>
      <path
        d="M0 -18 L4 -6 L16 -8 L7 2 L10 14 L0 8 L-10 14 L-7 2 L-16 -8 L-4 -6 Z"
        className={styles.mapleLeaf}
      />
      <path d="M0 -18 L0 8 M-7 2 L7 2 M-10 14 L10 14" className={styles.leafVein} />
    </g>
  );
}

function BambooLeaf({ transform }) {
  return (
    <g transform={transform}>
      <path
        d="M0 0 Q18 -8 42 -2 Q28 6 8 10 Q22 0 0 0"
        className={styles.bambooLeaf}
      />
      <path d="M8 10 Q22 0 42 -2" className={styles.leafVein} />
    </g>
  );
}

export function EmbroideryBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      {/* Sakura branch — top right */}
      <motion.svg
        className={`${styles.motif} ${styles.topRight}`}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: [0, 1.5, 0, -1, 0] }}
        transition={{
          opacity: { duration: 1.5, delay: 0.3 },
          rotate: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <path
          d="M300 20 C260 40 230 70 210 110 C195 140 185 175 175 210 C168 235 160 260 150 290"
          className={styles.branch}
        />
        <path
          d="M210 110 C240 95 265 100 285 118 M185 175 C215 168 235 178 248 198 M175 210 C155 225 140 240 128 258"
          className={styles.twigs}
        />
        <SakuraPetal cx="285" cy="118" size="14" rotation="12" />
        <SakuraPetal cx="248" cy="198" size="11" rotation="-18" />
        <SakuraPetal cx="128" cy="258" size="10" rotation="8" />
        <SakuraPetal cx="230" cy="88" size="9" rotation="-6" />
        <SakuraPetal cx="198" cy="148" size="8" rotation="20" />
      </motion.svg>

      {/* Bamboo — bottom left */}
      <motion.svg
        className={`${styles.motif} ${styles.bottomLeft}`}
        viewBox="0 0 260 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: [0, -0.8, 0, 0.6, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M70 360 L70 40" className={styles.bambooStalk} />
        <path d="M95 360 L95 80" className={styles.bambooStalk} />
        <path d="M70 120 L70 122 M70 200 L70 202 M70 280 L70 282" className={styles.bambooJoint} />
        <path d="M95 160 L95 162 M95 250 L95 252" className={styles.bambooJoint} />
        <BambooLeaf transform="translate(95 130) rotate(-25)" />
        <BambooLeaf transform="translate(70 210) rotate(30) scale(0.9)" />
        <BambooLeaf transform="translate(95 270) rotate(-18) scale(1.05)" />
        <BambooLeaf transform="translate(70 100) rotate(22) scale(0.85)" />
      </motion.svg>

      {/* Vine & leaves — top left */}
      <motion.svg
        className={`${styles.motif} ${styles.topLeft}`}
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: [0, 1, 0, -0.8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <path
          d="M10 180 C40 150 55 110 70 75 C85 42 105 18 130 8 C155 0 175 12 188 35"
          className={styles.vine}
        />
        <path d="M70 75 C52 68 38 52 30 32" className={styles.twigs} />
        <path d="M130 8 C148 22 162 48 168 72" className={styles.twigs} />
        <ellipse cx="30" cy="32" rx="10" ry="5" transform="rotate(-35 30 32)" className={styles.smallLeaf} />
        <ellipse cx="52" cy="58" rx="11" ry="5.5" transform="rotate(-15 52 58)" className={styles.smallLeaf} />
        <ellipse cx="168" cy="72" rx="12" ry="6" transform="rotate(25 168 72)" className={styles.smallLeaf} />
        <ellipse cx="188" cy="35" rx="9" ry="4.5" transform="rotate(40 188 35)" className={styles.smallLeaf} />
        <ellipse cx="115" cy="22" rx="10" ry="5" transform="rotate(8 115 22)" className={styles.smallLeaf} />
      </motion.svg>

      {/* Maple leaves — bottom right */}
      <motion.svg
        className={`${styles.motif} ${styles.bottomRight}`}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -6, 0, 4, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <path
          d="M200 220 C170 190 150 150 140 110 C132 82 128 52 120 30"
          className={styles.branch}
        />
        <MapleLeaf transform="translate(140 110) rotate(15)" scale={0.9} />
        <MapleLeaf transform="translate(168 78) rotate(-28)" scale={0.75} />
        <MapleLeaf transform="translate(118 42) rotate(42)" scale={0.65} />
        <MapleLeaf transform="translate(200 168) rotate(-10)" scale={0.55} />
      </motion.svg>

      {/* Center-right floating blossom cluster */}
      <motion.svg
        className={`${styles.motif} ${styles.midRight}`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ opacity: [0.35, 0.55, 0.35], y: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M60 110 C58 80 62 55 70 35 C76 22 84 12 92 8" className={styles.twigs} />
        <SakuraPetal cx="92" cy="8" size="12" rotation="0" />
        <SakuraPetal cx="70" cy="35" size="9" rotation="25" />
        <SakuraPetal cx="58" cy="62" size="7" rotation="-12" />
      </motion.svg>
    </div>
  );
}
