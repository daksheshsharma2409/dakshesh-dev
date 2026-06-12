import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../data/portfolio';
import './Projects.css';

export default function Projects() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // Parallax on track
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const cards = trackRef.current?.querySelectorAll('.project-card');
    if (!cards) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = Number(e.target.dataset.idx);
            setActive(idx);
          }
        });
      },
      { threshold: [0.5, 0.75] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="projects section" id="projects" ref={sectionRef}>
      <div className="container">
        <div className="projects-header">
          <span className="section-label" data-reveal>Selected Work</span>
          <h2 className="section-title" data-reveal>
            Projects I <span className="gradient">actually</span> built.
          </h2>
          <p className="section-subtitle" data-reveal>
            A mix of ML case studies, VR engineering, and data-viz storytelling.
            Each one taught me something new about the gap between a notebook
            and a shipped product.
          </p>
        </div>
      </div>

      <div className="project-rail-wrap" ref={trackRef}>
        <div className="project-rail">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              idx={i}
              total={projects.length}
              isActive={active === i}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="project-pager">
          {projects.map((p, i) => (
            <button
              key={p.id}
              className={`pager-dot ${active === i ? 'is-active' : ''}`}
              onClick={() => {
                const el = trackRef.current?.querySelectorAll('.project-card')[i];
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              aria-label={`Go to project ${i + 1}: ${p.title}`}
              data-cursor="hover"
            >
              <span className="pager-num">0{i + 1}</span>
              <span className="pager-title">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, idx, total, isActive }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <motion.article
      ref={cardRef}
      className={`project-card ${isActive ? 'is-active' : ''}`}
      data-idx={idx}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-card-inner">
        <div className="project-visual" style={{ background: project.gradient }}>
          <motion.div className="project-visual-img" style={{ y: imgY }}>
            <img
              src={project.image}
              alt={project.title}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
          <div className="project-visual-fallback" aria-hidden>
            <div className="fallback-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
            </div>
            <div className="fallback-meta">
              <span className="fallback-num">0{idx + 1} / 0{total}</span>
              <span className="fallback-tag">{project.tags[0]}</span>
            </div>
          </div>
          <div className="project-overlay" />
          <div className="project-tag-row">
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="project-body">
          <div className="project-num-row">
            <span className="project-num">0{idx + 1} / 0{total}</span>
            <span className="project-subtitle">{project.subtitle}</span>
          </div>

          <h3 className="project-title">{project.title}</h3>

          <p className="project-description">{project.description}</p>

          <ul className="project-highlights">
            {project.highlights.map((h, j) => (
              <li key={j}>
                <span className="hl-arrow" aria-hidden>→</span>
                {h}
              </li>
            ))}
          </ul>

          <div className="project-tags">
            {project.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
