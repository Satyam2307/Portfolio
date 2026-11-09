import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "404 — Page Not Found | Satyam Chaurasia",
  description: "Looks like you swung into an unknown dimension. This page does not exist.",
};

export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.glitchCode} aria-hidden="true">
          404
        </div>
        <h1 className={styles.title}>Dimension Not Found</h1>
        <p className={styles.desc}>
          Looks like you swung off the web grid. The page you are looking for has been moved, renamed, or never existed in this multiverse.
        </p>
        <Link href="/" className={styles.homeBtn}>
          <span>← Back to Portfolio</span>
        </Link>
      </div>
    </main>
  );
}
