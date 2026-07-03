import { motion } from "framer-motion";
import { Activity, LayoutDashboard, Smartphone } from "lucide-react";
import { site } from "../../content";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { AboutCardVisual } from "./AboutIllustrations";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import styles from "./About.module.css";

const STORY_ICONS = {
  web: LayoutDashboard,
  mobile: Smartphone,
  live: Activity,
};

export function About() {
  const { sections, aboutCards } = site;
  const { about } = sections;

  return (
    <SectionFrame id="about" tone="rose">
      <div className="container">
        <SectionHeader
          label={about.label}
          title={about.title}
          description={about.description}
        />

        <motion.div
          className={styles.storyPanel}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.storyCopy}>
            <p className={styles.storyBio}>{about.bio}</p>
            <p className={styles.storyTagline}>{about.tagline}</p>
          </div>

          <ol className={styles.storySteps}>
            {about.storySteps.map((step) => {
              const Icon = STORY_ICONS[step.icon] ?? Activity;

              return (
                <li key={step.label} className={styles.storyStep}>
                  <span className={styles.stepIconWrap}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div className={styles.stepBody}>
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepText}>{step.text}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {aboutCards.map(({ visual, title, description, tags }) => (
            <motion.article
              key={title}
              className={styles.card}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <div className={styles.visualWrap}>
                <AboutCardVisual variant={visual} />
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
              <ul className={styles.tags}>
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </SectionFrame>
  );
}
