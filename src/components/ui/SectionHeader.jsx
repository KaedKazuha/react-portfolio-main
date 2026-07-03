import { motion } from "framer-motion";
import { defaultViewport } from "../../lib/motion";
import styles from "./SectionHeader.module.css";

export function SectionHeader({ label, title, description }) {
  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {label && (
        <div className={styles.labelWrap}>
          <span className={styles.label}>{label}</span>
          <motion.span
            className={styles.labelLine}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={defaultViewport}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
