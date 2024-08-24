import React from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Anas Arif</h1>
        <p className={styles.description}>
          Data Science and Full-Stack Developer.
        </p>
        <div className={styles.buttonContainer}>

        <a href="mailto:anasarif82@gmail.com" className={styles.contactBtn}>
          Contact Me
        </a>
        <a href="https://raw.githubusercontent.com/KaedKazuha/react-portfolio-main/main/assets/about/AnasArifCV.pdf" download className={styles.downloadBtn}>
          Download CV
        </a>
        </div>
      </div>
      <img
        src={getImageUrl("hero/heroImage.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
