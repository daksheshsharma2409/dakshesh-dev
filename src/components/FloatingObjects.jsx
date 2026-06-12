import './FloatingObjects.css';

/*
  Lightweight CSS-only 3D geometric shapes that float throughout the page.
  No JavaScript animation — pure CSS transforms and keyframes for 60fps GPU-accelerated performance.
*/

const SHAPES = [
  // Each shape: type, position (top%, left%), size, color, animation delay, rotation axis
  { type: 'cube', top: 5, left: 8, size: 40, color: '#c8ff00', delay: 0, duration: 18 },
  { type: 'tetra', top: 12, left: 88, size: 35, color: '#00d4ff', delay: 2, duration: 22 },
  { type: 'ring', top: 22, left: 15, size: 50, color: '#7c3aed', delay: 4, duration: 26 },
  { type: 'octa', top: 30, left: 82, size: 32, color: '#c8ff00', delay: 1, duration: 20 },
  { type: 'cube', top: 38, left: 5, size: 28, color: '#00d4ff', delay: 3, duration: 24 },
  { type: 'tetra', top: 48, left: 92, size: 38, color: '#7c3aed', delay: 5, duration: 19 },
  { type: 'ring', top: 55, left: 10, size: 44, color: '#c8ff00', delay: 2, duration: 28 },
  { type: 'octa', top: 62, left: 85, size: 30, color: '#00d4ff', delay: 0, duration: 21 },
  { type: 'cube', top: 70, left: 12, size: 36, color: '#7c3aed', delay: 4, duration: 25 },
  { type: 'tetra', top: 78, left: 90, size: 34, color: '#c8ff00', delay: 1, duration: 23 },
  { type: 'ring', top: 85, left: 6, size: 42, color: '#00d4ff', delay: 3, duration: 27 },
  { type: 'octa', top: 92, left: 88, size: 28, color: '#7c3aed', delay: 5, duration: 20 },
];

function Cube({ size, color, delay, duration }) {
  const half = size / 2;
  const faces = [
    { transform: `rotateY(0deg)   translateZ(${half}px)` },
    { transform: `rotateY(90deg)  translateZ(${half}px)` },
    { transform: `rotateY(180deg) translateZ(${half}px)` },
    { transform: `rotateY(-90deg) translateZ(${half}px)` },
    { transform: `rotateX(90deg)  translateZ(${half}px)` },
    { transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];

  return (
    <div
      className="shape-3d shape-cube"
      style={{
        width: size, height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {faces.map((f, i) => (
        <div
          key={i}
          className="cube-face"
          style={{
            ...f,
            width: size,
            height: size,
            borderColor: color,
          }}
        />
      ))}
    </div>
  );
}

function Tetrahedron({ size, color, delay, duration }) {
  return (
    <div
      className="shape-3d shape-tetra"
      style={{
        width: size, height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`tetra-face tetra-face-${i}`}
          style={{
            borderBottomColor: color,
            '--size': `${size}px`,
          }}
        />
      ))}
    </div>
  );
}

function Ring({ size, color, delay, duration }) {
  return (
    <div
      className="shape-3d shape-ring"
      style={{
        width: size, height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        borderColor: color,
        boxShadow: `0 0 15px ${color}33, inset 0 0 15px ${color}22`,
      }}
    />
  );
}

function Octahedron({ size, color, delay, duration }) {
  return (
    <div
      className="shape-3d shape-octa"
      style={{
        width: size, height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div className="octa-top" style={{ borderBottomColor: color, '--size': `${size}px` }} />
      <div className="octa-bottom" style={{ borderTopColor: color, '--size': `${size}px` }} />
    </div>
  );
}

const COMPONENTS = {
  cube: Cube,
  tetra: Tetrahedron,
  ring: Ring,
  octa: Octahedron,
};

export default function FloatingObjects() {
  return (
    <div className="floating-objects" aria-hidden="true">
      {SHAPES.map((shape, i) => {
        const Component = COMPONENTS[shape.type];
        return (
          <div
            key={i}
            className="floating-anchor"
            style={{
              top: `${shape.top}%`,
              left: `${shape.left}%`,
            }}
          >
            <div
              className="float-y"
              style={{
                animationDelay: `${shape.delay * 0.7}s`,
                animationDuration: `${4 + (i % 3) * 2}s`,
              }}
            >
              <Component
                size={shape.size}
                color={shape.color}
                delay={shape.delay}
                duration={shape.duration}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
