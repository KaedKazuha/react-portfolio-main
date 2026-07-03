import { useRef } from "react";
import { InteractiveEmbroidery } from "./components/effects/InteractiveEmbroidery";
import { useMobileProfile } from "./hooks/useMobileProfile";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Experience } from "./components/sections/Experience";
import { Projects } from "./components/sections/Projects";
import { Contact } from "./components/sections/Contact";
import { PageScrollProgress } from "./components/ui/PageScrollProgress";
import styles from "./App.module.css";

function App() {
  const pageRef = useRef(null);
  const { liteMode } = useMobileProfile();

  return (
    <div ref={pageRef} className={styles.page} data-lite={liteMode ? "" : undefined}>
      <PageScrollProgress />
      <div className={styles.content}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
        </main>
        <Contact />
      </div>
      <InteractiveEmbroidery pageRef={pageRef} />
    </div>
  );
}

export default App;
