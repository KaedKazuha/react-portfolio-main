import { getImageUrl, getInitials, getPlaceholderGradient } from "../../utils";
import styles from "./PlaceholderImage.module.css";

export function PlaceholderImage({ title, imagePath, className = "" }) {
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;

  if (imageUrl) {
    return (
      <img src={imageUrl} alt={title} className={`${styles.image} ${className}`} loading="lazy" />
    );
  }

  const [from, to] = getPlaceholderGradient(title);
  const initials = getInitials(title.split(" ").slice(0, 2).join(" ") || title);

  return (
    <div
      className={`${styles.placeholder} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className={styles.initials}>{initials}</span>
      <span className={styles.hint}>Add screenshot</span>
    </div>
  );
}

export function CompanyLogo({ company, logoPath, className = "" }) {
  const logoUrl = logoPath ? getImageUrl(logoPath) : null;

  if (logoUrl) {
    return <img src={logoUrl} alt={`${company} logo`} className={`${styles.logo} ${className}`} />;
  }

  const [from, to] = getPlaceholderGradient(company);

  return (
    <div
      className={`${styles.logo} ${styles.logoPlaceholder} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {getInitials(company)}
    </div>
  );
}
