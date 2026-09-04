"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SpideyWidgets.module.css";

export default function SpideyWidgets() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTugged, setIsTugged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ripples, setRipples] = useState([]);
  const audioRef = useRef(null);

  // Monitor scroll position to hide both Spider-Mans on the introduction page
  // and only show them once the user scrolls down to the cards section
  useEffect(() => {
    const checkVisibility = () => {
      const workSection = document.getElementById("work") || document.getElementById("about");
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.75);
      } else {
        setIsVisible(window.scrollY > window.innerHeight * 0.6);
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  // 1. Hanging Spider-Man Tug Handler
  const handleTug = () => {
    if (isTugged) return;
    setIsTugged(true);
    
    // Add ripple effect
    const rippleId = Date.now();
    setRipples((prev) => [...prev, rippleId]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((id) => id !== rippleId));
    }, 700);

    setTimeout(() => {
      setIsTugged(false);
    }, 750);
  };

  // 2. Headphone Spider-Man Audio Toggle Handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio playback blocked by browser policy:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      {/* Hidden Lo-Fi Audio Track */}
      <audio
        ref={audioRef}
        src="/track.mp3"
        loop
        preload="none"
        onEnded={() => setIsPlaying(false)}
      />

      {/* 🕷 1. Hanging Spider-Man from Top Right Ceiling */}
      <button
        type="button"
        className={`${styles.lamp} ${isVisible ? styles.lampVisible : ""} ${isTugged ? styles.tugged : ""}`}
        onClick={handleTug}
        aria-label="Tug hanging Spider-Man"
        title="Tug Spider-Man"
        tabIndex={isVisible ? 0 : -1}
      >
        <span className={styles.strand} aria-hidden="true">
          <span className={styles.web} />
          <img
            className={styles.spidey}
            src="/spidey.png"
            alt="Spider-Man hanging upside down"
          />
        </span>
        <span className={styles.lampHint}>tug me</span>
        {ripples.map((id) => (
          <span key={id} className={styles.webRipple} />
        ))}
      </button>

      {/* 🎧 2. Headphone Spider-Man Mask Music Player (Bottom Left) */}
      <button
        type="button"
        className={`${styles.sound} ${isVisible ? styles.soundVisible : ""} ${isPlaying ? styles.soundActive : ""}`}
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause chill music" : "Play chill music"}
        title={isPlaying ? "Pause music" : "Play music"}
        tabIndex={isVisible ? 0 : -1}
      >
        <div className={styles.soundWaves} aria-hidden="true" />
        <img
          className={styles.face}
          src="/listener.png"
          alt="Spider-Man mask with headphones listening to music"
        />
        <span className={styles.soundHint}>
          {isPlaying ? "pause lo-fi ⏸" : "play lo-fi ♫"}
        </span>
      </button>
    </>
  );
}
