import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievements, certifications } from '../data/portfolio';
import './Achievements.css';

export default function Achievements() {
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

  return (
    <section className="achievements section" id="achievements" ref={ref}>
      <div className="container">
        <div className="ach-header">
          <span className="section-label" data-reveal>Recognition</span>
          <h2 className="section-title" data-reveal>
            Numbers, certs, <span className="gradient">and a few flexes</span>.
          </h2>
        </div>

        <div className="ach-grid">
          {achievements.map((a, i) => (
            <AchievementCard key={a.label} ach={a} idx={i} />
          ))}
        </div>

        <div className="certs-section">
          <div className="certs-header">
            <h3 className="certs-title" data-reveal>Certifications</h3>
            <p className="certs-sub" data-reveal>
              Continually learning. Here are some of the courses and certs
              that have sharpened how I work.
            </p>
          </div>

          <div className="certs-grid">
            {certifications.map((c, i) => (
              <motion.div
                key={c.title}
                className="cert-card"
                data-reveal
                style={{ transitionDelay: `${i * 60}ms`, '--c': c.color }}
                whileHover={{ y: -6 }}
              >
                <div className="cert-icon" aria-hidden>
                  <CertIcon name={c.icon} />
                </div>
                <div className="cert-body">
                  <h4 className="cert-title">{c.title}</h4>
                  <span className="cert-issuer">{c.issuer}</span>
                  <p className="cert-desc">{c.description}</p>
                </div>
                <div className="cert-glow" aria-hidden />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementCard({ ach, idx }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.div
      ref={ref}
      className={`ach-card ${idx === 0 ? 'is-feature' : ''}`}
      data-reveal
      style={{ transitionDelay: `${idx * 80}ms` }}
      whileHover={{ y: -4 }}
    >
      <div className="ach-icon" aria-hidden>
        <AchievementIcon name={ach.icon} />
      </div>
      <div className="ach-metric">
        <CountUp value={parseFloat(ach.metric)} active={inView} />
        <span className="ach-suffix">{ach.suffix}</span>
      </div>
      <div className="ach-label">{ach.label}</div>
      <p className="ach-desc">{ach.description}</p>
    </motion.div>
  );
}

function CountUp({ value, active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !active) return;
    let start = 0;
    const duration = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (value - start) * eased;
      ref.current.textContent = v.toFixed(value % 1 === 0 ? 0 : 2);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return <span ref={ref}>0</span>;
}

function AchievementIcon({ name }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'trophy':
      return (
        <svg {...props}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case 'graduation':
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...props}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
          <path d="M12 15c-1.5 0-3-1-3-3s1-3 3-3 3 1 3 3-1.5 3-3 3Z" />
          <path d="M9 12c0-3 1.5-6 6-9 0 0 1 4.5-1 9" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...props}>
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    default:
      return null;
  }
}

function CertIcon({ name }) {
  const props = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'google':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12a4 4 0 0 0 8 0" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    case 'python':
      return (
        <svg {...props}>
          <path d="M9 3h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v3a3 3 0 0 1-3 3" />
          <path d="M3 3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H6a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3" />
        </svg>
      );
    case 'algo':
      return (
        <svg {...props}>
          <path d="M3 6h18M3 12h18M3 18h18" />
          <circle cx="7" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}
