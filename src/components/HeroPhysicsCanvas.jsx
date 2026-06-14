import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { FaReact, FaPython, FaGit, FaFigma } from "react-icons/fa";
import {
    SiJavascript,
    SiCplusplus,
    SiNextdotjs,
    SiTailwindcss,
} from "react-icons/si";

const TECH_DATA = [
    {
        name: "React",
        color: "#00d4ff",
        shadowColor: "rgba(0,212,255,0.18)",
        icon: <FaReact />,
    },
    {
        name: "Python",
        color: "#ffd343",
        shadowColor: "rgba(255,211,67,0.18)",
        icon: <FaPython />,
    },
    {
        name: "JavaScript",
        color: "#f7df1e",
        shadowColor: "rgba(247,223,30,0.18)",
        icon: <SiJavascript />,
    },
    {
        name: "C++",
        color: "#00599c",
        shadowColor: "rgba(0,89,156,0.18)",
        icon: <SiCplusplus />,
    },
    {
        name: "Next.js",
        color: "#ffffff",
        shadowColor: "rgba(255,255,255,0.12)",
        icon: <SiNextdotjs />,
    },
    {
        name: "Tailwind CSS",
        color: "#06b6d4",
        shadowColor: "rgba(6,182,212,0.18)",
        icon: <SiTailwindcss />,
    },
    {
        name: "Figma",
        color: "#ff7262",
        shadowColor: "rgba(255,114,98,0.18)",
        icon: <FaFigma />,
    },
    {
        name: "Git",
        color: "#f05032",
        shadowColor: "rgba(240,80,50,0.18)",
        icon: <FaGit />,
    },
];

// Deterministic home positions (biased to right side on desktop)
function getHomePos(index, count, vw, vh, isDesktop) {
    if (isDesktop) {
        const positions = [
            { x: vw * 0.38, y: vh * 0.45 }, // 0 React
            { x: vw * 0.55, y: vh * 0.12 }, // 1 Python
            { x: vw * 0.42, y: -vh * 0.22 }, // 2 JavaScript
            { x: vw * 0.22, y: -vh * 0.52 }, // 3 C++
            { x: vw * 0.8, y: -vh * 0.1 }, // 4 Next.js
            { x: vw * 0.12, y: vh * 0.62 }, // 5 Tailwind
            { x: -vw * 0.4, y: vh * 0.48 }, // 6 Figma (upper left)
            { x: vw * 0.46, y: -vh * 0.62 }, // 7 Git
        ];
        return positions[index] ?? { x: 0, y: 0 };
    }
    // Mobile: ellipse ring
    const angle = (index / count) * Math.PI * 2;
    return { x: Math.cos(angle) * vw * 0.62, y: Math.sin(angle) * vh * 0.68 };
}

// Stable, varied animation parameters per badge —
// duration between 3s and 6s, with a unique phase/delay
// so badges never move in sync.
function getFloatParams(i) {
    // 8 unique combos from index; keep range constrained.
    const duration = 3.2 + ((i * 0.41) % 2.8); // 3.2s .. 6.0s
    const delay = -((i * 0.37) % 2.5); // negative delay so all start mid-cycle on mount
    // Drift amplitude: 8–14px on each axis (well within the 20-30px requirement)
    const dx = 12 + ((i * 7) % 7); // 8 .. 14
    const dy = 12 + (((i + 3) * 5) % 7); // 8 .. 14
    return { duration, delay, dx, dy };
}

function PhysicsBadges() {
    const count = TECH_DATA.length;

    // Per-badge float params, computed once.
    const floatParams = useMemo(
        () => TECH_DATA.map((_, i) => getFloatParams(i)),
        [count],
    );

    // Stable node objects — one per badge — mutated each frame to set position.
    const nodes = useRef(TECH_DATA.map((_, i) => ({ x: 0, y: 0, i }))).current;

    useFrame(({ viewport }) => {
        const vw = viewport.width / 2;
        const vh = viewport.height / 2;
        const isDesktop = viewport.width >= 8.5;

        // No more random-walk / spring physics — the CSS keyframe animation
        // on each badge handles the gentle drift, contained to ~20-30px.
        // We just position each badge at its deterministic home, so they
        // remain stable inside the hero bounds.
        for (let i = 0; i < count; i++) {
            const home = getHomePos(i, count, vw, vh, isDesktop);
            nodes[i].x = home.x;
            nodes[i].y = home.y;
        }
    });

    return (
        <group>
            {TECH_DATA.map((t, i) => (
                <TechBadge
                    key={t.name}
                    data={t}
                    node={nodes[i]}
                    floatParams={floatParams[i]}
                />
            ))}
        </group>
    );
}

function TechBadge({ data, node, floatParams }) {
    const ref = useRef();
    useFrame(() => {
        if (ref.current) ref.current.position.set(node.x, node.y, 0);
    });

    // Inline style for the per-badge keyframe animation.
    // @keyframes tag-float is defined in Hero.css and is contained to ~20-30px.
    const animStyle = {
        "--float-duration": `${floatParams.duration}s`,
        "--float-delay": `${floatParams.delay}s`,
        "--float-dx": `${floatParams.dx}px`,
        "--float-dy": `${floatParams.dy}px`,
    };

    return (
        <group ref={ref}>
            <Html center distanceFactor={8} zIndexRange={[100, 0]}>
                <div
                    className="hero-tech-badge tag-float"
                    style={{
                        ...animStyle,
                        "--badge-color": data.color,
                        "--badge-shadow": data.shadowColor,
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
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 7], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true }}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                }}
            >
                <PhysicsBadges />
            </Canvas>
        </div>
    );
}
