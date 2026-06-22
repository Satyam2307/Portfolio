"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./PortfolioSections.module.css";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioSections() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in section headers as they enter viewport
      const sections = gsap.utils.toArray(`.${styles.section}`);
      sections.forEach((sec) => {
        const header = sec.querySelector(`.${styles.header}`);
        const content = sec.querySelector(`.${styles.grid}, .${styles.aboutText}, .${styles.contactForm}`);

        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              scrollTrigger: {
                trigger: sec,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const skillsList = [
    { name: "JavaScript", type: "Frontend", level: "Intermediate", glow: "orange" },
    { name: "Python", type: "Scripting & Backend", level: "Intermediate", glow: "blue" },
    { name: "Java", type: "Object Oriented Programming", level: "Intermediate", glow: "orange" },
    { name: "C Language", type: "Systems Programming", level: "Fundamental", glow: "blue" },
    { name: "HTML5", type: "Web Structure", level: "Advanced", glow: "orange" },
    { name: "CSS3 / Modern Layouts", type: "Web Styling & Motion", level: "Advanced", glow: "blue" },
  ];

  const projectsList = [
    {
      title: "Spotify Web Player UI Clone",
      category: "Frontend Application",
      description: "A pixel-perfect UI/UX recreation of the Spotify web player desktop experience. Features a custom playback control interface, interactive side navigation libraries, and fluid grid layouts designed for smooth navigation.",
      tech: ["HTML5", "CSS3 / Flexbox", "JavaScript", "UI Design"],
      link: "#",
      glow: "orange",
    },
    {
      title: "Sidebar Navigation Menu",
      category: "Interaction & Component Design",
      description: "An elegant, interactive navigation drawer with smooth state-based transition animations. Leverages modern CSS transitions, flexbox alignments, active-state indicator track tracking, and collapsed layouts for compact viewports.",
      tech: ["HTML5", "CSS Variables", "JavaScript", "Micro-interactions"],
      link: "#",
      glow: "blue",
    },
    {
      title: "Creative Storytelling Website",
      category: "Immersive Web Experience",
      description: "A storytelling project designed to engage audiences using flow layouts, parallax scroll elements, and cinematic visual transitions. Blends interactive reading with visual animations and high-contrast styling.",
      tech: ["HTML5", "CSS Animation", "JavaScript", "Creative Direction"],
      link: "#",
      glow: "orange",
    },
  ];

  return (
    <div ref={containerRef} className={styles.container}>
      {/* 1. About / Vision Section */}
      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>01 / Vision & Craft</span>
            <h2 className={styles.title}>The Craft of Interfaces</h2>
          </div>
          <p className={styles.aboutText}>
            Passionate about web development and UI design, I create responsive, interactive, 
            and visually rich web applications. My focus lies at the intersection of robust programming 
            and aesthetic layout design—delivering digital spaces that feel alive, intuitive, and memorable. 
            I build to create experiences that are not just used, but felt.
          </p>
        </div>
      </section>

      {/* 2. Skills Section */}
      <section id="skills" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>02 / Capabilities</span>
            <h2 className={styles.title}>Technological Stack</h2>
          </div>
          <div className={styles.grid}>
            {skillsList.map((skill, idx) => (
              <div
                key={idx}
                className={`${styles.card} ${styles.skillCard} ${
                  skill.glow === "orange" ? styles.glowOrange : styles.glowBlue
                }`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.skillName}>{skill.name}</h3>
                  <span className={styles.skillLevel}>{skill.level}</span>
                </div>
                <p className={styles.skillType}>{skill.type}</p>
                <div className={styles.progressBarWrap}>
                  <div 
                    className={styles.progressBar} 
                    style={{ 
                      width: skill.level === "Advanced" ? "90%" : skill.level === "Intermediate" ? "75%" : "55%" 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Projects Section */}
      <section id="projects" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>03 / Creations</span>
            <h2 className={styles.title}>Selected Work</h2>
          </div>
          <div className={styles.grid}>
            {projectsList.map((proj, idx) => (
              <article
                key={idx}
                className={`${styles.card} ${styles.projectCard} ${
                  proj.glow === "orange" ? styles.glowOrange : styles.glowBlue
                }`}
              >
                <span className={styles.projectCategory}>{proj.category}</span>
                <h3 className={styles.projectTitle}>{proj.title}</h3>
                <p className={styles.projectDesc}>{proj.description}</p>
                
                <div className={styles.techTags}>
                  {proj.tech.map((t, tIdx) => (
                    <span key={tIdx} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>

                <a href={proj.link} className={styles.projectLink} aria-label={`View details of ${proj.title}`}>
                  <span>View Project</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Contact Section */}
      <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>04 / Collaboration</span>
            <h2 className={styles.title}>Start a Conversation</h2>
          </div>
          <div className={styles.contactContent}>
            <div className={styles.contactDetails}>
              <p className={styles.contactPrompt}>
                Have an idea, project, or opportunity you want to collaborate on? Let's build something exceptional.
              </p>
              <div className={styles.contactLinks}>
                <a href="mailto:chaurasiasatyam05@gmail.com" className={styles.contactLinkItem}>
                  <span className={styles.linkIcon}>✉</span>
                  <span>chaurasiasatyam05@gmail.com</span>
                </a>
                <a href="https://github.com/Satyam2307" target="_blank" rel="noopener noreferrer" className={styles.contactLinkItem}>
                  <span className={styles.linkIcon}>✦</span>
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/satyam-chaurasia-6021b23aa/" target="_blank" rel="noopener noreferrer" className={styles.contactLinkItem}>
                  <span className={styles.linkIcon}>Linked</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" required placeholder="Satyam Chaurasia" />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" required placeholder="you@example.com" />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" required placeholder="Let's build a cinematic project..."></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                <span>Send Message</span>
                <span className={styles.btnArrow}>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Satyam Chaurasia. All rights reserved.</p>
        <p className={styles.footerSub}>Designed with Apple-level simplicity & cinematic aesthetics.</p>
      </footer>
    </div>
  );
}
