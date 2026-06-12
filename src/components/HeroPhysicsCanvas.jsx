import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGit } from 'react-icons/fa';
import { SiJavascript, SiCplusplus } from 'react-icons/si';

const TECH_DATA = [
  { name: 'React', color: '#00d4ff', shadowColor: 'rgba(0, 212, 255, 0.2)', icon: <FaReact /> },
  { name: 'Node.js', color: '#68a063', shadowColor: 'rgba(104, 160, 99, 0.2)', icon: <FaNodeJs /> },
  { name: 'Python', color: '#ffd343', shadowColor: 'rgba(255, 211, 67, 0.2)', icon: <FaPython /> },
  { name: 'C++', color: '#00599c', shadowColor: 'rgba(0, 89, 156, 0.2)', icon: <SiCplusplus /> },
  { name: 'JavaScript', color: '#f7df1e', shadowColor: 'rgba(247, 223, 30, 0.2)', icon: <SiJavascript /> },
  { name: 'Docker', color: '#2496ed', shadowColor: 'rgba(36, 150, 237, 0.2)', icon: <FaDocker /> },
  { name: 'Git', color: '#f05032', shadowColor: 'rgba(240, 80, 50, 0.2)', icon: <FaGit /> },
];

function PhysicsBadges() {
  const count = TECH_DATA.length;
  
  // Track position states in refs to bypass React's render loop
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0.85, // Safe radius to avoid overlaps
        pulseOffset: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const { viewport, clock } = state;
    const time = clock.getElapsedTime();

    const springConstant = 0.006; // Softer spring for floaty movements
    const damping = 0.96; // Less friction so drift is smooth and continuous

    const vw = viewport.width / 2;
    const vh = viewport.height / 2;
    const isDesktop = viewport.width >= 8.5;

    // Home anchors biased to the right on desktop, ellipse on mobile
    const getHomePos = (index) => {
      if (isDesktop) {
        switch (index) {
          case 0: return { x: vw * 0.35, y: vh * 0.4 };   // React (top right)
          case 1: return { x: vw * 0.45, y: -vh * 0.15 }; // Node.js (mid bottom right)
          case 2: return { x: vw * 0.55, y: vh * 0.1 };   // Python (mid right)
          case 3: return { x: vw * 0.2,  y: -vh * 0.5 };  // C++ (bottom right)
          case 4: return { x: vw * 0.1,  y: vh * 0.65 };  // JavaScript (top center-right)
          case 5: return { x: -vw * 0.45, y: vh * 0.5 };   // Docker (top left, above title)
          case 6: return { x: vw * 0.5,  y: -vh * 0.6 };  // Git (bottom far-right)
          default: return { x: 0, y: 0 };
        }
      } else {
        const angle = (index / count) * Math.PI * 2;
        return {
          x: Math.cos(angle) * vw * 0.6,
          y: Math.sin(angle) * vh * 0.65,
        };
      }
    };

    // 1) Apply spring and drift forces
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const home = getHomePos(i);

      let ax = 0;
      let ay = 0;

      // Spring pull back to home position
      ax += (home.x - p.x) * springConstant;
      ay += (home.y - p.y) * springConstant;

      // Smooth fluid wave float (larger, slower oscillation)
      ax += Math.sin(time * p.speed * 0.5 + p.pulseOffset) * 0.0035;
      ay += Math.cos(time * p.speed * 0.4 + p.pulseOffset) * 0.0035;

      // Euler integration
      p.vx = (p.vx + ax) * damping;
      p.vy = (p.vy + ay) * damping;
      p.x += p.vx;
      p.y += p.vy;

      // Screen boundary bounds check
      const xBound = vw - p.radius;
      const yBound = vh - p.radius;

      if (p.x < -xBound) { p.x = -xBound; p.vx *= -0.3; }
      if (p.x > xBound) { p.x = xBound; p.vx *= -0.3; }
      if (p.y < -yBound) { p.y = -yBound; p.vy *= -0.3; }
      if (p.y > yBound) { p.y = yBound; p.vy *= -0.3; }
    }

    // 2) Collision prevention between cards (elastic node push)
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = p1.radius + p2.radius;

        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          // Push apart equally
          p1.x -= nx * overlap * 0.5;
          p1.y -= ny * overlap * 0.5;
          p2.x += nx * overlap * 0.5;
          p2.y += ny * overlap * 0.5;

          // Bounce velocities
          const kx = p1.vx - p2.vx;
          const ky = p1.vy - p2.vy;
          const pVal = 2 * (nx * kx + ny * ky) / 2;

          p1.vx -= pVal * nx * 0.4;
          p1.vy -= pVal * ny * 0.4;
          p2.vx += pVal * nx * 0.4;
          p2.vy += pVal * ny * 0.4;
        }
      }
    }
  });

  return (
    <group>
      {TECH_DATA.map((t, idx) => (
        <TechBadge key={t.name} data={t} stateNode={particles[idx]} />
      ))}
    </group>
  );
}

function TechBadge({ data, stateNode }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(stateNode.x, stateNode.y, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={8} zIndexRange={[100, 0]}>
        <div
          className="hero-tech-badge"
          style={{
            '--badge-color': data.color,
            '--badge-shadow': data.shadowColor,
            '--badge-border': 'rgba(255, 255, 255, 0.06)',
          }}
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
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none', // Allow layout clicks to pass through
      }}
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
