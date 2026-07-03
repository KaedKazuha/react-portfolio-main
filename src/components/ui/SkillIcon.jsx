import { getImageUrl, getInitials } from "../../utils";
import styles from "./SkillIcon.module.css";

export function SkillIcon({ name, icon, size = "md", showLabel = true, className = "" }) {
  const iconSrc = icon ? getImageUrl(icon) : null;
  const sizeClass = styles[size];

  return (
    <div
      className={`${styles.skill} ${sizeClass} ${className}`.trim()}
      title={name}
    >
      <div className={styles.iconWrap}>
        {iconSrc ? (
          <img src={iconSrc} alt="" className={styles.icon} />
        ) : (
          <span className={styles.fallback} aria-hidden="true">
            {getInitials(name)}
          </span>
        )}
      </div>
      {showLabel && <span className={styles.label}>{name}</span>}
    </div>
  );
}
