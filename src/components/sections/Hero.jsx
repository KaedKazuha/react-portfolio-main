import { motion } from "framer-motion";

import { Download, Mail, MapPin } from "lucide-react";
import { site } from "../../content";
import { getStatIcon } from "../../lib/statIcons";
import { useMobileProfile } from "../../hooks/useMobileProfile";

import { Button } from "../ui/Button";

import { ScrollBeacon } from "../ui/ScrollBeacon";

import { HeroFlourishes } from "./HeroFlourishes";
import { HeroPetals } from "./HeroPetals";

import { getImageUrl } from "../../utils";

import styles from "./Hero.module.css";

export function Hero() {
  const { name, role, headline, status, location, email, cvUrl, stats, assets } = site;
  const { liteMode } = useMobileProfile();

  const heroImage = assets?.heroImage ? getImageUrl(assets.heroImage) : null;

  const cvHref = cvUrl && cvUrl !== "#" ? cvUrl : assets?.cv ? getImageUrl(assets.cv) : null;

  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />

      {!liteMode && <HeroFlourishes />}
      {!liteMode && <HeroPetals />}

      <div className={`container ${styles.heroContent}`}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {status.available && (
            <motion.span
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {status.label}
            </motion.span>
          )}

          <h1 className={styles.title}>
            Hi, I&apos;m <span className="gradient-text">{name}</span>
          </h1>

          <p className={styles.subtitle}>{role}</p>

          {location && (
            <p className={styles.location}>
              <MapPin size={15} />
              {location}
            </p>
          )}

          <p className={styles.description}>{headline}</p>

          <div className={styles.actions}>
            <Button href={`mailto:${email}`}>
              <Mail size={18} />
              Get in touch
            </Button>
            {cvHref && (
              <Button href={cvHref} variant="secondary" download>
                <Download size={18} />
                Download CV
              </Button>
            )}
          </div>

          <motion.ul
            className={styles.stats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {stats.map((stat) => {
              const StatIcon = getStatIcon(stat.icon);
              return (
                <li key={stat.label}>
                  <span className={styles.statIconWrap}>
                    <StatIcon size={18} strokeWidth={1.75} />
                  </span>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>

      {heroImage && (
        <motion.div
          className={styles.portrait}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.portraitFloat}
            animate={liteMode ? undefined : { y: [0, -14, 0] }}
            transition={liteMode ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={heroImage}
              alt={name}
              className={styles.portraitPhoto}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </motion.div>
      )}

      <ScrollBeacon href="#about" />
    </section>
  );
}
