import { motion } from "framer-motion";
import { SectionDivider } from "./SectionDivider";
import { sectionViewport } from "../../lib/motion";
import styles from "./SectionFrame.module.css";

const toneClass = {
  hero: styles.toneHero,
  rose: styles.toneRose,
  fuchsia: styles.toneFuchsia,
  violet: styles.toneViolet,
  indigo: styles.toneIndigo,
  contact: styles.toneContact,
};

export function SectionFrame({
  as: Tag = "section",
  id,
  tone = "rose",
  showDivider = true,
  padded = true,
  className = "",
  children,
}) {
  return (
    <Tag
      id={id}
      className={`${padded ? "section" : ""} ${styles.frame} ${toneClass[tone] ?? ""} ${className}`.trim()}
    >
      {showDivider && <SectionDivider />}
      <motion.div
        className={styles.glow}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={sectionViewport}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <div className={styles.inner}>{children}</div>
    </Tag>
  );
}
