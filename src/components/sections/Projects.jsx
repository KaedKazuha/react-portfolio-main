import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { site, projects } from "../../content";
import { getSkillIconPath } from "../../lib/skillIcons";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { PlaceholderImage } from "../ui/PlaceholderImage";
import { SkillIcon } from "../ui/SkillIcon";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import styles from "./Projects.module.css";

export function Projects() {
  const { projects: section } = site.sections;
  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <SectionFrame id="projects" tone="indigo">
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
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {sorted.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </motion.div>
    </SectionFrame>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.article
      className={`${styles.card} ${project.featured ? styles.featured : ""}`}
      variants={fadeUp}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className={styles.imageWrap}>
        <PlaceholderImage title={project.title} imagePath={project.image} />
        <div className={styles.imageOverlay} />
        {project.featured && <span className={styles.featuredBadge}>Featured</span>}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>

        <ul className={styles.stack} aria-label="Project stack">
          {project.tags.map((tag) => (
            <li key={tag}>
              <SkillIcon
                name={tag}
                icon={getSkillIconPath(tag)}
                size="sm"
                showLabel={false}
              />
            </li>
          ))}
        </ul>

        <div className={styles.links}>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          ) : (
            <span className={styles.linkDisabled}>
              <ExternalLink size={16} />
              Demo — add link
            </span>
          )}
          {project.sourceUrl ? (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <Github size={16} />
              Source
            </a>
          ) : (
            <span className={styles.linkDisabled}>
              <Github size={16} />
              Repo — add link
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
