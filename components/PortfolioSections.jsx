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
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`);

      // 1. Entrance fade animations for inner content
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

      // 2. Stacking card pin transitions
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card doesn't need to pin
        const nextCard = cards[i + 1];

        ScrollTrigger.create({
          trigger: card,
          start: () => (card.offsetHeight > window.innerHeight ? "bottom bottom" : "top 8vh"),
          endTrigger: nextCard,
          end: "top 8vh",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const featuredProjects = [
    {
      title: "Spotify Web Player UI Clone",
      category: "Frontend Architecture & Media UI",
      period: "Web Audio UI",
      description: "A high-fidelity desktop web player recreation replicating Spotify's UI/UX. Features a custom audio playback bar, interactive volume and seekbar controls, responsive navigation drawer, and dynamic multi-column playlists.",
      tech: ["Semantic HTML5", "CSS3 Grid & Flexbox", "Audio Media UI", "Responsive Layouts"],
      link: "https://github.com/Satyam2307/Spotify-Web-Player-UI-Clone",
      liveUrl: "https://spotify-web-player-ui-clone.vercel.app/",
    },
    {
      title: "Sidebar Navigation Menu",
      category: "Component Design & Micro-interactions",
      period: "Interactive Component",
      description: "An elegant, accessible drawer navigation system with fluid state transitions. Engineered using CSS custom properties, icon alignment, active indicator tracking, and compact collapsible viewport states.",
      tech: ["HTML5", "CSS Custom Properties", "Modern Flexbox", "CSS Transitions & Keyframes"],
      link: "https://github.com/Satyam2307/Sidebar-Navigation-Menu",
      liveUrl: "https://sidebar-navigation-menu-nine.vercel.app/",
    },
    {
      title: "Simon Says Game",
      category: "Interactive Game Engineering",
      period: "Vanilla JS Game",
      description: "A faithful recreation of the classic Simon Says electronic memory game. Implements random sequence generation, progressive difficulty level scaling, audio cue feedback, DOM state management, and high-score tracking.",
      tech: ["JavaScript (ES6+)", "DOM Manipulation", "Web Audio API", "CSS Keyframe Animations", "Game State Machine"],
      link: "https://github.com/Satyam2307/Simon-Says-Game",
      liveUrl: "https://simon-says-game-pi-opal.vercel.app/",
    },
  ];

  const hackathonProjects = [
    {
      title: "GripLine",
      category: "AI Track-Condition Co-Pilot",
      period: "Grand Prix Hackathon",
      description: "Real-time track condition co-pilot for motorsport race engineers. Features zero-shot Hugging Face CLIP classification for wetness estimation, dynamic SVG corner hazard mapping, temporal trend analysis with exponential smoothing, pit window tire strategy recommendations, and automated voice radio synthesis via Web Speech API.",
      tech: ["FastAPI (Python)", "React 18 & TypeScript", "Hugging Face CLIP", "Vite", "Recharts", "Web Speech API"],
      link: "https://github.com/Satyam2307/GripLine",
      liveUrl: "https://grip-line.vercel.app/",
    },
    {
      title: "HeatShield: ShadeStop",
      category: "Climate Intelligence & Urban Analytics",
      period: "FortyGuard Hackathon",
      description: "Built for the FortyGuard Hackathon — a data-driven urban heat mitigation decision platform designed to protect transit riders. Integrates satellite thermal surface data, GTFS transit routes, and census vulnerability indexes into an interactive geospatial map to rank and prioritize bus stops for shade canopy installations with measurable before/after heat reduction projections.",
      tech: ["Next.js & React", "TypeScript", "Tailwind CSS", "FastAPI (Python)", "PostgreSQL & PostGIS", "MapLibre GL / GeoJSON"],
      link: "https://github.com/Satyam2307/HeatShield",
      liveUrl: "https://heat-shields.vercel.app/",
    },
    {
      title: "Bug Sniffer",
      category: "Developer Tooling & Static Analysis",
      period: "Ikigai Hackathon",
      description: "Built for the Ikigai Hackathon — a full-stack developer static auditing pipeline built to detect silent production bugs in GitHub repositories. Executes fast deterministic scans for zero-byte assets and malformed XML/JSON configs, integrated with Google Gemini 2.5 Flash / Groq LLMs for AI-driven root cause explanations and repository health indexing.",
      tech: ["React (Vite SPA)", "FastAPI (Python)", "Google Gemini API", "Groq (Llama-3)", "GitHub REST API", "Glassmorphic UI"],
      link: "https://github.com/Satyam2307/Bug-Sniffer",
      liveUrl: "https://bug-sniffer.vercel.app/",
    },
    {
      title: "Voyage Within",
      category: "Immersive 3D Storytelling",
      period: "Frontend Odyssey Challenge",
      description: "Created for the Frontend Odyssey Vibe Coding Interactive Challenge — an Awwwards-inspired interactive web storytelling experience turning static scrolling into an immersive visual voyage. Built with custom 3D spatial scenes, GSAP ScrollTrigger timeline transitions, layered glassmorphism, and reactive theme exploration.",
      tech: ["JavaScript (ES6+)", "Three.js (3D Scenes)", "GSAP & ScrollTrigger", "HTML5 / CSS3", "Glassmorphism UI"],
      link: "https://github.com/Satyam2307/voyage-within",
      liveUrl: "https://voyage-within.vercel.app/",
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
        <section className={styles.card} id="projects">
          <span className={styles.cardNum} aria-hidden="true">03</span>
          <p className={styles.eyebrow}>Work — Featured Projects</p>
          <h2 className={styles.title}>Projects</h2>
          
          <div className={styles.projList}>
            {featuredProjects.map((proj, idx) => (
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
                <div className={styles.projLinkGroup}>
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
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projLinkLive}
                    >
                      Live Demo
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 04: Innovation — Hackathon Builds */}
        <section className={styles.card} id="hackathons">
          <span className={styles.cardNum} aria-hidden="true">04</span>
          <p className={styles.eyebrow}>Innovation — Hackathon Builds</p>
          <h2 className={styles.title}>Hackathon Builds</h2>
          
          <div className={styles.projList}>
            {hackathonProjects.map((proj, idx) => (
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
                <div className={styles.projLinkGroup}>
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
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projLinkLive}
                    >
                      Live Demo
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 05: Contact — Conversation */}
        <section id="contact" className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">05</span>
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
