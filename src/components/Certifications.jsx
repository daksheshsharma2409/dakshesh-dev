import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Certifications.css';

export default function Certifications({ certifications }) {
  const ref = useRef(null);

  useEffect(() => {
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
    ref.current?.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="certifications section" id="certifications" ref={ref}>
      <div className="container">
        <div className="certs-header">
          <span className="section-label" data-reveal>Certifications</span>
          <h2 className="section-title" data-reveal>
            Always <span className="gradient">learning</span>.
          </h2>
          <p className="section-subtitle" data-reveal>
            Courses and certifications that have sharpened my skills.
          </p>
        </div>

        <div className="certs-grid">
          {certifications.map((c, i) => (
            <motion.div
              key={c.title}
              className="cert-card"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms`, '--c': c.color }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="cert-icon" aria-hidden>
                <CertIcon name={c.icon} />
              </div>
              <div className="cert-body">
                <h4 className="cert-title">{c.title}</h4>
                <div className="cert-meta">
                  <span className="cert-issuer">{c.issuer}</span>
                  {c.date && <span className="cert-date">{c.date}</span>}
                </div>
                <p className="cert-desc">{c.description}</p>
              </div>
              <div className="cert-glow" aria-hidden />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertIcon({ name }) {
  const props = {
    width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'algo':
      return (
        <svg {...props}>
          <path d="M3 6h18M3 12h18M3 18h18" />
          <circle cx="7" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      );
    case 'python':
      return (
        <svg {...props}>
          <path d="M12 2c-1.7 0-3 .8-3 2.5V7h6v1H7.5C5.6 8 4 9.5 4 12s1.6 4 3.5 4H9v-2.5c0-1.9 1.6-3.5 3.5-3.5h5c1.1 0 2-.9 2-2V4.5c0-1.1-.9-2-2-2h-5.5z" />
          <circle cx="9.5" cy="5" r=".8" fill="currentColor" />
          <path d="M12 22c1.7 0 3-.8 3-2.5V17h-6v-1h7.5c1.9 0 3.5-1.5 3.5-4s-1.6-4-3.5-4H15v2.5c0 1.9-1.6 3.5-3.5 3.5h-5c-1.1 0-2 .9-2 2v3.5c0 1.1.9 2 2 2h5.5z" />
          <circle cx="14.5" cy="19" r=".8" fill="currentColor" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'google':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12a4 4 0 0 0 8 0" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}
