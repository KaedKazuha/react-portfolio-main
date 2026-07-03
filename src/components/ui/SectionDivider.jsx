import { useId } from "react";
import { motion } from "framer-motion";
import { drawLine, defaultViewport } from "../../lib/motion";
import styles from "./SectionDivider.module.css";

export function SectionDivider() {
  const gradId = useId();

  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 800 32" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="rgba(253, 242, 248, 0.35)" />
            <stop offset="50%" stopColor="rgba(199, 210, 254, 0.5)" />
            <stop offset="85%" stopColor="rgba(253, 242, 248, 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 16 C120 10, 200 22, 320 16 S520 10, 640 16 S760 22, 800 16"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="5 7"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        />
        <motion.circle
          cx="400"
          cy="16"
          r="3.5"
          className={styles.knot}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={defaultViewport}
          transition={{ delay: 0.45, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
