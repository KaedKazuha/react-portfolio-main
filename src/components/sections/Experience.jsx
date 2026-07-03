import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { site, experience } from "../../content";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { CompanyLogo } from "../ui/PlaceholderImage";
import { defaultViewport } from "../../lib/motion";
import styles from "./Experience.module.css";

export function Experience() {
  const { experience: section } = site.sections;

  return (
    <SectionFrame id="experience" tone="violet">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHeader
          label={section.label}
          title={section.title}
          description={section.description}
        />

        <div className={styles.timeline}>
          {experience.map((item, index) => (
            <TimelineItem
              key={`${item.company}-${item.role}`}
              item={item}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </SectionFrame>
  );
}

function TimelineItem({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const visibleHighlights = expanded
    ? item.highlights
    : item.highlights.slice(0, 2);

  return (
    <motion.article
      className={styles.timelineItem}
      initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={defaultViewport}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={styles.timelineMarker} aria-hidden="true" />

      <div className={styles.timelineCard}>
        <div className={styles.timelineHeader}>
          <CompanyLogo company={item.company} logoPath={item.logo} />
          <div>
            <h3 className={styles.role}>
              {item.role}
              <span className={styles.org}> @ {item.company}</span>
            </h3>
            <div className={styles.meta}>
              <time className={styles.dates}>
                {item.startDate} — {item.endDate}
              </time>
              {item.location && (
                <span className={styles.location}>
                  <MapPin size={12} />
                  {item.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <ul className={styles.experienceList}>
          <AnimatePresence mode="popLayout">
            {visibleHighlights.map((highlight, i) => (
              <motion.li
                key={`${highlight.slice(0, 30)}-${i}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {highlight}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {item.highlights.length > 2 && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show ${item.highlights.length - 2} more`}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={16} />
            </motion.span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
