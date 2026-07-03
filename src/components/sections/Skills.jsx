import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site, skills } from "../../content";
import { normalizeSkillItem } from "../../lib/skillIcons";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { SkillIcon } from "../ui/SkillIcon";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import styles from "./Skills.module.css";

export function Skills() {
  const { skills: section } = site.sections;
  const reduceMotion = useReducedMotion();
  const marqueeWrapRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const [marqueeAnimated, setMarqueeAnimated] = useState(false);

  const allSkills = skills.flatMap((group) =>
    group.items.map((item) => normalizeSkillItem(item))
  );
  const uniqueSkills = [
    ...new Map(allSkills.map((skill) => [skill.name, skill])).values(),
  ];

  useEffect(() => {
    const wrap = marqueeWrapRef.current;
    const track = marqueeTrackRef.current;
    if (!wrap || !track) return;

    const updateMarqueeMode = () => {
      const needsScroll = track.scrollWidth > wrap.clientWidth + 8;
      setMarqueeAnimated(needsScroll);
    };

    updateMarqueeMode();

    const observer = new ResizeObserver(updateMarqueeMode);
    observer.observe(wrap);
    observer.observe(track);

    return () => observer.disconnect();
  }, [uniqueSkills.length]);

  const marqueeIcons = uniqueSkills.map((skill) => (
    <div key={skill.name} className={styles.marqueeItem}>
      <SkillIcon
        name={skill.name}
        icon={skill.icon}
        size="sm"
        showLabel={false}
        className={styles.marqueeIcon}
      />
    </div>
  ));

  return (
    <SectionFrame id="skills" tone="fuchsia">
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

        <motion.div
          className={styles.categories}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {skills.map((group) => (
            <motion.div key={group.category} className={styles.category} variants={fadeUp}>
              <h3 className={styles.categoryTitle}>{group.category}</h3>
              <ul className={styles.iconGrid}>
                {group.items.map((item) => {
                  const skill = normalizeSkillItem(item);

                  return (
                    <li key={`${group.category}-${skill.name}`}>
                      <SkillIcon
                        name={skill.name}
                        icon={skill.icon}
                        size="lg"
                      />
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div
          ref={marqueeWrapRef}
          className={`${styles.marqueeWrap} ${marqueeAnimated ? styles.marqueeWrapAnimated : styles.marqueeWrapStatic}`}
          aria-hidden="true"
        >
          <motion.div
            ref={marqueeTrackRef}
            className={`${styles.marquee} ${marqueeAnimated ? styles.marqueeAnimated : styles.marqueeStatic}`}
            animate={
              marqueeAnimated && !reduceMotion
                ? { x: ["0%", "-50%"] }
                : { x: 0 }
            }
            transition={
              marqueeAnimated && !reduceMotion
                ? { duration: Math.max(24, uniqueSkills.length * 3.5), repeat: Infinity, ease: "linear" }
                : undefined
            }
          >
            {marqueeAnimated ? (
              <>
                <div className={styles.marqueeGroup}>{marqueeIcons}</div>
                <div className={styles.marqueeGroup} aria-hidden="true">
                  {uniqueSkills.map((skill) => (
                    <div key={`${skill.name}-clone`} className={styles.marqueeItem}>
                      <SkillIcon
                        name={skill.name}
                        icon={skill.icon}
                        size="sm"
                        showLabel={false}
                        className={styles.marqueeIcon}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              marqueeIcons
            )}
          </motion.div>
        </div>
      </motion.div>
    </SectionFrame>
  );
}
