import React, { useState } from "react";
import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
        <div className={styles.skills}>
          {skills.map((skill, id) => (
            <div key={id} className={styles.skill}>
              <div className={styles.skillImageContainer}>
                <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
              </div>
              <p>{skill.title}</p>
            </div>
          ))}
        </div>
        <ul className={styles.history}>
          {history.map((historyItem, id) => (
            <ExperienceCard key={id} historyItem={historyItem} />
          ))}
        </ul>
      </div>
    </section>
  );
};

const ExperienceCard = ({ historyItem }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <li className={styles.historyItem}>
      <img
        src={getImageUrl(historyItem.imageSrc)}
        alt={`${historyItem.organisation} Logo`}
      />
      <div className={styles.historyItemDetails}>
        <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
        <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
        <ul>
          {historyItem.experiences.slice(0, showMore ? historyItem.experiences.length : 1).map((experience, index) => (
            <li key={index}>{experience}</li>
          ))}
        </ul>
        <button onClick={toggleShowMore} className={styles.showMoreBtn}>
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>
    </li>
  );
};

export default Experience;
