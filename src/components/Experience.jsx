import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

export default function Experience({ experience }) {
  const ref = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const line = lineRef.current;
    const ctx = gsap.context(() => {
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 0.5,
            },
          }
        );
      }

      const items = ref.current?.querySelectorAll('[data-reveal]');
      if (items) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        items.forEach((el) => io.observe(el));
        return () => io.disconnect();
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  if (!experience || experience.length === 0) return null;

  return (
    <section className="experience section" id="experience" ref={ref}>
      <div className="container">
        <div className="experience-header">
          <span className="section-label" data-reveal>Experience</span>
          <h2 className="section-title" data-reveal>
            Where I've been <span className="gradient">shipping</span>.
          </h2>
        </div>

        <div className="timeline">
          <div className="timeline-line">
            <div className="timeline-line-fill" ref={lineRef} />
          </div>

          {experience.map((item, i) => (
            <motion.article
              key={i}
              className="timeline-item"
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
            >
              <div className="timeline-dot" style={{ '--c': item.color || '#c8ff00' }} aria-hidden>
                <span />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-head">
                  <div>
                    <span className="timeline-period">{item.period}</span>
                    <h3 className="timeline-role">{item.role}</h3>
                    <p className="timeline-company">
                      <span style={{ color: item.color || '#c8ff00' }}>{item.company}</span>
                      {' '}· <span className="muted">{item.location}</span>
                    </p>
                  </div>
                  <div className="timeline-num">0{i + 1}</div>
                </div>

                {item.description && (
                  <ul className="timeline-bullets">
                    {item.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}

                {item.skills && (
                  <div className="timeline-skills">
                    {item.skills.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
