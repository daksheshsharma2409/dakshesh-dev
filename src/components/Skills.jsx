import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/portfolio';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const ref = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations
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
    }, ref);

    // Marquee speed tied to scroll velocity
    const marquee = marqueeRef.current;
    let tween;
    if (marquee) {
      tween = gsap.to(marquee, {
        xPercent: -50,
        duration: 25,
        ease: 'none',
        repeat: -1,
      });
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (Math.abs(v) > 100) {
            gsap.to(tween, { timeScale: v > 0 ? 1.6 : -1.6, duration: 0.3, overwrite: true });
            gsap.delayedCall(0.4, () =>
              gsap.to(tween, { timeScale: 1, duration: 0.6 })
            );
          }
        },
      });
    }

    return () => {
      ctx.revert();
      if (tween) tween.kill();
    };
  }, []);

  const allSkills = Object.entries(skills);

  // Build a flat list for the marquee
  const marqueeSkills = Object.values(skills).flat();

  return (
    <section className="skills section" id="skills" ref={ref}>
      <div className="container">
        <div className="skills-header">
          <span className="section-label" data-reveal>Toolbelt</span>
          <h2 className="section-title" data-reveal>
            Tools, languages, <span className="gradient">and the in-betweens</span>.
          </h2>
        </div>

        <div className="skills-marquee" aria-hidden>
          <div className="skills-marquee-track" ref={marqueeRef}>
            {[...marqueeSkills, ...marqueeSkills].map((s, i) => (
              <span className="marquee-item" key={i}>
                <span className="marquee-dot" />
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {allSkills.map(([cat, list], i) => (
            <motion.div
              key={cat}
              className="skill-category"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              whileHover={{ y: -4 }}
            >
              <div className="cat-head">
                <span className="cat-num">0{i + 1}</span>
                <h3 className="cat-title">{cat}</h3>
              </div>
              <ul className="cat-list">
                {list.map((skill) => (
                  <li key={skill} className="cat-skill" data-cursor="hover">
                    <span className="skill-bullet" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
