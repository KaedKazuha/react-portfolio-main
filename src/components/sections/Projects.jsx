import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github, Sparkles } from "lucide-react";
import { site, projects } from "../../content";
import { getSkillIconPath } from "../../lib/skillIcons";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionFrame } from "../ui/SectionFrame";
import { PlaceholderImage } from "../ui/PlaceholderImage";
import { SkillIcon } from "../ui/SkillIcon";
import { getAssetUrl } from "../../utils";
import { defaultViewport, fadeUp, staggerContainer } from "../../lib/motion";
import { useMobileProfile } from "../../hooks/useMobileProfile";
import styles from "./Projects.module.css";

export function Projects() {
  const { projects: section } = site.sections;
  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const featuredProjects = sorted.filter((project) => project.featured);
  const carouselProjects = sorted.filter((project) => !project.featured);
  const featuredCount = featuredProjects.length;

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

        {featuredProjects.length > 0 && (
          <motion.div
            className={styles.featuredGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </motion.div>
        )}

        {carouselProjects.length > 0 && (
          <ProjectsCarousel projects={carouselProjects} startIndex={featuredCount} />
        )}
      </motion.div>
    </SectionFrame>
  );
}

function ProjectsCarousel({ projects, startIndex }) {
  const trackRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft < maxScroll - 8);

    const slideWidth = track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
    const step = slideWidth + gap;
    const pages = Math.max(1, Math.ceil((maxScroll + step) / step));
    setPageCount(pages);
    setActivePage(Math.min(pages - 1, Math.round(track.scrollLeft / step)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [projects.length, updateScrollState]);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const slideWidth = track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
    track.scrollBy({ left: direction * (slideWidth + gap), behavior: "smooth" });
  };

  const scrollToPage = (page) => {
    const track = trackRef.current;
    if (!track) return;

    const slideWidth = track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
    track.scrollTo({ left: page * (slideWidth + gap), behavior: "smooth" });
  };

  return (
    <motion.div
      className={styles.carouselSection}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.carouselHeader}>
        <p className={styles.carouselLabel}>More projects</p>
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.carouselBtn}
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous projects"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.carouselBtn}
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Next projects"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.carouselTrack}>
        {projects.map((project, index) => (
          <div key={project.title} className={styles.carouselSlide}>
            <ProjectCard project={project} index={startIndex + index} />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className={styles.carouselDots} role="tablist" aria-label="Project carousel pages">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              role="tab"
              className={`${styles.carouselDot} ${page === activePage ? styles.carouselDotActive : ""}`}
              aria-label={`Go to project page ${page + 1}`}
              aria-selected={page === activePage}
              onClick={() => scrollToPage(page)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProjectMedia({ title, imagePath, videoPath, imageFit, playing }) {
  const videoRef = useRef(null);
  const imageUrl = getAssetUrl(imagePath);
  const videoUrl = getAssetUrl(videoPath);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (playing) {
      if (video.src !== videoUrl) {
        video.src = videoUrl;
      }
      if (video.readyState < 2) {
        video.load();
      }
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
      return;
    }

    video.pause();
    video.currentTime = 0;
    video.removeAttribute("src");
    video.load();
  }, [playing, videoUrl]);

  if (!imageUrl && !videoUrl) {
    return <PlaceholderImage title={title} imagePath={imagePath} className={styles.mediaLayer} />;
  }

  return (
    <>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className={`${styles.mediaLayer} ${styles.mediaImage} ${imageFit === "contain" ? styles.mediaContain : ""} ${playing && videoUrl ? styles.mediaHidden : ""}`}
          loading="lazy"
          decoding="async"
        />
      )}
      {videoUrl && (
        <video
          ref={videoRef}
          className={`${styles.mediaLayer} ${styles.mediaVideo} ${playing ? styles.mediaVideoVisible : ""}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
    </>
  );
}

function ProjectLinks({ project, compact = false }) {
  const links = [];

  if (project.liveUrl) {
    links.push({
      href: project.liveUrl,
      label: project.liveLabel || "Live Demo",
      icon: ExternalLink,
    });
  }

  if (project.appStoreUrl) {
    links.push({
      href: project.appStoreUrl,
      label: "App Store",
      icon: ExternalLink,
    });
  }

  if (project.sourceUrl) {
    links.push({
      href: project.sourceUrl,
      label: "Source",
      icon: Github,
    });
  }

  return links.map((link) => (
    <ProjectLink
      key={link.label}
      href={link.href}
      icon={link.icon}
      label={link.label}
      compact={compact}
    />
  ));
}

function ProjectLink({ href, icon: Icon, label, disabled = false, compact = false }) {
  if (disabled || !href) {
    return (
      <span className={`${styles.linkDisabled} ${compact ? styles.linkBtnCompact : ""}`}>
        <Icon size={16} />
        {label}
      </span>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.linkBtn} ${compact ? styles.linkBtnCompact : ""}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon size={16} />
      {label}
      <ArrowUpRight size={14} className={styles.linkArrow} />
    </motion.a>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { liteMode, mobile } = useMobileProfile();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [6, -6]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-6, 6]), {
    stiffness: 260,
    damping: 28,
  });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotlightX}% ${spotlightY}%, rgba(232, 121, 249, 0.16), transparent 68%)`;

  const handlePointerMove = (event) => {
    if (reduceMotion || liteMode || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set(x);
    pointerY.set(y);
    spotlightX.set(x * 100);
    spotlightY.set(y * 100);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    spotlightX.set(50);
    spotlightY.set(50);
    setHovered(false);
  };

  const cardNumber = String(index + 1).padStart(2, "0");
  const hasPreview = Boolean(project.previewVideo);
  const canHoverPreview = hasPreview && !liteMode;
  const previewActive = canHoverPreview ? hovered : previewOpen && hasPreview;
  const previewPlaying = previewActive && hasPreview;

  const handlePreviewToggle = () => {
    if (mobile && hasPreview) {
      setPreviewOpen((open) => !open);
    }
  };

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.card} ${project.featured ? styles.featured : ""} ${hasPreview ? styles.hasPreview : ""} ${previewActive ? styles.previewActive : ""}${liteMode ? ` ${styles.liteCard}` : ""}`}
      variants={fadeUp}
      style={
        reduceMotion || liteMode
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
      }
      onPointerMove={liteMode ? undefined : handlePointerMove}
      onPointerEnter={liteMode ? undefined : () => setHovered(true)}
      onPointerLeave={liteMode ? undefined : resetPointer}
    >
      <div className={styles.cardGlow} aria-hidden="true" />
      {!reduceMotion && !liteMode && (
        <motion.div className={styles.spotlight} style={{ background: spotlight }} aria-hidden="true" />
      )}

      <div className={styles.cardInner}>
        <div
          className={styles.imageWrap}
          onClick={mobile && hasPreview ? handlePreviewToggle : undefined}
          onKeyDown={
            mobile && hasPreview
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePreviewToggle();
                  }
                }
              : undefined
          }
          role={mobile && hasPreview ? "button" : undefined}
          tabIndex={mobile && hasPreview ? 0 : undefined}
        >
          <ProjectMedia
            title={project.title}
            imagePath={project.image}
            videoPath={project.previewVideo}
            imageFit={project.imageFit}
            playing={previewPlaying}
          />
          <div className={styles.imageOverlay} aria-hidden="true" />
          <div className={styles.shine} aria-hidden="true" />

          {project.featured && (
            <span className={styles.featuredBadge}>
              <Sparkles size={12} />
              Featured
            </span>
          )}

          {project.previewVideo && (
            <span className={styles.previewHint} aria-hidden="true">
              {mobile ? (previewOpen ? "Tap to close" : "Tap to preview") : "Hover to preview"}
            </span>
          )}

          <motion.div
            className={styles.hoverPanel}
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 16,
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!hovered}
          >
            <div className={styles.hoverActions}>
              <ProjectLinks project={project} compact />
            </div>
          </motion.div>
        </div>

        <div className={styles.content}>
          <div className={styles.contentTop}>
            <span className={styles.index}>{cardNumber}</span>
            <h3 className={styles.title}>{project.title}</h3>
          </div>

          <p className={styles.description}>{project.description}</p>

          <ul className={styles.stack} aria-label="Project stack">
            {project.tags.map((tag) => (
              <li key={tag}>
                <span className={styles.stackPill}>
                  <SkillIcon
                    name={tag}
                    icon={getSkillIconPath(tag)}
                    size="sm"
                    showLabel={false}
                  />
                  <span>{tag}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.links}>
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
