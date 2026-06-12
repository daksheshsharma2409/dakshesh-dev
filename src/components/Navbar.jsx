import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar({ profile, data }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Only show nav links for sections that have data
  const allLinks = [
    { href: '#about', label: 'About', dataKey: 'profile' },
    { href: '#experience', label: 'Experience', dataKey: 'experience' },
    { href: '#projects', label: 'Projects', dataKey: 'projects' },
    { href: '#skills', label: 'Skills', dataKey: 'skills' },
    { href: '#achievements', label: 'Achievements', dataKey: 'achievements' },
    { href: '#certifications', label: 'Certifications', dataKey: 'certifications' },
    { href: '#contact', label: 'Contact', dataKey: 'profile' },
  ];

  const links = allLinks.filter((l) => {
    const val = data[l.dataKey];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return Boolean(val);
  });

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
          <DSLogo />
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
          aria-label={`Email ${profile.firstName}`}
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

// Inline SVG monogram — a stylised "D" interlocking with an "S".
// Pure SVG so it stays sharp at all sizes; primary fill uses --accent (lime).
function DSLogo() {
  return (
    <svg
      className="brand-mark brand-mark--svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Subtle outline tile for contrast on light scroll states */}
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="10"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
      {/* D — left glyph, lime fill */}
      <path
        d="M9 8h6.2c4.4 0 7.2 2.6 7.2 7v6c0 4.4-2.8 7-7.2 7H9V8zm3 3v14h3.1c2.5 0 4.3-1.4 4.3-4.1v-5.8C19.4 12.4 17.6 11 15.1 11H12z"
        fill="var(--accent)"
      />
      {/* S — right glyph, lime stroke + fill (overlaps slightly with D for a monogram feel) */}
      <path
        d="M20 12.4c0-1.6 1.3-2.7 3.1-2.7 1.7 0 3 .9 3.4 2.4l2.6-.9c-.7-2.5-2.9-4-6-4-3.3 0-5.7 1.9-5.7 4.6 0 5.7 9 3.6 9 7.1 0 1.7-1.4 2.8-3.3 2.8-2 0-3.4-1-3.8-2.7l-2.7.9c.7 2.7 3 4.3 6.5 4.3 3.5 0 5.9-1.9 5.9-4.7 0-5.7-9-3.6-9-7.1z"
        fill="var(--accent)"
        fillOpacity="0.85"
      />
    </svg>
  );
}
