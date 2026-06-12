import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ profile }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        y: -120,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero" id="hero">
      {/* Background grid + glow */}
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-noise" />
      </div>

      <div className="container hero-content">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="status-dot" /> {profile.availableFor}
        </motion.div>

        <div className="hero-title-wrap" ref={titleRef}>
          <h1 className="hero-title">
            <span className="line line-1">
              <SplitLetters text="Hi, I'm" delay={0.2} />
            </span>
            <span className="line line-2">
              <MagneticText text={profile.firstName} delay={0.35} gradient />
              {' '}
              <MagneticText text={profile.lastName} delay={0.55} gradient />
            </span>
          </h1>
        </div>

        <motion.p
          className="hero-role"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {profile.role}
        </motion.p>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
        >
          <a href="#projects" className="btn btn-primary" data-cursor="hover">
            See my work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="btn btn-ghost" data-cursor="hover">
            Get in touch
          </a>
        </motion.div>

        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span>{profile.location}</span>
          <span className="dot-sep" />
          <span>{profile.availableFor}</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        aria-hidden
      >
        <span>Scroll</span>
        <div className="scroll-line"><div className="scroll-line-fill" /></div>
      </motion.div>
    </section>
  );
}

function SplitLetters({ text, delay = 0, gradient = false }) {
  return (
    <span className={`split-wrap ${gradient ? 'is-gradient' : ''}`}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          className="split-letter"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.025,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

function MagneticText({ text, delay = 0, gradient = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.15;
      const dy = (e.clientY - cy) * 0.15;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s ease';
      setTimeout(() => {
        if (el) el.style.transition = '';
      }, 400);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`magnetic-text split-wrap ${gradient ? 'is-gradient' : ''}`} style={{ display: 'inline-block' }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          className="split-letter"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.025,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}
