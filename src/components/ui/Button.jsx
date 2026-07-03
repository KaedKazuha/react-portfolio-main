import { motion } from "framer-motion";
import styles from "./Button.module.css";

const variants = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

export function Button({
  children,
  href,
  variant = "primary",
  download,
  external,
  className = "",
  ...props
}) {
  const classes = `${styles.button} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
