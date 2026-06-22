"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./PortfolioSections.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioSections() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Basic GSAP fade animations for elements inside cards when they enter viewport
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`);
      cards.forEach((card) => {
        const eyebrow = card.querySelector(`.${styles.eyebrow}`);
        const title = card.querySelector(`.${styles.title}`);
        const innerContent = card.querySelector(`.${styles.lead}, .${styles.skillGrid}, .${styles.projList}, .${styles.contactGrid}`);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
        if (title) tl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.45");
        if (innerContent) tl.fromTo(innerContent, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.45");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const projectsList = [
    {
      title: "Spotify Web Player UI Clone",
      category: "Frontend Clone",
      period: "Recent Project",
      description: "A pixel-perfect UI/UX recreation of the Spotify web player desktop experience. Designed to replicate the desktop player with custom media play controls, interactive side navigation libraries, and fluid layout responsiveness.",
      tech: ["HTML5", "CSS3 / Flexbox", "JavaScript", "Responsive Design"],
      link: "https://github.com/Satyam2307",
    },
    {
      title: "Sidebar Navigation Menu",
      category: "Component Design",
      period: "Recent Project",
      description: "An elegant, interactive navigation drawer with smooth state transitions. Leverages modern CSS variables, flexbox alignments, active-state indicator track tracking, and collapsed layouts for compact viewports.",
      tech: ["HTML5", "CSS Variables", "JavaScript", "Micro-interactions"],
      link: "https://github.com/Satyam2307",
    },
    {
      title: "Creative Storytelling Website",
      category: "Immersive Web Design",
      period: "Recent Project",
      description: "A narrative storytelling project built to engage users through scroll-driven flow layouts, custom graphics alignment, and cinematic visual transitions. Blends interactive reading with rich typography.",
      tech: ["HTML5", "CSS Keyframes", "JavaScript", "Creative Direction"],
      link: "https://github.com/Satyam2307",
    },
  ];

  return (
    <div id="work" ref={containerRef} className={styles.wrap}>
      <div className={styles.inner}>
        
        {/* Card 01: About — Profile */}
        <section className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">01</span>
          <p className={styles.eyebrow}>About — Profile</p>
          <h2 className={styles.title}>Who I Am</h2>
          <p className={styles.lead}>
            Aspiring Software Engineer passionate about <span className={styles.hot}>web development and UI design</span>. 
            I focus on bridging aesthetic visual layouts with high-performance interactive engineering. 
            I build responsive, clean user interfaces using C, Python, Java, and modern web standards. 
            My goal is to craft digital products that blend clean, structured code with immersive, polished user experiences.
          </p>
          <ul className={styles.pills}>
            <li className={styles.pill}>Software Engineer</li>
            <li className={styles.pill}>Frontend Dev</li>
            <li className={styles.pill}>UI Designer</li>
            <li className={styles.pill}>Creative Coder</li>
            <li className={styles.pill}>Problem Solver</li>
          </ul>
        </section>

        {/* Card 02: Skills — Stack */}
        <section className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">02</span>
          <p className={styles.eyebrow}>Skills — Stack</p>
          <h2 className={styles.title}>Technical Skills</h2>
          <div className={styles.skillGrid}>
            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Languages</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>Java</li>
                <li className={styles.pill}>C Language</li>
                <li className={styles.pill}>Python</li>
                <li className={styles.pill}>JavaScript</li>
              </ul>
            </div>
            
            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Web & Structure</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>HTML5</li>
                <li className={styles.pill}>CSS3</li>
                <li className={styles.pill}>ES6+ JavaScript</li>
              </ul>
            </div>

            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Styling & Animation</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>Modern Flexbox / Grid</li>
                <li className={styles.pill}>CSS Modules</li>
                <li className={styles.pill}>GSAP</li>
                <li className={styles.pill}>Transitions & Keyframes</li>
              </ul>
            </div>

            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Tools & Ecosystem</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>Git & GitHub</li>
                <li className={styles.pill}>VS Code</li>
                <li className={styles.pill}>npm / Node Package Manager</li>
                <li className={styles.pill}>Next.js / React</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Card 03: Work — Projects */}
        <section className={`${styles.card} ${styles.flow}`}>
          <span className={styles.cardNum} aria-hidden="true">03</span>
          <p className={styles.eyebrow}>Work — Projects</p>
          <h2 className={styles.title}>Projects</h2>
          
          <div className={styles.projList}>
            {projectsList.map((proj, idx) => (
              <div key={idx} className={styles.proj}>
                <div className={styles.projHead}>
                  <h3 className={styles.projCompany}>{proj.title}</h3>
                  <span className={styles.projPeriod}>{proj.period}</span>
                </div>
                <p className={styles.projRole}>{proj.category}</p>
                <ul className={styles.projItems}>
                  <li>{proj.description}</li>
                </ul>
                <ul className={styles.pills} style={{ marginTop: "1rem" }}>
                  {proj.tech.map((t, tIdx) => (
                    <li key={tIdx} className={styles.pill}>
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projLink}
                >
                  View on GitHub
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Card 04: Contact — Conversation */}
        <section id="contact" className={`${styles.card} ${styles.flow}`}>
          <span className={styles.cardNum} aria-hidden="true">04</span>
          <p className={styles.eyebrow}>Collaboration — Reach Out</p>
          <h2 className={styles.title}>Start a Conversation</h2>

          <div className={styles.contactGrid}>
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
        </section>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Satyam Chaurasia. All rights reserved.</p>
        <p className={styles.footerSub}>Designed with Apple-level simplicity & cinematic aesthetics.</p>
      </footer>
    </div>
  );
}
