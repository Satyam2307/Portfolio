"use client";

import { useEffect, useState } from "react";
import styles from "./LiveStatusBadge.module.css";

export default function LiveStatusBadge() {
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setIstTime(formatted);
      } catch (e) {
        // Fallback
        const now = new Date();
        setIstTime(now.toTimeString().slice(0, 8));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statusWrap} aria-label="Recruiter availability and local time">
      <div className={styles.availGroup}>
        <span className={styles.pulseDot} aria-hidden="true" />
        <span className={styles.availText}>Open to Work & Internships</span>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.clockGroup}>
        <span className={styles.clockIcon} aria-hidden="true">📍</span>
        <span>India (IST)</span>
        {istTime && <span className={styles.timeDigits}>{istTime}</span>}
      </div>
    </div>
  );
}
