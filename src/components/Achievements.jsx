import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Trophy, GraduationCap, Rocket, Briefcase, Flame, Maximize2, X } from 'lucide-react';
import './Achievements.css';

export default function Achievements({ achievements }) {
  const ref = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);

  // Intersection Observer for scroll reveal
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

  // Lock body scroll when image modal is open
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedImg]);

  if (!achievements || achievements.length === 0) return null;

  return (
    <>
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
              <AchievementCard 
                key={a.label} 
                ach={a} 
                idx={i} 
                onOpenImage={() => setSelectedImg(a.screenshot)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="ach-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedImg(null)} // Click background to close
          >
            <button className="ach-lightbox-close" onClick={() => setSelectedImg(null)}>
              <X size={24} />
            </button>
            
            <motion.img
              src={selectedImg}
              alt="Enlarged view"
              className="ach-lightbox-img"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AchievementCard({ ach, idx, onOpenImage }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={`ach-card ${ach.screenshot ? 'has-screenshot' : ''}`}
      data-reveal
      style={{ 
        transitionDelay: `${idx * 80}ms`,
        '--card-accent': ach.color || 'var(--accent)'
      }}
      whileHover={{ y: -6 }}
    >
      <div className="ach-card-glow" />

      {ach.screenshot && (
        <div className="ach-screenshot-wrapper">
          <img src={ach.screenshot} alt={`${ach.title} screenshot`} loading="lazy" />
          
          {/* Zoom Button inside the image wrapper */}
          <button 
            className="ach-zoom-btn" 
            onClick={onOpenImage}
            aria-label="Enlarge image"
          >
            <Maximize2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="ach-card-body">
        <div className="ach-card-top">
          <div className="ach-icon" aria-hidden>
            <AchievementIcon name={ach.icon} />
          </div>
          {ach.date && <span className="ach-date">{ach.date}</span>}
        </div>

        <div className="ach-card-main">
          <div className="ach-metric-wrapper">
            <span className="ach-metric">
              <CountUp value={parseFloat(ach.metric)} active={inView} />
            </span>
            {ach.suffix && <span className="ach-suffix">{ach.suffix}</span>}
          </div>
          
          <h3 className="ach-title">{ach.title}</h3>
          <p className="ach-desc">{ach.description}</p>
        </div>

        {ach.postLink && (
          <div className="ach-card-footer">
            <a
              href={ach.postLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ach-link-btn"
            >
              {ach.postLinkText ? ach.postLinkText : 'View Details'}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CountUp({ value, active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !active) return;
    const duration = 1400;
    const t0 = performance.now();
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
  const props = { width: 22, height: 22, strokeWidth: 2 };
  switch (name) {
    case 'trophy':      return <Trophy {...props} />;
    case 'graduation':  return <GraduationCap {...props} />;
    case 'rocket':      return <Rocket {...props} />;
    case 'briefcase':   return <Briefcase {...props} />;
    case 'fire':        return <Flame {...props} />;
    default:            return <Trophy {...props} />;
  }
}