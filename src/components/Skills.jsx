import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Skills.css';

/*
  Interactive Skills Constellation — orbital rings with skill nodes.
  Each category is a ring. Skills orbit around it. Hover shows detail.
  On mobile, falls back to a glowing card grid.
*/

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
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.width * 0.55) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <div
      ref={containerRef}
      className="constellation-container"
      data-reveal
    >
      <svg
        className="constellation-svg"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
      >
        <defs>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {categories.map(([cat], catIdx) => {
          const isActive = activeCategory === null || activeCategory === cat;
          const radius = 100 + catIdx * 65;
          return (
            <circle
              key={`orbit-${cat}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={colors[catIdx % colors.length]}
              strokeWidth={isActive ? 0.8 : 0.3}
              strokeDasharray="4 8"
              opacity={isActive ? 0.4 : 0.1}
              className="orbit-ring"
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}

        {/* Skill nodes */}
        {categories.map(([cat, skillList], catIdx) => {
          const isActive = activeCategory === null || activeCategory === cat;
          const radius = 100 + catIdx * 65;
          const color = colors[catIdx % colors.length];

          return skillList.map((skill, skillIdx) => {
            const angle = (skillIdx / skillList.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            const isHovered = hoveredSkill === `${cat}-${skill}`;
            const nodeSize = isHovered ? 8 : 5;

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
                    strokeWidth="0.5"
                    opacity="0.4"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Node */}
                <circle
                  cx={x} cy={y} r={nodeSize}
                  fill={color}
                  opacity={isHovered ? 1 : 0.7}
                  filter={isHovered ? 'url(#nodeGlow)' : undefined}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Label */}
                <text
                  x={x}
                  y={y - nodeSize - 8}
                  fill={color}
                  fontSize={isHovered ? 13 : 11}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  opacity={isHovered ? 1 : 0.7}
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {skill}
                </text>
              </g>
            );
          });
        })}

        {/* Center node */}
        <circle cx={cx} cy={cy} r="12" fill="none" stroke="#c8ff00" strokeWidth="1.5" opacity="0.6" />
        <circle cx={cx} cy={cy} r="4" fill="#c8ff00" opacity="0.8" />
        <text
          x={cx} y={cy + 28}
          fill="#c8ff00"
          fontSize="10"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          opacity="0.6"
        >
          SKILLS
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
                    <span key={skill} className="skill-chip-mobile">
                      {skill}
                    </span>
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
