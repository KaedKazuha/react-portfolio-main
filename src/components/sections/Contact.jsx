import { motion } from "framer-motion";
import { site } from "../../content";
import { getImageUrl } from "../../utils";
import { SectionFrame } from "../ui/SectionFrame";
import { defaultViewport } from "../../lib/motion";
import styles from "./Contact.module.css";

function buildSocialLinks({ email, social, contactIcons }) {
  const links = [
    {
      id: "email",
      label: "Email",
      href: `mailto:${email}`,
      display: email,
      icon: contactIcons?.email,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: social.linkedin,
      display: social.linkedin?.replace(/^https?:\/\/(www\.)?/, "") || "Add LinkedIn URL",
      external: true,
      icon: contactIcons?.linkedin,
    },
    {
      id: "github",
      label: "GitHub",
      href: social.github,
      display: social.github?.replace(/^https?:\/\/(www\.)?/, "") || "Add GitHub URL",
      external: true,
      icon: contactIcons?.github,
    },
  ];

  if (social.twitter) {
    links.push({
      id: "twitter",
      label: "Twitter / X",
      href: social.twitter,
      display: social.twitter.replace(/^https?:\/\/(www\.)?/, ""),
      external: true,
      icon: null,
    });
  }

  return links;
}

function ContactIcon({ iconPath, label }) {
  if (iconPath) {
    return (
      <img
        src={getImageUrl(iconPath)}
        alt=""
        className={styles.linkImage}
      />
    );
  }

  return <span className={styles.linkFallback}>{label[0]}</span>;
}

export function Contact() {
  const { sections, name } = site;
  const { contact } = sections;
  const socialLinks = buildSocialLinks(site);

  const titleParts = contact.title.split(contact.titleHighlight);
  const hasHighlight = titleParts.length > 1;

  return (
    <SectionFrame as="footer" id="contact" tone="contact" padded={false} className={styles.footer}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.label}>{contact.label}</span>
            <h2 className={styles.title}>
              {hasHighlight ? (
                <>
                  {titleParts[0]}
                  <span className="gradient-text">{contact.titleHighlight}</span>
                  {titleParts[1]}
                </>
              ) : (
                contact.title
              )}
            </h2>
            <p className={styles.description}>{contact.description}</p>
          </motion.div>

          <ul className={styles.links}>
            {socialLinks.map(({ id, label, href, display, external, icon }, index) => {
              const isPlaceholder = !href || href === "#" || href.includes("yourusername");
              const content = (
                <>
                  <span className={styles.linkIcon}>
                    <ContactIcon iconPath={icon} label={label} />
                  </span>
                  <span>
                    <span className={styles.linkLabel}>{label}</span>
                    <span className={styles.linkValue}>{display}</span>
                  </span>
                </>
              );

              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={defaultViewport}
                  transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {isPlaceholder ? (
                    <div className={`${styles.link} ${styles.linkPlaceholder}`}>{content}</div>
                  ) : (
                    <a
                      href={href}
                      className={styles.link}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <motion.div
          className={styles.bottom}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </SectionFrame>
  );
}
