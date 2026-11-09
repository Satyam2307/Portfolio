"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import GithubProofOfWork from "./GithubProofOfWork";
import LiveStatusBadge from "./LiveStatusBadge";
import styles from "./PortfolioSections.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioSections() {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle");
  const [toastMessage, setToastMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("chaurasiasatyam05@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("submitting");
    setToastMessage("");

    // Automatically construct formatted WhatsApp message and open chat
    const formattedMsg = `Hi Satyam!%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}${formData.phone ? `%0A*Phone:* ${encodeURIComponent(formData.phone)}` : ""}%0A%0A*Message:*%0A${encodeURIComponent(formData.message)}`;
    const whatsappUrl = `https://wa.me/918251048701?text=${formattedMsg}`;

    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deliver message.");

      setFormStatus("success");
      setToastMessage("Opening WhatsApp & saved message!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.warn("Contact form submit error:", err);
      // Since WhatsApp was launched, still provide successful feedback
      setFormStatus("success");
      setToastMessage("Opening WhatsApp chat...");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`);

      // 1. Entrance fade animations for inner content
      cards.forEach((card) => {
        const eyebrow = card.querySelector(`.${styles.eyebrow}`);
        const title = card.querySelector(`.${styles.title}`);
        const innerContent = card.querySelector(`.${styles.lead}, .${styles.skillGrid}, .${styles.projList}, .${styles.contactGrid}, div[class*="proofWrap"]`);

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
      title: "Wanderlust",
      category: "Full-Stack Web Application",
      period: "MERN Stack",
      description: "A full-stack Airbnb-inspired travel listings platform built with the MERN stack. Features user authentication, CRUD operations for property listings, interactive maps, image uploads, reviews and ratings system, and responsive design. Implements MVC architecture with RESTful APIs, server-side rendering, and MongoDB database management.",
      tech: ["Node.js", "Express.js", "MongoDB", "EJS", "Cloudinary", "Mapbox", "Passport.js", "REST APIs"],
      link: "https://github.com/Satyam2307/Wanderlust",
      liveUrl: "https://wanderlust-7e2w.onrender.com/listings",
    },
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
      title: "GuestVerify",
      category: "Identity Verification & Guest Management",
      period: "Amazon Developer Hackathon",
      description: "Built for the Build, Ship, Shape: Amazon Developer Hackathon — a guest identity verification platform that streamlines the check-in and verification process. Features automated guest verification workflows, secure identity validation, and a polished user interface for managing guest access and authentication in real time.",
      tech: ["Next.js & React", "TypeScript", "Tailwind CSS", "Vercel", "Authentication APIs", "Responsive UI"],
      link: "https://github.com/Satyam2307/GuestVerify",
      liveUrl: "https://guest-verify-azure.vercel.app/",
    },
    {
      title: "MicroSplit AI",
      category: "AI-Powered Expense Management",
      period: "PayPal AI Hackathon",
      description: "Built for the PayPal AI Hackathon — an intelligent expense splitting application that leverages AI to automate receipt parsing, smart expense categorization, and fair cost distribution among groups. Features AI-driven bill analysis, real-time split calculations, and an intuitive interface for managing shared expenses seamlessly.",
      tech: ["Next.js & React", "TypeScript", "AI/ML Integration", "Tailwind CSS", "Vercel", "Payment APIs"],
      link: "https://github.com/Satyam2307/MicroSplit-AI",
      liveUrl: "https://microsplit-ai.vercel.app/",
    },
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
  ];

  return (
    <div id="work" ref={containerRef} className={styles.wrap}>
      <div className={styles.inner}>
        
        {/* Card 01: About — Profile */}
        <section className={styles.card} id="about">
          <span className={styles.cardNum} aria-hidden="true">01</span>
          <p className={styles.eyebrow}>About — Profile</p>
          <h2 className={styles.title}>Who I Am</h2>
          <div className={styles.lead}>
            <p>
              I'm a second-year B.Tech student at{" "}
              <span className={styles.hot}>SGSITS, Indore</span> (Electronics & Instrumentation) and an aspiring{" "}
              <span className={styles.hot}>Full-Stack Software Engineer</span>. Driven by deep curiosity for software architecture and modern web systems, I enjoy transforming ideas into functional, scalable products.
            </p>
            <p>
              My development journey is centered around the{" "}
              <span className={styles.hot}>MERN stack and modern web technologies</span>. I build complete end-to-end applications across frontend interfaces, backend services, RESTful APIs, and database design — through projects like <strong>Wanderlust</strong> and <strong>MicroSplit AI</strong>.
            </p>
            <p>
              Alongside engineering full-stack applications and experimenting in AI hackathons, I continuously strengthen my problem-solving core through{" "}
              <span className={styles.hot}>Data Structures and Algorithms in Java</span>, focusing on writing clean, efficient, and well-architected code.
            </p>
          </div>
          <ul className={styles.pills}>
            <li className={styles.pill}>Full-Stack Developer</li>
            <li className={styles.pill}>MERN Stack</li>
            <li className={styles.pill}>DSA in Java</li>
            <li className={styles.pill}>AI Hackathons</li>
            <li className={styles.pill}>SGSITS Indore</li>
          </ul>
        </section>

        {/* Card 02: Skills — Stack */}
        <section className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">02</span>
          <p className={styles.eyebrow}>Skills — Stack</p>
          <h2 className={styles.title}>Technical Skills</h2>
          <div className={styles.skillGrid}>
            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Languages & Core</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>JavaScript (ES6+)</li>
                <li className={styles.pill}>TypeScript</li>
                <li className={styles.pill}>Java (DSA)</li>
                <li className={styles.pill}>Python</li>
                <li className={styles.pill}>C Language</li>
              </ul>
            </div>
            
            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Frontend & UI</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>React.js</li>
                <li className={styles.pill}>Next.js</li>
                <li className={styles.pill}>Tailwind CSS</li>
                <li className={styles.pill}>HTML5 & CSS3</li>
                <li className={styles.pill}>Modern Flexbox / Grid</li>
                <li className={styles.pill}>GSAP & Animations</li>
              </ul>
            </div>

            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Backend & APIs</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>Node.js</li>
                <li className={styles.pill}>Express.js</li>
                <li className={styles.pill}>FastAPI (Python)</li>
                <li className={styles.pill}>RESTful APIs</li>
                <li className={styles.pill}>Authentication & Passport.js</li>
              </ul>
            </div>

            <div className={styles.skillGroup}>
              <p className={styles.skillLabel}>Databases & Cloud Tools</p>
              <ul className={styles.pills}>
                <li className={styles.pill}>MongoDB</li>
                <li className={styles.pill}>PostgreSQL & PostGIS</li>
                <li className={styles.pill}>Git & GitHub</li>
                <li className={styles.pill}>Vercel & Render</li>
                <li className={styles.pill}>Mapbox & Cloudinary</li>
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

        {/* Card 05: Proof of Work — GitHub Activity */}
        <section id="proof-of-work" className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">05</span>
          <p className={styles.eyebrow}>Activity — Open Source</p>
          <h2 className={styles.title}>Proof of Work</h2>
          <GithubProofOfWork />
        </section>

        {/* Card 06: Contact — Conversation */}
        <section id="contact" className={styles.card}>
          <span className={styles.cardNum} aria-hidden="true">06</span>
          <p className={styles.eyebrow}>Collaboration — Reach Out</p>
          <h2 className={styles.title}>Start a Conversation</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactDetails}>
              <LiveStatusBadge />
              <p className={styles.contactPrompt}>
                Have an idea, project, or opportunity you want to collaborate on? Let's build something exceptional.
              </p>
              <div className={styles.contactLinks}>
                <a
                  href="https://wa.me/918251048701?text=Hi%20Satyam%2C%20I%20came%20across%20your%20portfolio%20and%20wanted%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactLinkItem} ${styles.whatsappLink}`}
                >
                  <span className={styles.whatsappIcon}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.33 7.33 9 7.41 8.73 7.7C8.46 8 7.7 8.71 7.7 10.16C7.7 11.61 8.76 13 8.91 13.2C9.06 13.41 10.95 16.33 13.85 17.58C14.54 17.88 15.07 18.05 15.49 18.19C16.18 18.41 16.81 18.38 17.31 18.3C17.87 18.22 19.02 17.6 19.26 16.94C19.5 16.27 19.5 15.7 19.43 15.58C19.36 15.46 19.16 15.39 18.86 15.24C18.56 15.09 17.11 14.38 16.84 14.28C16.57 14.18 16.38 14.13 16.18 14.43C15.98 14.73 15.42 15.39 15.25 15.58C15.08 15.77 14.91 15.8 14.61 15.65C14.31 15.5 13.36 15.19 12.23 14.18C11.35 13.39 10.76 12.42 10.59 12.13C10.42 11.83 10.57 11.67 10.72 11.53C10.86 11.39 11.03 11.16 11.18 10.99C11.33 10.82 11.38 10.69 11.48 10.49C11.58 10.29 11.53 10.12 11.46 9.97C11.38 9.82 10.8 8.38 10.56 7.8C10.33 7.23 10.09 7.31 9.91 7.32C9.75 7.33 9.55 7.33 9.35 7.33" />
                    </svg>
                  </span>
                  <span>Connect on WhatsApp</span>
                </a>
                <a href="mailto:chaurasiasatyam05@gmail.com" className={styles.contactLinkItem}>
                  <span className={styles.linkIcon}>✉</span>
                  <span>chaurasiasatyam05@gmail.com</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={styles.copyEmailBtn}
                  aria-label="Copy email address"
                >
                  <span>{copiedEmail ? "✓ Copied to Clipboard!" : "📋 Copy Email"}</span>
                </button>
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

            <form className={styles.contactForm} onSubmit={handleContactSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Satyam Chaurasia"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={formStatus === "submitting"}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={formStatus === "submitting"}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your contact number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={formStatus === "submitting"}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  required
                  placeholder="Let's build something exceptional..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={formStatus === "submitting"}
                />
              </div>
              <button
                type="submit"
                className={`${styles.submitBtn} ${styles.whatsappSubmitBtn}`}
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? (
                  <>
                    <span className={styles.submitSpinner} aria-hidden="true" />
                    <span>Connecting on WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.33 7.33 9 7.41 8.73 7.7C8.46 8 7.7 8.71 7.7 10.16C7.7 11.61 8.76 13 8.91 13.2C9.06 13.41 10.95 16.33 13.85 17.58C14.54 17.88 15.07 18.05 15.49 18.19C16.18 18.41 16.81 18.38 17.31 18.3C17.87 18.22 19.02 17.6 19.26 16.94C19.5 16.27 19.5 15.7 19.43 15.58C19.36 15.46 19.16 15.39 18.86 15.24C18.56 15.09 17.11 14.38 16.84 14.28C16.57 14.18 16.38 14.13 16.18 14.43C15.98 14.73 15.42 15.39 15.25 15.58C15.08 15.77 14.91 15.8 14.61 15.65C14.31 15.5 13.36 15.19 12.23 14.18C11.35 13.39 10.76 12.42 10.59 12.13C10.42 11.83 10.57 11.67 10.72 11.53C10.86 11.39 11.03 11.16 11.18 10.99C11.33 10.82 11.38 10.69 11.48 10.49C11.58 10.29 11.53 10.12 11.46 9.97C11.38 9.82 10.8 8.38 10.56 7.8C10.33 7.23 10.09 7.31 9.91 7.32C9.75 7.33 9.55 7.33 9.35 7.33" />
                    </svg>
                    <span>Connect on WhatsApp</span>
                    <span className={styles.btnArrow}>→</span>
                  </>
                )}
              </button>

              {formStatus === "success" && (
                <div className={styles.toastSuccess} role="status">
                  <span aria-hidden="true">✓</span>
                  <span>{toastMessage}</span>
                </div>
              )}

              {formStatus === "error" && (
                <div className={styles.toastError} role="alert">
                  <span>{toastMessage}</span>
                  <a
                    href={`mailto:chaurasiasatyam05@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(
                      formData.name || "Visitor"
                    )}&body=${encodeURIComponent(
                      (formData.phone ? `Phone: ${formData.phone}\n\n` : "") + (formData.message || "")
                    )}`}
                    className={styles.errorAction}
                  >
                    Send directly via your email app →
                  </a>
                </div>
              )}
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
