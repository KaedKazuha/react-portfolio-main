import { motion } from "framer-motion";
import { site, skills } from "../../content";
import { normalizeSkillItem } from "../../lib/skillIcons";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { SkillIcon } from "../ui/SkillIcon";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import styles from "./Skills.module.css";

export function Skills() {
  const { skills: section } = site.sections;
  const allSkills = skills.flatMap((group) =>
    group.items.map((item) => normalizeSkillItem(item))
  );
  const uniqueSkills = [
    ...new Map(allSkills.map((skill) => [skill.name, skill])).values(),
  ];

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

        <div className={styles.marqueeWrap} aria-hidden="true">
          <motion.div
            className={styles.marquee}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...uniqueSkills, ...uniqueSkills].map((skill, i) => (
              <div key={`${skill.name}-${i}`} className={styles.marqueeItem}>
                <SkillIcon
                  name={skill.name}
                  icon={skill.icon}
                  size="sm"
                  showLabel={false}
                  className={styles.marqueeIcon}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </SectionFrame>
  );
}
