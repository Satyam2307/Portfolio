"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import CinematicLayer from "./CinematicLayer";
import styles from "./VideoIntro.module.css";

/* ---------- Inline icon set ---------- */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export default function VideoIntro({
  videoSrc = "/videos/portfolio_video.mp4",
  firstName = "Satyam",
  lastName = "Chaurasia",
  role = "Aspiring Software Engineer",
  skills = ["Java", "C", "Python", "HTML", "CSS", "JavaScript"],
  githubUrl = "https://github.com/Satyam2307",
  nextSectionId = "about",
  projectsSectionId = "projects",
}) {
  const fgVideoRef = useRef(null);
  const rootRef = useRef(null);

  const heroRef = useRef(null);
  const nameLine1Ref = useRef(null);
  const nameLine2Ref = useRef(null);
  const roleRef = useRef(null);
  const pillsRef = useRef(null);
  const actionsRef = useRef(null);
  const videoWrapRef = useRef(null);
  const controlsRef = useRef(null);
  const soundHintRef = useRef(null);
  const scrollRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHint, setShowHint] = useState(true);

  /* ---------- Entrance animation ---------- */
  useEffect(() => {
    const fg = fgVideoRef.current;
    if (fg) {
      fg.play().catch(() => {});
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    // Make the hero container visible first
    gsap.set(heroRef.current, { opacity: 1 });

    tl.fromTo(
      [nameLine1Ref.current, nameLine2Ref.current],
      { opacity: 0, y: 50, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15 },
      0.2
    )
      .fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      )
      .fromTo(
        pillsRef.current ? pillsRef.current.children : [],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.2)" },
        0.9
      )
      .fromTo(
        actionsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      )
      .fromTo(
        videoWrapRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.4 },
        0.5
      )
      .fromTo(
        controlsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.4
      )
      .fromTo(
        soundHintRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.5
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.8
      );

    // Auto-hide sound hint
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5500);

    return () => {
      tl.kill();
      clearTimeout(timer);
    };
  }, []);

  /* ---------- Actions ---------- */
  const togglePlay = useCallback(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    if (fg.paused) {
      fg.play().catch(() => {});
      setIsPlaying(true);
    } else {
      fg.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    const next = !fg.muted;
    fg.muted = next;
    setIsMuted(next);
    setShowHint(false);
  }, []);

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section ref={rootRef} className={styles.stickyWrap} aria-label="Intro">
      <div ref={heroRef} className={styles.hero}>
        {/* Glow lights */}
        <div className={styles.bgWarm} aria-hidden="true" />
        <div className={styles.bgMonitor} aria-hidden="true" />

        {/* Ambient Bokeh Particle Canvas */}
        <div className={styles.particleLayer}>
          <CinematicLayer particleCount={110} />
        </div>

        {/* Left Column: Copy & Actions */}
        <div className={styles.left}>
          <h1 className={styles.name}>
            <span className={styles.lineMask}>
              <span ref={nameLine1Ref} className={styles.lineFirst}>
                {firstName}
              </span>
            </span>
            <span className={styles.lineMask}>
              <span ref={nameLine2Ref} className={styles.lineLast}>
                {lastName}
              </span>
            </span>
          </h1>

          <p ref={roleRef} className={styles.role}>
            {role}
          </p>

          <ul ref={pillsRef} className={styles.pills}>
            {skills.map((skill, idx) => (
              <li key={idx} className={styles.pill}>
                {skill}
              </li>
            ))}
          </ul>

          <div ref={actionsRef} className={styles.actions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollToSection(projectsSectionId)}
            >
              View Projects
            </button>
            <a
              className={styles.btnGhost}
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style={{ marginLeft: "5px" }}>
                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Framed Video */}
        <div className={styles.right}>
          <div ref={videoWrapRef} className={styles.videoWrap}>
            <video
              ref={fgVideoRef}
              className={styles.fgVideo}
              src={videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
            />
            {/* Visual Overlays */}
            <div className={styles.videoFade} aria-hidden="true" />
            <div className={styles.videoGrain} aria-hidden="true" />

            {/* In-Frame video controls */}
            <div ref={controlsRef} className={styles.controls}>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <MutedIcon /> : <UnmutedIcon />}
              </button>
            </div>

            {/* Floating Hint */}
            <button
              ref={soundHintRef}
              type="button"
              onClick={toggleMute}
              className={`${styles.soundHint} ${showHint ? styles.soundHintShow : ""}`}
              aria-hidden={!showHint}
              tabIndex={0}
            >
              <span className={styles.soundHintDot} />
              Tap for sound
            </button>
          </div>
        </div>

        {/* Center Scroll Indicator */}
        <button
          ref={scrollRef}
          type="button"
          className={styles.scroll}
          onClick={() => scrollToSection(nextSectionId)}
          aria-label="Scroll to next section"
        >
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine}>
            <span className={styles.scrollPulse} />
          </span>
        </button>
      </div>
    </section>
  );
}
