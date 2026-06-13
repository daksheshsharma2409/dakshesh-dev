import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, GraduationCap, Rocket, Briefcase, Flame } from 'lucide-react';

import './Achievements.css';

export default function Achievements({ achievements }) {
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

  if (!achievements || achievements.length === 0) return null;

  return (
    <section className="achievements section" id="achievements" ref={ref}>
      <div className="container">
        <div className="ach-header">
          <span className="section-label" data-reveal>Recognition</span>
          <h2 className="section-title" data-reveal>
            Numbers <span className="gradient">that matter</span>.
          </h2>
        </div>

        <div className="ach-grid">
          {achievements.map((a, i) => (
            <AchievementCard key={a.label} ach={a} idx={i} />
          ))}
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
      {/* Screenshot — fixed height, covers cleanly, no overlap */}
      {ach.screenshot && (
        <div className="ach-screenshot">
          <img src={ach.screenshot} alt={`${ach.title} screenshot`} loading="lazy" />
        </div>
      )}

      {/* Icon sits below screenshot, not overlapping it */}
      <div className="ach-body">
        <div className="ach-icon" aria-hidden>
          <AchievementIcon name={ach.icon} />
        </div>

        <div className="ach-title">{ach.title}</div>

        <div className="ach-metric">
          <CountUp value={parseFloat(ach.metric)} active={inView} />
          <span className="ach-suffix">{ach.suffix}</span>
        </div>

        <div className="ach-label">{ach.label}</div>

        {ach.date && (
          <div className="ach-date">{ach.date}</div>
        )}

        <p className="ach-desc">{ach.description}</p>

        {/* Spacer pushes button to bottom regardless of content height */}
        <div className="ach-spacer" />

        {ach.postLink && (
          <a
            href={ach.postLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ach-link-btn"
          >
            {ach.postLinkText ? ach.postLinkText : 'View Post'}
          </a>
        )}
      </div>
    </motion.div>
  );
}

function CountUp({ value, active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !active) return;
    const duration = 1600;
    const t0 = performance.now();
    // Count decimal places in the original value (max 1)
    const decimals = value % 1 === 0 ? 0 : 1;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = value * eased;
      ref.current.textContent = v.toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return <span ref={ref}>0</span>;
}

function AchievementIcon({ name }) {
  const props = { width: 28, height: 28, strokeWidth: 1.6 };
  switch (name) {
    case 'trophy':      return <Trophy {...props} />;
    case 'graduation':  return <GraduationCap {...props} />;
    case 'rocket':      return <Rocket {...props} />;
    case 'briefcase':   return <Briefcase {...props} />;
    case 'fire':        return <Flame {...props} />;
    default:            return null;
  }
}