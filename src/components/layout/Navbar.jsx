import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "../../content";
import { useActiveSection } from "../../hooks/useActiveSection";
import { Button } from "../ui/Button";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { name, email, nav } = site;
  const sectionIds = nav.map((link) => link.id);
  const activeSection = useActiveSection(sectionIds);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className={`container ${styles.nav}`} aria-label="Main navigation">
          <a href="#" className={styles.logo} onClick={handleNavClick}>
            <span className={styles.logoMark} />
            {name.split(" ")[0]}
          </a>

          <ul className={styles.links}>
            {nav.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`${styles.link} ${activeSection === link.id ? styles.linkActive : ""}`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span
                      className={styles.activeIndicator}
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <Button href={`mailto:${email}`} variant="secondary" className={styles.desktopCta}>
            Get in touch
          </Button>

          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      <motion.div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        initial={false}
        animate={menuOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.25 }}
      >
        <ul className={styles.mobileLinks}>
          {nav.map((link, index) => (
            <motion.li
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: menuOpen ? index * 0.05 : 0 }}
            >
              <a href={`#${link.id}`} onClick={handleNavClick}>
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
