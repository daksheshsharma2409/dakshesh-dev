import { useEffect, useState } from 'react';
import './Footer.css';

export default function Footer({ profile }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <span className="footer-brand">{profile.firstName}<span style={{ color: 'var(--accent)' }}>.</span></span>
          <span className="footer-text">© {new Date().getFullYear()} · Built with care, GSAP, and a lot of chai.</span>
        </div>

        <div className="footer-right">
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="hover">LinkedIn</a>
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" data-cursor="hover">GitHub</a>
          <a href={profile.social.email} data-cursor="hover">Email</a>
        </div>
      </div>

      <button
        className={`scroll-top ${show ? 'is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        data-cursor="hover"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
