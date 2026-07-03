import { motion } from "framer-motion";
import styles from "./ScrollBeacon.module.css";

export function ScrollBeacon({ href = "#about" }) {
  return (
    <motion.a
      href={href}
      className={styles.cue}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
      aria-label="Scroll to about section"
    >
      <span className={styles.ring} aria-hidden="true" />
      <motion.span
        className={styles.dot}
        aria-hidden="true"
        animate={{ y: [0, 3, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.a>
  );
}
