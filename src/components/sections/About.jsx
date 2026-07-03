import { motion } from "framer-motion";
import { site } from "../../content";
import { getAboutIcon } from "../../lib/icons";
import { getImageUrl } from "../../utils";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import styles from "./About.module.css";

export function About() {
  const { sections, aboutCards, bio } = site;
  const { about } = sections;

  return (
    <SectionFrame id="about" tone="rose">
      <div className="container">
        <SectionHeader
          label={about.label}
          title={about.title}
          description={about.description}
        />

        <motion.p
          className={styles.bio}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {bio}
        </motion.p>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {aboutCards.map(({ icon, image, title, description }) => {
            const Icon = getAboutIcon(icon);
            const iconSrc = image ? getImageUrl(image) : null;

            return (
              <motion.article
                key={title}
                className={styles.card}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className={styles.iconWrap}>
                  {iconSrc ? (
                    <img src={iconSrc} alt="" className={styles.iconImage} />
                  ) : (
                    <Icon size={22} strokeWidth={1.75} />
                  )}
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </SectionFrame>
  );
}
