import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ profile }) {
  const heroRef = useRef(null);
  const bigPathRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1) Big SVG path draws on initial load
      const big = bigPathRef.current;
      if (big) {
        const len = big.getTotalLength();
        big.style.strokeDasharray = len;
        big.style.strokeDashoffset = len;
        gsap.to(big, {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: 'power3.inOut',
          delay: 0.4,
        });
      }

      // 2) As the user scrolls past the hero, the path "draws further"
      // and the title floats upward — creating the "path animation on scroll"
      // effect.
      gsap.to(big, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

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
          <span className="status-dot" /> Available for new opportunities
        </motion.div>

        <div className="hero-title-wrap" ref={titleRef}>
          <h1 className="hero-title">
            <span className="line line-1">
              <SplitLetters text="Hi, I'm" delay={0.2} />
            </span>
            <span className="line line-2">
              <SplitLetters text="Dakshesh" delay={0.35} gradient />
              <SplitLetters text="Sharma" delay={0.5} gradient />
            </span>
          </h1>
        </div>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
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
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <span>{profile.location}</span>
          <span className="dot-sep" />
          <span>{profile.availableFor}</span>
        </motion.div>
      </div>

      {/* Big scroll-driven path */}
      <svg
        className="hero-path"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="heroStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8ff00" stopOpacity="0" />
            <stop offset="20%" stopColor="#c8ff00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="1" />
            <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={bigPathRef}
          d="M -50 700
             C 200 600, 350 800, 550 650
             S 850 350, 1050 480
             S 1350 720, 1650 400"
          stroke="url(#heroStroke)"
          strokeWidth="2"
          fill="none"
          filter="url(#heroGlow)"
        />
      </svg>

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
