import { useEffect, useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Maximize2, X } from "lucide-react"; // Added icons
import SectionSpine from "./SectionSpine";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ projects }) {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const [active, setActive] = useState(0);

    // NEW: State for Lightbox
    const [selectedImg, setSelectedImg] = useState(null);

    // NEW: Lock body scroll when image modal is open
    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedImg]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".project-card");
            if (cards.length === 0) return;

            // Reveal section
            gsap.fromTo(
                sectionRef.current.querySelector(".projects-header"),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                },
            );

            // Horizontal Scroll
            // gsap.to(cards, {
            //   xPercent: -100 * (cards.length - 1),
            //   ease: 'none',
            //   ...
            // });
        }, sectionRef);

        return () => ctx.revert();
    }, [projects]);

    return (
        <>
            <section
                className="projects section"
                id="projects"
                ref={sectionRef}
            >
                <SectionSpine direction="right" />
                <div className="container">
                    <div className="projects-header">
                        <span className="section-label" data-reveal>
                            Selected Work
                        </span>
                        <h2 className="section-title" data-reveal>
                            Projects I{" "}
                            <span className="gradient">actually</span> built.
                        </h2>
                        <p className="section-subtitle" data-reveal>
                            Real projects, real users, real code. Each one
                            pushed me to learn something new and ship something
                            better.
                        </p>
                    </div>
                </div>

                <div className="project-rail-wrap" ref={trackRef}>
                    <div className="project-rail">
                        {projects.map((p, i) => (
                            <ProjectCard
                                key={p.id}
                                project={p}
                                idx={i}
                                total={projects.length}
                                isActive={active === i}
                                // Pass the trigger down to the card
                                onOpenImage={() =>
                                    setSelectedImg(
                                        p.image ||
                                            `https://placehold.co/800x450/111118/444455?text=${encodeURIComponent(p.title)}`,
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Lightbox Modal --- */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        className="proj-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedImg(null)}
                    >
                        <button
                            className="proj-lightbox-close"
                            onClick={() => setSelectedImg(null)}
                        >
                            <X size={24} />
                        </button>

                        <motion.img
                            src={selectedImg}
                            alt="Enlarged Project View"
                            className="proj-lightbox-img"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function ProjectCard({ project, idx, total, isActive, onOpenImage }) {
    const cardRef = useRef(null);
    const tiltRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    // Tilt on hover
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`;
        };

        const onLeave = () => {
            el.style.transform =
                "perspective(800px) rotateX(0) rotateY(0) scale(1)";
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <motion.article
            ref={cardRef}
            className={`project-card ${isActive ? "is-active" : ""}`}
            data-idx={idx}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div
                className="project-card-inner"
                ref={tiltRef}
                style={{ transition: "transform 0.15s ease" }}
            >
                {/* Visual Section */}
                <div
                    className="project-visual"
                    style={{ background: project.gradient }}
                >
                    <motion.div
                        className="project-visual-img"
                        style={{ y: imgY }}
                    >
                        <img
                            src={
                                project.image ||
                                `https://placehold.co/800x450/111118/444455?text=${encodeURIComponent(project.title)}`
                            }
                            alt={`${project.title} screenshot`}
                            loading="lazy"
                        />
                    </motion.div>
                    <div className="project-overlay" />
                    <div className="project-tag-row">
                        {project.tags.slice(0, 3).map((t) => (
                            <span key={t} className="tag">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* NEW: Zoom Button */}
                    <button
                        className="proj-zoom-btn"
                        onClick={onOpenImage}
                        aria-label="Enlarge image"
                    >
                        <Maximize2 size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body Section */}
                <div className="project-body">
                    <div className="project-num-row">
                        <span className="project-num">
                            0{idx + 1} / 0{total}
                        </span>
                        <span className="project-subtitle">
                            {project.subtitle}
                        </span>
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    {project.date && (
                        <span className="project-date">{project.date}</span>
                    )}

                    <p className="project-description">{project.description}</p>

                    <ul className="project-highlights">
                        {project.highlights.map((h, j) => (
                            <li key={j}>
                                <span className="hl-arrow" aria-hidden>
                                    →
                                </span>
                                {h}
                            </li>
                        ))}
                    </ul>

                    <div className="project-tags">
                        {project.tags.map((t) => (
                            <span key={t} className="chip">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Project links */}
                    <div className="project-links">
                        {project.codeLink && (
                            <a
                                href={project.codeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link"
                                data-cursor="hover"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                Code
                            </a>
                        )}
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link project-link-live"
                                data-cursor="hover"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
