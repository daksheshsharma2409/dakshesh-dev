import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import { profile } from '../data/portfolio';

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`navbar ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-inner container">
        <a href="#hero" className="brand" aria-label="Home">
          <span className="brand-mark">DS</span>
          <span className="brand-text">Dakshesh<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" data-cursor="hover">
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <a
          href={profile.social.email}
          className="nav-cta"
          data-cursor="hover"
          aria-label="Email Dakshesh"
        >
          <span>Hire Me</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>

        <button
          className="nav-burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          data-cursor="hover"
        >
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="mobile-link"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
