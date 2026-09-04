"use client";

import { useEffect, useState } from "react";
import styles from "./GithubProofOfWork.module.css";

const GITHUB_USERNAME = "Satyam2307";

export default function GithubProofOfWork() {
  const [contribData, setContribData] = useState(null);
  const [totalCount, setTotalCount] = useState("200+");
  const [monthLabels, setMonthLabels] = useState([]);
  const [gridCells, setGridCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        );
        if (!res.ok) throw new Error("Failed to fetch GitHub contributions");
        const data = await res.json();
        
        if (!isMounted) return;

        const days = data.contributions || [];
        setTotalCount(`${data.total?.lastYear?.toLocaleString() || "200+"} commits & contributions`);

        // Compute starting Sunday offset
        const CELL_WIDTH = 15.5; // cell width + gap
        const firstDate = new Date(days[0]?.date + "T00:00:00");
        const offset = firstDate.getDay();

        const cells = [];
        // Pad days for first week alignment
        for (let i = 0; i < offset; i++) {
          cells.push({ pad: true, key: `pad-${i}` });
        }

        const computedMonths = [];
        let lastMonth = -1;

        days.forEach((d, idx) => {
          cells.push({
            pad: false,
            key: d.date,
            date: d.date,
            count: d.count,
            level: d.level || 0,
          });

          // Compute month positions
          const dateObj = new Date(d.date + "T00:00:00");
          if (dateObj.getMonth() !== lastMonth && dateObj.getDate() <= 7) {
            lastMonth = dateObj.getMonth();
            const weekIndex = Math.floor((idx + offset) / 7);
            computedMonths.push({
              name: dateObj.toLocaleString("en", { month: "short" }).toLowerCase(),
              left: weekIndex * CELL_WIDTH,
            });
          }
        });

        setGridCells(cells);
        setMonthLabels(computedMonths);
        setContribData(data);
        setIsLoading(false);
      } catch (err) {
        console.warn("GitHub contributions API fallback:", err);
        // Fallback placeholder grid
        if (isMounted) {
          generateFallbackGrid();
          setIsLoading(false);
        }
      }
    }

    function generateFallbackGrid() {
      const cells = [];
      for (let i = 0; i < 364; i++) {
        cells.push({
          pad: false,
          key: `fallback-${i}`,
          count: (i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : 0),
          level: (i % 7 === 0 ? 3 : i % 4 === 0 ? 2 : i % 2 === 0 ? 1 : 0),
        });
      }
      setGridCells(cells);
      setTotalCount("200+ commits in the last year");
    }

    loadContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.proofWrap}>
      {/* Header bar */}
      <div className={styles.proofHeader}>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.proofUser}
        >
          <span>@{GITHUB_USERNAME}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </a>

        <div className={styles.proofStatsSummary}>
          {totalCount}
        </div>
      </div>

      {/* 52-Week GitHub Heatmap Grid */}
      <div className={styles.gridContainer}>
        {/* Months Bar */}
        <div className={styles.monthLabels}>
          {monthLabels.map((m, idx) => (
            <span
              key={idx}
              className={styles.monthLabel}
              style={{ left: `${m.left}px` }}
            >
              {m.name}
            </span>
          ))}
        </div>

        {/* Contribution Days Grid */}
        <div className={styles.grid} role="img" aria-label="GitHub contribution activity grid">
          {gridCells.map((cell) => {
            if (cell.pad) {
              return <i key={cell.key} style={{ visibility: "hidden" }} />;
            }
            return (
              <i
                key={cell.key}
                className={`${styles.cell} ${styles[`level${cell.level}`]}`}
                title={cell.date ? `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${cell.date}` : "Activity"}
              />
            );
          })}
        </div>

        {/* Footer & Legend */}
        <div className={styles.gridFoot}>
          <div className={styles.liveNote}>
            <span className={styles.liveDot} />
            <span>Live GitHub Sync · Verified Contributions</span>
          </div>

          <div className={styles.legend}>
            <span className={styles.legendLabel}>Less</span>
            <i className={`${styles.cell} ${styles.legendCell} ${styles.level0}`} />
            <i className={`${styles.cell} ${styles.legendCell} ${styles.level1}`} />
            <i className={`${styles.cell} ${styles.legendCell} ${styles.level2}`} />
            <i className={`${styles.cell} ${styles.legendCell} ${styles.level3}`} />
            <i className={`${styles.cell} ${styles.legendCell} ${styles.level4}`} />
            <span className={styles.legendLabel}>More</span>
          </div>
        </div>
      </div>

      {/* Proof of Work Metric Highlights */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statVal}>200+</p>
          <p className={styles.statTitle}>Yearly GitHub Commits</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statVal}>18+</p>
          <p className={styles.statTitle}>Public Repositories</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statVal}>4</p>
          <p className={styles.statTitle}>Hackathon Builds Shipped</p>
        </div>
      </div>
    </div>
  );
}
