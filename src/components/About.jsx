import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';

export default function About({ profile, education, projects, certifications }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]');
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Dynamic stats computed from actual data
  const projectCount = projects?.length || 0;
  const certCount = certifications?.length || 0;

  return (
    <section className="about section" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-photo" data-reveal>
          <motion.div className="photo-frame" style={{ y: imgY, scale: imgScale }}>
            <img
              src="/images/profile.JPG"
              alt={`Portrait of ${profile.name}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="photo-fallback" aria-hidden>
              <span className="fallback-initials">DS</span>
              <span className="fallback-label">your photo here</span>
              <span className="fallback-hint">public/images/profile.JPG</span>
            </div>
          </motion.div>
          <div className="photo-sticker">
            <span className="sticker-dot" />
            <div>
              <strong>{profile.name}</strong>
              <span>B.Tech AI · Newton School of Technology</span>
            </div>
          </div>
          <div className="photo-corner">
            <span>{profile.location}</span>
            <span>2025 — Present</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-label" data-reveal>About</span>
          <h2 className="section-title" data-reveal>
            Student by day, <br />
            <span className="gradient">builder by obsession</span>.
          </h2>

          <p className="about-bio" data-reveal>
            I'm a first-year B.Tech Artificial Intelligence student at{' '}
            <strong>Newton School of Technology, Rishihood University</strong>.
            I'm passionate about building things that live on the internet — 
            from smart recommendation engines to responsive e-commerce 
            storefronts. I believe the best way to learn is to ship.
          </p>

          <p className="about-bio" data-reveal>
            When I'm not coding, you'll find me grinding LeetCode problems,
            exploring machine learning with Python and NumPy, or designing
            pixel-perfect UIs in Figma. I scored{' '}
            <strong>94.8% in Class X</strong> and <strong>86.8% in Class XII</strong>
            {' '}— and I bring that same dedication to every project I build.
          </p>

          {(projectCount > 0 || certCount > 0) && (
            <div className="about-stats" data-reveal>
              {projectCount > 0 && (
                <div className="stat">
                  <span className="stat-num">{projectCount}</span>
                  <span className="stat-label">Projects Shipped</span>
                </div>
              )}
              {certCount > 0 && (
                <div className="stat">
                  <span className="stat-num">{certCount}</span>
                  <span className="stat-label">Certifications</span>
                </div>
              )}
              <div className="stat">
                <span className="stat-num">5+</span>
                <span className="stat-label">Languages</span>
              </div>
            </div>
          )}

          <div className="education">
            <h3 className="education-title" data-reveal>Education</h3>
            <ul className="education-list">
              {education.map((e, i) => (
                <li key={i} className="education-item" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="edu-marker">
                    <span />
                  </div>
                  <div className="edu-body">
                    <div className="edu-head">
                      <strong>{e.school}</strong>
                      <span className="edu-period">{e.period}</span>
                    </div>
                    <div className="edu-degree">{e.degree}</div>
                    <div className="edu-meta">
                      <span>{e.location}</span>
                      <span className="dot-sep" />
                      <span>{e.gpa}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
