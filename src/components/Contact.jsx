import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import './Contact.css';

const socials = [
  {
    label: 'LinkedIn',
    href: profile.social.linkedin,
    handle: '/in/dakshesh-sharma',
    color: '#0a66c2',
  },
  {
    label: 'GitHub',
    href: profile.social.github,
    handle: '/dakshesh-sharma',
    color: '#ffffff',
  },
  {
    label: 'LeetCode',
    href: profile.social.leetcode,
    handle: '/dakshesh-sharma',
    color: '#ffa116',
  },
  {
    label: 'Email',
    href: profile.social.email,
    handle: 'dakshesh.sharma27@gmail.com',
    color: '#c8ff00',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

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

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="container contact-inner">
        <div className="contact-text">
          <span className="section-label" data-reveal>Get in touch</span>
          <h2 className="section-title" data-reveal>
            Have an idea, a role, or a coffee? <br />
            <span className="gradient">Let's talk.</span>
          </h2>
          <p className="contact-bio" data-reveal>
            I'm actively looking for full-time opportunities in data science
            and quantitative research. Whether you have a role, a project,
            or just want to chat about ML — my inbox is open.
          </p>

          <motion.button
            className="email-btn"
            onClick={copyEmail}
            data-cursor="hover"
            data-reveal
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Copy email to clipboard"
          >
            <span className="email-btn-text">{profile.email}</span>
            <span className="email-btn-action">
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </span>
          </motion.button>
        </div>

        <div className="contact-socials">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              className="social-card"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms`, '--c': s.color }}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              data-cursor="hover"
              whileHover={{ x: 8 }}
            >
              <span className="social-label">{s.label}</span>
              <span className="social-handle">{s.handle}</span>
              <span className="social-arrow" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
