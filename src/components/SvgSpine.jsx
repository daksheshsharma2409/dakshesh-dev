import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SvgSpine.css';

gsap.registerPlugin(ScrollTrigger);

/*
  Full-page SVG Spine — a single continuous path that flows from the very
  top to the very bottom of the page, drawing itself on scroll with a
  glowing particle at the draw-head.
*/
export default function SvgSpine() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const glowPathRef = useRef(null);
  const particleRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(6000);

  useEffect(() => {
    const updateHeight = () => {
      const h = document.documentElement.scrollHeight;
      setPageHeight(h);
    };

    updateHeight();
    // Re-measure after fonts/images load
    window.addEventListener('load', updateHeight);
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('load', updateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    const particle = particleRef.current;
    if (!path || !particle || !glowPath) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    glowPath.style.strokeDasharray = len;
    glowPath.style.strokeDashoffset = len;

    const ctx = gsap.context(() => {
      // Draw the path on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      });

      tl.to([path, glowPath], {
        strokeDashoffset: 0,
        ease: 'none',
      });

      // Move particle along path
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const point = path.getPointAtLength(progress * len);
          particle.setAttribute('cx', point.x);
          particle.setAttribute('cy', point.y);

          // Increase glow intensity based on velocity
          const vel = Math.min(Math.abs(self.getVelocity()) / 1000, 3);
          particle.setAttribute('r', 4 + vel * 2);
        },
      });
    });

    return () => ctx.revert();
  }, [pageHeight]);

  // Compute the viewBox height — map page height to SVG coordinates
  const vbW = 200;
  const vbH = (pageHeight / window.innerWidth) * vbW;
  const midX = vbW / 2;

  // Generate a creative path that weaves through the entire page
  const generatePath = () => {
    const segments = Math.ceil(vbH / 120);
    let d = `M ${midX} 0`;

    for (let i = 0; i < segments; i++) {
      const y1 = i * 120 + 30;
      const y2 = i * 120 + 60;
      const y3 = i * 120 + 90;
      const yEnd = i * 120 + 120;

      // Alternate between different creative curve patterns
      const pattern = i % 6;
      switch (pattern) {
        case 0:
          // Wide S-curve sweeping right
          d += ` C ${midX + 70} ${y1}, ${midX + 85} ${y2}, ${midX + 40} ${yEnd}`;
          break;
        case 1:
          // Sweep back to left with tight curve
          d += ` C ${midX + 20} ${y1}, ${midX - 80} ${y2}, ${midX - 50} ${yEnd}`;
          break;
        case 2:
          // Elegant loop going right
          d += ` C ${midX - 30} ${y1}, ${midX + 90} ${y2}, ${midX + 10} ${y3}`;
          d += ` S ${midX - 40} ${yEnd - 10}, ${midX - 20} ${yEnd}`;
          break;
        case 3:
          // Gentle wave through center
          d += ` C ${midX - 60} ${y1}, ${midX + 60} ${y2}, ${midX + 30} ${yEnd}`;
          break;
        case 4:
          // Tight spiral-like loop left
          d += ` C ${midX + 50} ${y1}, ${midX - 90} ${y1 + 15}, ${midX - 45} ${y2}`;
          d += ` S ${midX + 30} ${y3}, ${midX + 15} ${yEnd}`;
          break;
        case 5:
          // Wide arc back to center
          d += ` C ${midX + 40} ${y1}, ${midX - 70} ${y2}, ${midX} ${yEnd}`;
          break;
      }
    }

    return d;
  };

  const pathD = generatePath();

  return (
    <div className="svg-spine-container" aria-hidden="true">
      <svg
        ref={svgRef}
        className="svg-spine"
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main gradient for the path stroke */}
          <linearGradient id="spineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#c8ff00" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#00d4ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
          </linearGradient>

          {/* Glow filter for the path */}
          <filter id="spineGlow" x="-50%" y="-2%" width="200%" height="104%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow for the particle */}
          <filter id="particleGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for the particle */}
          <radialGradient id="particleGrad">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#c8ff00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow layer — wider, blurrier */}
        <path
          ref={glowPathRef}
          d={pathD}
          stroke="url(#spineGrad)"
          strokeWidth="4"
          fill="none"
          filter="url(#spineGlow)"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Main path */}
        <path
          ref={pathRef}
          d={pathD}
          stroke="url(#spineGrad)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Traveling particle / draw-head */}
        <circle
          ref={particleRef}
          cx={midX}
          cy="0"
          r="4"
          fill="url(#particleGrad)"
          filter="url(#particleGlow)"
        />
      </svg>
    </div>
  );
}
