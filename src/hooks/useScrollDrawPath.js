import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates a child SVG path so that it draws itself as the section scrolls
 * into view, then optionally continues to draw proportionally to scroll
 * progress through the section.
 *
 * Props:
 *  - drawChildren: array of <path> JSX (must each have a unique id or class)
 *  - onProgress:   optional fn receiving 0..1
 */
export function ScrollPath({ paths, className = '', containerRef }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef?.current;
    if (!svg) return;
    const pathEls = svg.querySelectorAll('path');
    if (!pathEls.length) return;

    pathEls.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    const triggerEl = container || svg;

    const ctx = gsap.context(() => {
      gsap.to(pathEls, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      });
    }, svg);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths}
    </svg>
  );
}

/**
 * Returns a ref. When attached to an element, draws an SVG that follows the
 * path of the element on scroll. Lightweight wrapper for one-off usage.
 */
export function useScrollDrawPath() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const path = el.querySelector('path');
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: 0.5,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
