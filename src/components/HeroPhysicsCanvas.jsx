import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { FaReact, FaPython, FaGit, FaFigma } from 'react-icons/fa';
import { SiJavascript, SiCplusplus, SiNextdotjs, SiTailwindcss } from 'react-icons/si';

const TECH_DATA = [
  { name: 'React',       color: '#00d4ff', shadowColor: 'rgba(0,212,255,0.18)',   icon: <FaReact /> },
  { name: 'Python',      color: '#ffd343', shadowColor: 'rgba(255,211,67,0.18)',  icon: <FaPython /> },
  { name: 'JavaScript',  color: '#f7df1e', shadowColor: 'rgba(247,223,30,0.18)', icon: <SiJavascript /> },
  { name: 'C++',         color: '#00599c', shadowColor: 'rgba(0,89,156,0.18)',   icon: <SiCplusplus /> },
  { name: 'Next.js',     color: '#ffffff', shadowColor: 'rgba(255,255,255,0.12)',icon: <SiNextdotjs /> },
  { name: 'Tailwind CSS',color: '#06b6d4', shadowColor: 'rgba(6,182,212,0.18)',  icon: <SiTailwindcss /> },
  { name: 'Figma',       color: '#ff7262', shadowColor: 'rgba(255,114,98,0.18)', icon: <FaFigma /> },
  { name: 'Git',         color: '#f05032', shadowColor: 'rgba(240,80,50,0.18)',  icon: <FaGit /> },
];

// Deterministic home positions (biased to right side on desktop)
function getHomePos(index, count, vw, vh, isDesktop) {
  if (isDesktop) {
    const positions = [
      { x: vw * 0.38, y: vh * 0.45 },   // 0 React
      { x: vw * 0.55, y: vh * 0.12 },   // 1 Python
      { x: vw * 0.42, y: -vh * 0.22 },  // 2 JavaScript
      { x: vw * 0.22, y: -vh * 0.52 },  // 3 C++
      { x: vw * 0.58, y: -vh * 0.1 },   // 4 Next.js
      { x: vw * 0.12, y: vh * 0.62 },   // 5 Tailwind
      { x: -vw * 0.4, y: vh * 0.48 },   // 6 Figma (upper left)
      { x: vw * 0.46, y: -vh * 0.62 },  // 7 Git
    ];
    return positions[index] ?? { x: 0, y: 0 };
  }
  // Mobile: ellipse ring
  const angle = (index / count) * Math.PI * 2;
  return { x: Math.cos(angle) * vw * 0.62, y: Math.sin(angle) * vh * 0.68 };
}

function PhysicsBadges() {
  const count = TECH_DATA.length;

  const particles = useMemo(() => {
    return TECH_DATA.map((_, i) => ({
      x: 0, y: 0,
      vx: 0, vy: 0,
      radius: 0.9,
      // Unique phase offsets so each badge has its own gentle orbit path
      phaseX: (i / count) * Math.PI * 2,
      phaseY: (i / count) * Math.PI * 2 + 1.2,
      orbitAmp: 0.18 + (i % 3) * 0.06, // subtle amplitude variation
      speed: 0.28 + (i % 4) * 0.04,    // vary the orbit period slightly
    }));
  }, [count]);

  useFrame(({ viewport, clock }) => {
    const t = clock.getElapsedTime();
    const vw = viewport.width / 2;
    const vh = viewport.height / 2;
    const isDesktop = viewport.width >= 8.5;
    const spring = 0.007;
    const damp   = 0.97;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const home = getHomePos(i, count, vw, vh, isDesktop);

      // Slow sine-wave orbit offset layered on top of spring home position
      const orbitX = Math.sin(t * p.speed + p.phaseX) * p.orbitAmp * vw;
      const orbitY = Math.cos(t * p.speed * 0.7 + p.phaseY) * p.orbitAmp * vh * 0.5;

      const targetX = home.x + orbitX;
      const targetY = home.y + orbitY;

      const ax = (targetX - p.x) * spring;
      const ay = (targetY - p.y) * spring;

      p.vx = (p.vx + ax) * damp;
      p.vy = (p.vy + ay) * damp;
      p.x += p.vx;
      p.y += p.vy;

      // Soft boundary clamp
      const xBound = vw - p.radius;
      const yBound = vh - p.radius;
      if (p.x < -xBound) { p.x = -xBound; p.vx *= -0.3; }
      if (p.x >  xBound) { p.x =  xBound; p.vx *= -0.3; }
      if (p.y < -yBound) { p.y = -yBound; p.vy *= -0.3; }
      if (p.y >  yBound) { p.y =  yBound; p.vy *= -0.3; }
    }

    // Soft collision prevention
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const a = particles[i], b = particles[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minD = a.radius + b.radius;
        if (dist < minD && dist > 0.01) {
          const ov = minD - dist;
          const nx = dx / dist, ny = dy / dist;
          a.x -= nx * ov * 0.5; a.y -= ny * ov * 0.5;
          b.x += nx * ov * 0.5; b.y += ny * ov * 0.5;
        }
      }
    }
  });

  return (
    <group>
      {TECH_DATA.map((t, i) => (
        <TechBadge key={t.name} data={t} node={particles[i]} />
      ))}
    </group>
  );
}

function TechBadge({ data, node }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.position.set(node.x, node.y, 0);
  });
  return (
    <group ref={ref}>
      <Html center distanceFactor={8} zIndexRange={[100, 0]}>
        <div
          className="hero-tech-badge"
          style={{ '--badge-color': data.color, '--badge-shadow': data.shadowColor }}
        >
          <div className="badge-icon-wrap">{data.icon}</div>
          <span className="badge-name">{data.name}</span>
        </div>
      </Html>
    </group>
  );
}

export default function HeroPhysicsCanvas() {
  return (
    <div
      className="hero-physics-container"
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <PhysicsBadges />
      </Canvas>
    </div>
  );
}
