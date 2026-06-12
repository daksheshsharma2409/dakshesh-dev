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
  
  // Shift the spine to the far right edge (95% of width) to avoid content entirely
  const baseX = vbW * 0.95;

  // Generate a creative but highly subtle path that waves down the right edge
  const generatePath = () => {
    const segments = Math.ceil(vbH / 200);
    let d = `M ${baseX} 0`;

    for (let i = 0; i < segments; i++) {
      const y1 = i * 200 + 60;
      const y2 = i * 200 + 140;
      const yEnd = i * 200 + 200;

      // Extremely subtle, long sweeping curves (drifting max 15 units)
      const pattern = i % 4;
      switch (pattern) {
        case 0:
          // Gentle drift left
          d += ` C ${baseX - 8} ${y1}, ${baseX - 15} ${y2}, ${baseX - 5} ${yEnd}`;
          break;
        case 1:
          // Sweep back to base
          d += ` C ${baseX + 5} ${y1}, ${baseX + 10} ${y2}, ${baseX} ${yEnd}`;
          break;
        case 2:
          // Slight outer drift right
          d += ` C ${baseX + 12} ${y1}, ${baseX + 15} ${y2}, ${baseX + 8} ${yEnd}`;
          break;
        case 3:
          // Return smoothly to center
          d += ` C ${baseX} ${y1}, ${baseX - 5} ${y2}, ${baseX} ${yEnd}`;
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
          cx={baseX}
          cy="0"
          r="4"
          fill="url(#particleGrad)"
          filter="url(#particleGlow)"
        />
      </svg>
    </div>
  );
}
