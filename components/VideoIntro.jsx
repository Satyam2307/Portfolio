"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import CinematicLayer from "./CinematicLayer";
import styles from "./VideoIntro.module.css";

/* ---------- Inline icon set (no external icon dependency) ---------- */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4z"
        fill="currentColor"
      />
      <path
        d="M16.5 9 21 13.5M21 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4z" fill="currentColor" />
      <path
        d="M15.8 8.3a4.6 4.6 0 0 1 0 7.4M18 6.2a7.6 7.6 0 0 1 0 11.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * VideoIntro
 * Fullscreen cinematic hero: a blurred ambient duplicate of the source
 * video sits behind a sharp foreground copy, layered with gradient
 * overlays, a Three.js bokeh layer, and animated portfolio content.
 *
 * Props:
 *  - videoSrc: path to the talking-head video (required)
 *  - tagline, firstName, lastName, subtitle: copy
 *  - nextSectionId: id of the section to scroll to on indicator click
 */
export default function VideoIntro({
  videoSrc = "/videos/portfolio_video.mp4",
  tagline = "Creative Developer & Digital Storyteller",
  firstName = "Satyam",
  lastName = "Chaurasia",
  subtitle = (
    <>
      I design and build <strong>cinematic, AI-assisted digital experiences</strong>{" "}
      — blending interface engineering with motion, narrative, and craft.
    </>
  ),
  nextSectionId = "next-section",
}) {
  const fgVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const rootRef = useRef(null);

  const taglineRef = useRef(null);
  const nameLine1Ref = useRef(null);
  const nameLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const controlsRef = useRef(null);
  const scrollRef = useRef(null);
  const soundHintRef = useRef(null);
  const fgWrapRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  /* ---------- Entrance animation (GSAP timeline) ---------- */
  useEffect(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;

    // Try to autoplay both layers in sync.
    [fg, bg].forEach((v) => {
      if (v) {
        v.play().catch(() => {
          // Autoplay may be blocked until user interaction; controls
          // still reflect intended state and a tap will resume playback.
        });
      }
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.to(fgWrapRef.current, { opacity: 1, duration: 1.4, ease: "power2.out" })
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.35
      )
      .fromTo(
        nameLine1Ref.current,
        { opacity: 0, y: 46, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
        0.5
      )
      .fromTo(
        nameLine2Ref.current,
        { opacity: 0, y: 46, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
        0.65
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.95
      )
      .fromTo(
        controlsRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.1
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.25
      )
      .fromTo(
        soundHintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.3
      );

    // Auto-hide the "tap for sound" hint after a few seconds.
    const hideHint = gsap.to(soundHintRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.6,
      delay: 4.5,
      ease: "power2.in",
    });

    return () => {
      tl.kill();
      hideHint.kill();
    };
  }, []);

  /* ---------- Controls ---------- */

  const togglePlay = useCallback(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg) return;

    if (fg.paused) {
      fg.play().catch(() => {});
      bg?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      fg.pause();
      bg?.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    const next = !fg.muted;
    fg.muted = next;
    setIsMuted(next);

    // Dismiss the sound hint as soon as the person interacts with sound.
    gsap.to(soundHintRef.current, { opacity: 0, duration: 0.4 });
  }, []);

  const scrollToNext = useCallback(() => {
    const target = document.getElementById(nextSectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }, [nextSectionId]);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Intro">
      {/* Ambient blurred background video */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* Sharp foreground video */}
      <div ref={fgWrapRef} className={styles.fgVideoWrap}>
        <video
          ref={fgVideoRef}
          className={styles.fgVideo}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          aria-label="Portfolio introduction video"
        />
      </div>

      {/* Cinematic gradient + glow overlays */}
      <div className={styles.overlayGradientSide} />
      <div className={styles.overlayGradientBottom} />
      <div className={styles.overlayVignette} />
      <div className={`${styles.glow} ${styles.glowOrange}`} />
      <div className={`${styles.glow} ${styles.glowBlue}`} />

      {/* Three.js bokeh / particle layer */}
      <div className={styles.particleLayer}>
        <CinematicLayer particleCount={130} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p ref={taglineRef} className={styles.tagline}>
          {tagline}
        </p>

        <div className={styles.nameBlock}>
          <h1 ref={nameLine1Ref} className={styles.nameLine}>
            <span>{firstName}</span>
          </h1>
          <h1 ref={nameLine2Ref} className={styles.nameLine}>
            <span>{lastName}</span>
          </h1>
        </div>

        <p ref={subtitleRef} className={styles.subtitle}>
          {subtitle}
        </p>
      </div>

      {/* Sound hint badge */}
      <div ref={soundHintRef} className={styles.soundHint}>
        <span className={styles.soundHintDot} />
        Tap for sound
      </div>

      {/* Glassmorphism controls */}
      <div ref={controlsRef} className={styles.controls}>
        <button
          type="button"
          className={styles.glassButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className={styles.glassButton}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <MutedIcon /> : <UnmutedIcon />}
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        ref={scrollRef}
        type="button"
        className={styles.scrollIndicator}
        onClick={scrollToNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollTrack}>
          <span className={styles.scrollPulse} />
        </span>
      </button>
    </section>
  );
}
