import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./PageScrollProgress.module.css";

export function PageScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={styles.track}
      aria-hidden="true"
    >
      <motion.div className={styles.bar} style={{ scaleX }} />
    </motion.div>
  );
}
