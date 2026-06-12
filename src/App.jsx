import { useSmoothScroll } from './hooks/useSmoothScroll';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import SvgSpine from './components/SvgSpine';
import FloatingObjects from './components/FloatingObjects';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

import data from './data/portfolioData.json';

// Helper: check if a data section is non-empty
function hasData(key) {
  if (!key) return true; // sections like Hero, About, Contact always show
  const val = data[key];
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return Boolean(val);
}

function App() {
  useSmoothScroll();

  return (
    <>
      <Cursor />
      <SvgSpine />
      <FloatingObjects />
      <Navbar sections={data.sections} hasData={hasData} profile={data.profile} />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero profile={data.profile} />
        <About profile={data.profile} education={data.education} projects={data.projects} certifications={data.certifications} />

        {hasData('experience') && (
          <Experience experience={data.experience} />
        )}

        {hasData('projects') && (
          <Projects projects={data.projects} />
        )}

        {hasData('skills') && (
          <Skills skills={data.skills} />
        )}

        {hasData('achievements') && (
          <Achievements achievements={data.achievements} />
        )}

        {hasData('certifications') && (
          <Certifications certifications={data.certifications} />
        )}

        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </>
  );
}

export default App;
