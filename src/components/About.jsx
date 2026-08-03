import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import {
    FaFolderOpen,
    FaAward,
    FaLaptopCode,
    FaDownload,
} from "react-icons/fa";
import "./About.css";

export default function About({
    profile,
    education,
    projects,
    certifications,
}) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray("[data-reveal]").forEach((el) => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                });
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    // Dynamic stats computed from actual data
    const projectCount = projects?.length || 0;
    const certCount = certifications?.length || 0;

    return (
        <section className="about section" id="about" ref={ref}>
            <div className="container about-grid">
                <div className="about-photo" data-reveal>
                    <motion.div
                        className="photo-frame"
                        style={{ y: imgY, scale: imgScale }}
                    >
                        {/* Decorative ambient orbs */}
                        <div className="photo-orb photo-orb--lime" />
                        <div className="photo-orb photo-orb--violet" />
                        <div className="photo-orb photo-orb--cyan" />

                        {/* Rotating outer ring */}
                        <div className="photo-ring-outer">
                            <div className="photo-ring-inner" />
                        </div>

                        {/* Main clipped image */}
                        <div className="photo-clip-wrapper">
                            <div className="photo-clip">
                                <img
                                    src="/images/profile.png"
                                    alt={`Portrait of ${profile.name}`}
                                />
                                <div className="photo-clip-shimmer" />
                            </div>
                        </div>

                        {/* Floating corner badge */}
                        <div className="photo-badge photo-badge--tl">
                            <span className="photo-badge-dot" />
                            <span className="photo-badge-text">Open to Work</span>
                        </div>

                        {/* Bottom-right tech tag */}
                        <div className="photo-badge photo-badge--br">
                            <span className="photo-badge-text">AI / Full-Stack</span>
                            <span className="photo-badge-dot photo-badge-dot--cyan" />
                        </div>

                        {/* Decorative corner accents */}
                        <div className="photo-corner-accent photo-corner-accent--tl" />
                        <div className="photo-corner-accent photo-corner-accent--br" />
                    </motion.div>
                </div>

                <div className="about-content">
                    <span className="section-label" data-reveal>
                        About
                    </span>
                    <h2 className="section-title" data-reveal>
                        Student by day, <br />
                        <span className="gradient">builder by obsession</span>.
                    </h2>

                    <p className="about-bio" data-reveal>
                        2nd-year B.Tech <strong>Artificial Intelligence</strong>{" "}
                        student at{" "}
                        <strong>
                            Newton School of Technology, Rishihood University
                        </strong>
                        . I build things that live on the internet —
                        recommendation engines, storefronts, and everything in
                        between.
                    </p>

                    <p className="about-bio" data-reveal>
                        When I'm not shipping, I'm grinding LeetCode, exploring
                        ML with Python, or crafting pixel-perfect UIs in Figma.
                        I believe the best way to learn is to build.
                    </p>

                    {(projectCount > 0 || certCount > 0) && (
                        <div className="about-stats" data-reveal>
                            {projectCount > 0 && (
                                <div className="stat">
                                    <FaFolderOpen className="stat-icon" />
                                    <span className="stat-num">
                                        {projectCount}
                                    </span>
                                    <span className="stat-label">
                                        Projects Built
                                    </span>
                                </div>
                            )}
                            {certCount > 0 && (
                                <div className="stat">
                                    <FaAward className="stat-icon" />
                                    <span className="stat-num">
                                        {certCount}
                                    </span>
                                    <span className="stat-label">
                                        Certifications
                                    </span>
                                </div>
                            )}
                            <div className="stat">
                                <FaLaptopCode className="stat-icon" />
                                <span className="stat-num">5+</span>
                                <span className="stat-label">
                                    Technologies Used
                                </span>
                            </div>
                        </div>
                    )}

                    <motion.a
                        href="/Resume-Dakshesh Sharma.pdf"
                        download
                        className="resume-btn"
                        data-reveal
                        data-cursor="hover"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <FaDownload />
                        Download Resume
                    </motion.a>

                    <div className="education">
                        <h3 className="education-title" data-reveal>
                            Education
                        </h3>
                        <ul className="education-list">
                            {education.map((e, i) => (
                                <li
                                    key={i}
                                    className="education-item"
                                    data-reveal
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <div className="edu-marker">
                                        <span />
                                    </div>
                                    <div className="edu-body">
                                        <div className="edu-head">
                                            <strong>{e.school}</strong>
                                            <span className="edu-period">
                                                {e.period}
                                            </span>
                                        </div>
                                        <div className="edu-degree">
                                            {e.degree}
                                        </div>
                                        <div className="edu-meta">
                                            <span>{e.location}</span>
                                            <span className="dot-sep" />
                                            <span>{e.gpa}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
