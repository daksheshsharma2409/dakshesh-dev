import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaJava, FaGit, FaFigma, FaHtml5, FaCss3, FaTerminal } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiTailwindcss, SiMongodb, SiExpress, SiNextdotjs, SiCplusplus, SiFirebase, SiPostgresql, SiNumpy, SiScikitlearn, SiPandas, SiOpencv } from 'react-icons/si';
import './Skills.css';

/*
  Interactive Skills Constellation — orbital rings with skill nodes.
  Each category is a ring. Skills orbit around it. Hover shows detail.
  On mobile, falls back to a glowing card grid.
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

export default function Skills({ skills }) {
  const ref = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const categories = Object.entries(skills);
  const COLORS = ['#c8ff00', '#00d4ff', '#7c3aed', '#ff6b6b', '#f59e0b'];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

  const toggleCategory = (cat) => {
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  return (
    <section className="skills section" id="skills" ref={ref}>
      <div className="container">
        <div className="skills-header">
          <span className="section-label" data-reveal>Toolbelt</span>
          <h2 className="section-title" data-reveal>
            My tech <span className="gradient">constellation</span>.
          </h2>
          <p className="section-subtitle" data-reveal>
            Click a category to focus. Hover skills to explore.
          </p>
        </div>

        {/* Category pills */}
        <div className="skills-pills" data-reveal>
          <button
            className={`skill-pill ${activeCategory === null ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map(([cat], i) => (
            <button
              key={cat}
              className={`skill-pill ${activeCategory === cat ? 'is-active' : ''}`}
              style={{ '--pill-color': COLORS[i % COLORS.length] }}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Constellation / Grid */}
        {isMobile ? (
          <MobileGrid
            categories={categories}
            colors={COLORS}
            activeCategory={activeCategory}
          />
        ) : (
          <DesktopConstellation
            categories={categories}
            colors={COLORS}
            activeCategory={activeCategory}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
          />
        )}
      </div>
    </section>
  );
}

function DesktopConstellation({ categories, colors, activeCategory, hoveredSkill, setHoveredSkill }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 750 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Scale it up significantly as requested by the user
        setDimensions({ width: rect.width, height: Math.max(850, rect.width * 0.75) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX.current;
    setRotation((r) => r + delta * 0.3); // Adjust rotation sensitivity
    lastX.current = e.clientX;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging]);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <div
      ref={containerRef}
      className="constellation-container"
      data-reveal
      onPointerDown={handlePointerDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <svg
        className="constellation-svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${rotation}deg)`,
            // Add a slight spring back or just smooth following if we wanted
          }}
        >
          {/* Orbit rings - removed CSS animation for manual control */}
          {categories.map(([cat], catIdx) => {
            const isActive = activeCategory === null || activeCategory === cat;
            const radius = 140 + catIdx * 90; // Much larger rings
            
            return (
              <circle
                key={`orbit-${cat}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={colors[catIdx % colors.length]}
                strokeWidth={isActive ? 1.5 : 0.5}
                strokeDasharray="6 12"
                opacity={isActive ? 0.4 : 0.1}
                className="orbit-ring"
                style={{ 
                  transition: 'opacity 0.5s ease',
                }}
              />
            );
          })}

          {/* Skill nodes */}
          {categories.map(([cat, skillList], catIdx) => {
            const isActive = activeCategory === null || activeCategory === cat;
            const radius = 140 + catIdx * 90;
            const color = colors[catIdx % colors.length];

            return skillList.map((skill, skillIdx) => {
              const angle = (skillIdx / skillList.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(angle) * radius;
              const y = cy + Math.sin(angle) * radius;
              const isHovered = hoveredSkill === `${cat}-${skill}`;
              const iconSize = isHovered ? 36 : 28; // Increased base size

              return (
                <g
                  key={`${cat}-${skill}`}
                  className="skill-node-group"
                  onMouseEnter={() => setHoveredSkill(`${cat}-${skill}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    opacity: isActive ? 1 : 0.15,
                    transition: 'opacity 0.4s ease',
                    cursor: 'pointer',
                  }}
                >
                  {/* Connection line to center */}
                  {isHovered && (
                    <line
                      x1={cx} y1={cy}
                      x2={x} y2={y}
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.6"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Node Backing (Glow + Background) */}
                  <circle
                    cx={x} cy={y} r={iconSize / 2 + 6}
                    fill="rgba(0,0,0,0.6)"
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 1 : 0.8}
                    filter={isHovered ? 'url(#nodeGlow)' : undefined}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* React Icon */}
                  <foreignObject
                    x={x - iconSize / 2}
                    y={y - iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    style={{ overflow: 'visible', pointerEvents: 'none' }}
                  >
                    <div style={{ 
                      color: color, 
                      fontSize: `${iconSize}px`, 
                      transition: 'all 0.3s ease',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%', 
                      height: '100%',
                      filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
                      // Counter-rotate the icon so it stays upright!
                      transform: `rotate(${-rotation}deg)`
                    }}>
                      {getSkillIcon(skill)}
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    x={x}
                    y={y + iconSize / 2 + 18}
                    fill={color}
                    fontSize={isHovered ? 15 : 13}
                    fontWeight={isHovered ? 600 : 400}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    opacity={isHovered ? 1 : 0.7}
                    style={{ 
                      transition: 'all 0.3s ease', 
                      pointerEvents: 'none',
                      // Counter-rotate the text from the node center
                      transformOrigin: `${x}px ${y}px`,
                      transform: `rotate(${-rotation}deg)`
                    }}
                  >
                    {skill}
                  </text>
                </g>
              );
            });
          })}
        </g>

        {/* Center node */}
        <circle cx={cx} cy={cy} r="20" fill="rgba(0,0,0,0.8)" stroke="#c8ff00" strokeWidth="2" opacity="0.8" />
        <circle cx={cx} cy={cy} r="6" fill="#c8ff00" opacity="1" filter="url(#nodeGlow)" />
        <text
          x={cx} y={cy + 36}
          fill="#c8ff00"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          opacity="0.9"
        >
          CORE
        </text>
      </svg>
    </div>
  );
}

function MobileGrid({ categories, colors, activeCategory }) {
  return (
    <div className="skills-mobile-grid">
      {categories.map(([cat, skillList], catIdx) => {
        const isActive = activeCategory === null || activeCategory === cat;
        const color = colors[catIdx % colors.length];

        return (
          <AnimatePresence key={cat}>
            {isActive && (
              <motion.div
                className="skill-card-mobile"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ '--card-color': color }}
              >
                <h3 className="skill-card-title">{cat}</h3>
                <div className="skill-card-chips">
                  {skillList.map((skill) => (
                    <div key={skill} className="skill-chip-mobile">
                      <span className="skill-chip-icon" style={{ color: color }}>
                        {getSkillIcon(skill)}
                      </span>
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}
