import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Line } from '@react-three/drei';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaJava, FaGit, FaFigma, FaHtml5, FaCss3, FaTerminal } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiTailwindcss, SiMongodb, SiExpress, SiNextdotjs, SiCplusplus, SiFirebase, SiPostgresql, SiNumpy, SiScikitlearn, SiPandas, SiOpencv } from 'react-icons/si';
import './Skills.css';

/*
  Interactive 3D Skills Constellation using Three.js & React Three Fiber.
  Features a fully interactive spherical node map that users can rotate and zoom.
*/

const getSkillIcon = (skillName) => {
  const s = skillName.toLowerCase();
  if (s.includes('react')) return <FaReact />;
  if (s.includes('node') || s.includes('express')) return <FaNodeJs />;
  if (s.includes('python')) return <FaPython />;
  if (s.includes('docker')) return <FaDocker />;
  if (s.includes('aws')) return <FaAws />;
  if (s.includes('java') && !s.includes('script')) return <FaJava />;
  if (s.includes('git')) return <FaGit />;
  if (s.includes('figma')) return <FaFigma />;
  if (s.includes('html')) return <FaHtml5 />;
  if (s.includes('css')) return <FaCss3 />;
  if (s.includes('javascript') || s.includes('js')) return <SiJavascript />;
  if (s.includes('typescript')) return <SiTypescript />;
  if (s.includes('tailwind')) return <SiTailwindcss />;
  if (s.includes('mongo')) return <SiMongodb />;
  if (s.includes('next')) return <SiNextdotjs />;
  if (s.includes('c++')) return <SiCplusplus />;
  if (s.includes('firebase')) return <SiFirebase />;
  if (s.includes('postgres') || s.includes('sql')) return <SiPostgresql />;
  if (s.includes('numpy')) return <SiNumpy />;
  if (s.includes('scikit')) return <SiScikitlearn />;
  if (s.includes('pandas')) return <SiPandas />;
  if (s.includes('opencv')) return <SiOpencv />;
  return <FaTerminal />;
};

const COLORS = ['#c8ff00', '#00d4ff', '#7c3aed', '#ff6b6b', '#f59e0b'];

function SkillNode({ position, skill }) {
  const [hovered, setHovered] = useState(false);
  const color = skill.color;

  // Make the HTML overlay larger if hovered
  return (
    <group>
      {/* Connection Line to Core */}
      <Line 
        points={[[0, 0, 0], position]} 
        color={color} 
        opacity={hovered ? 0.6 : 0.15} 
        transparent 
        lineWidth={hovered ? 3 : 1}
      />
      
      {/* 3D Node Sphere */}
      <mesh 
        position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 2 : 0.6} 
        />
      </mesh>

      {/* 2D HTML Overlay attached to 3D coords */}
      <Html position={position} center distanceFactor={12} zIndexRange={[100, 0]}>
        <div 
          className={`skill-3d-html ${hovered ? 'is-hovered' : ''}`}
          style={{ '--node-color': color }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="skill-3d-icon">
            {getSkillIcon(skill.name)}
          </div>
          <span className="skill-3d-name">{skill.name}</span>
        </div>
      </Html>
    </group>
  );
}

function Constellation({ skillsData }) {
  const groupRef = useRef();

  // Slow continuous auto-rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  // Calculate uniform spherical distribution (Fibonacci lattice)
  const points = useMemo(() => {
    const samples = skillsData.length;
    const radius = 6;
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); 
      const theta = phi * i; 
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      // Randomize distance slightly for a more organic feel
      const jitter = 0.8 + Math.random() * 0.4;
      pts.push([x * radius * jitter, y * radius * jitter, z * radius * jitter]);
    }
    return pts;
  }, [skillsData.length]);

  return (
    <group ref={groupRef}>
      {/* Core Node */}
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color="#c8ff00" wireframe />
      </mesh>
      
      {/* Skill Nodes */}
      {skillsData.map((skill, i) => (
        <SkillNode key={skill.name} position={points[i]} skill={skill} />
      ))}
    </group>
  );
}

export default function Skills({ skills }) {
  const ref = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const categories = Object.keys(skills);

  // Flatten and filter the skills data into a single array with assigned colors
  const filteredSkills = useMemo(() => {
    const arr = [];
    Object.entries(skills).forEach(([cat, list], i) => {
      if (activeCategory && activeCategory !== cat) return;
      list.forEach(skillName => {
        arr.push({ name: skillName, category: cat, color: COLORS[i % COLORS.length] });
      });
    });
    return arr;
  }, [skills, activeCategory]);

  useEffect(() => {
    // Manage document scroll lock when canvas is locked
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLocked]);

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

  return (
    <section className="skills section" id="skills" ref={ref}>
      <div className="container">
        <div className="skills-header">
          <span className="section-label" data-reveal>Toolbelt</span>
          <h2 className="section-title" data-reveal>
            My 3D <span className="gradient">constellation</span>.
          </h2>
          <p className="section-subtitle" data-reveal>
            Explore the universe of my skills. Select a category below to filter.
          </p>
        </div>

        {/* Category pills */}
        <div className="skills-pills" data-reveal style={{ marginBottom: '24px' }}>
          <button
            className={`skill-pill ${activeCategory === null ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`skill-pill ${activeCategory === cat ? 'is-active' : ''}`}
              style={{ '--pill-color': COLORS[i % COLORS.length] }}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D Canvas Container */}
        <div className={`canvas-container ${isLocked ? 'is-locked' : ''}`} data-reveal>
          {/* Lock Overlay / Toggle */}
          <button 
            className="canvas-lock-btn" 
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? '🔓 Unlock Scroll' : '🔒 Lock & Zoom'}
          </button>

          <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
            {/* Environment lighting */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Constellation Logic */}
            <Constellation skillsData={filteredSkills} />
            
            {/* Interactive Controls */}
            <OrbitControls 
              enableZoom={isLocked} 
              enablePan={false} 
              autoRotate={false}
              maxDistance={25}
              minDistance={5}
            />
            
            {/* Background Stars */}
            <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
          
        </div>
      </div>
    </section>
  );
}
