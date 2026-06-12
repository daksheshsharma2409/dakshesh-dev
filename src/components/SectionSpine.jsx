import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionSpine({ direction = 'right' }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: path.closest('.section'),
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const d = direction === 'right' 
    ? 'M -50 0 C 150 150, 250 400, 100 600 S 300 850, -50 1000'
    : 'M 450 0 C 250 150, 150 400, 300 600 S 100 850, 450 1000';

  return (
    <svg
      className="section-spine"
      viewBox="0 0 400 1000"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        [direction === 'right' ? 'right' : 'left']: 0,
        width: '300px',
        height: '100%',
        zIndex: 0,
        opacity: 0.3,
        pointerEvents: 'none'
      }}
    >
      <defs>
        <linearGradient id={`grad-${direction}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8ff00" stopOpacity="0" />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={d}
        stroke={`url(#grad-${direction})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
