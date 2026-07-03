import styles from "./Avatar.module.css";
import { getInitials } from "../../utils";

export function Avatar({ name, imageSrc, size = "lg", className = "" }) {
  const initials = getInitials(name);

  if (imageSrc) {
    return (
      <div className={`${styles.wrapper} ${styles[size]} ${className}`}>
        <img src={imageSrc} alt={name} className={styles.image} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.wrapper} ${styles[size]} ${styles.placeholder} ${className}`}
      aria-hidden={!name}
    >
      <span>{initials}</span>
    </div>
  );
}
