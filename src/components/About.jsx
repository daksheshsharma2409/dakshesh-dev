import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile, education } from '../data/portfolio';
import './About.css';

export default function About() {
  const ref = useRef(null);
  const imgRef = useRef(null);

  // Parallax for the about photo
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

  return (
    <section className="about section" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-photo" data-reveal>
          <motion.div className="photo-frame" style={{ y: imgY, scale: imgScale }}>
            <img
              src="/images/about.jpg"
              alt="Portrait of Dakshesh Sharma"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="photo-fallback" aria-hidden>
              <span className="fallback-initials">DS</span>
              <span className="fallback-label">your photo here</span>
              <span className="fallback-hint">public/images/about.jpg</span>
            </div>
          </motion.div>
          <div className="photo-sticker">
            <span className="sticker-dot" />
            <div>
              <strong>Dakshesh Sharma</strong>
              <span>B.E. Computer Engineering · Data Science</span>
            </div>
          </div>
          <div className="photo-corner">
            <span>Pune, MH</span>
            <span>2022 — Present</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-label" data-reveal>About</span>
          <h2 className="section-title" data-reveal>
            Engineer by training, <br />
            <span className="gradient">data scientist by curiosity</span>.
          </h2>

          <p className="about-bio" data-reveal>
            I'm a final-year Computer Engineering student at PVG's COEP,
            Pune, specialising in Data Science. I love turning messy,
            high-dimensional data into systems that actually work in
            production — from risk-scoring 100K+ farmers for Niqo Robotics
            to building threat-intel pipelines at Securin.
          </p>

          <p className="about-bio" data-reveal>
            Outside of work you'll find me breaking down quant strategies,
            training ML models on crypto markets, or contributing to VR
            side-projects. I scored <strong>99.83 percentile in JEE Mains</strong>
            {' '}— and I bring that same rigour to every model I ship.
          </p>

          <div className="about-stats" data-reveal>
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">Internships</span>
            </div>
            <div className="stat">
              <span className="stat-num">6+</span>
              <span className="stat-label">ML Projects</span>
            </div>
            <div className="stat">
              <span className="stat-num">5+</span>
              <span className="stat-label">Certifications</span>
            </div>
          </div>

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
