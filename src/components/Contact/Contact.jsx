import React from "react";

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact Me</h2>

      </div>
      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" />
          <a href="mailto:anasarif82@gmail.com">anasarif82@gmail.com</a>
        </li>
        <li className={styles.link} >
          <img
            src={getImageUrl("contact/link.png")}
            alt="LinkedIn icon"
          />
          <a href="https://www.linkedin.com/in/anasarif99/">linkedin.com/anasarif99</a>
        </li>
        <li className={styles.link}>
          <img src={getImageUrl("contact/github.png")} alt="Github icon" />
          <a href="https://github.com/KaedKazuha">github.com/KaedKazuha</a>
        </li>
      </ul>
    </footer>
  );
};
