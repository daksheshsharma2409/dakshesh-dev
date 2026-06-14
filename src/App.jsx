import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';

import data from './data/portfolioData.json';

const hasData = (key) => {
  return data[key] && Object.keys(data[key]).length > 0;
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Cursor />
      <Navbar profile={data.profile} data={data} />

      <main className="app-main">
        {hasData('profile') && <Hero profile={data.profile} />}
        {hasData('profile') && (
          <About
            profile={data.profile}
            education={data.education}
            projects={data.projects}
            certifications={data.certifications}
          />
        )}
        {hasData('experience') && <Experience experience={data.experience} />}
        {hasData('projects') && <Projects projects={data.projects} />}
        {hasData('skills') && <Skills skills={data.skills} />}
        {hasData('achievements') && <Achievements achievements={data.achievements} />}
        {hasData('certifications') && <Certifications certifications={data.certifications} />}
        {hasData('profile') && <Contact profile={data.profile} social={data.social} />}
      </main>

      <Footer profile={data.profile} social={data.social} />
    </>
  );
}

export default App;
