import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useMobileProfile } from "../../hooks/useMobileProfile";
import styles from "./PageScrollProgress.module.css";

function FramerScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div className={styles.track} aria-hidden="true">
      <motion.div className={styles.bar} style={{ scaleX }} />
    </motion.div>
  );
}

function CssScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={barRef} className={styles.bar} />
    </div>
  );
}

export function PageScrollProgress() {
  const { liteMode } = useMobileProfile();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;
  if (liteMode) return <CssScrollProgress />;
  return <FramerScrollProgress />;
}
