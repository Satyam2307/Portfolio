import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://satyamchaurasia.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Satyam Chaurasia | Full-Stack Software Engineer & MERN Developer",
    template: "%s | Satyam Chaurasia",
  },
  description:
    "Portfolio of Satyam Chaurasia — Full-Stack Software Engineer pursuing B.Tech at SGSITS Indore. Building modern, end-to-end web applications with MERN Stack, Next.js, Java DSA, and AI solutions.",
  keywords: [
    "Satyam Chaurasia",
    "Full-Stack Developer",
    "Software Engineer",
    "MERN Stack",
    "Next.js",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Java DSA",
    "SGSITS Indore",
    "Portfolio",
  ],
  authors: [{ name: "Satyam Chaurasia", url: "https://github.com/Satyam2307" }],
  creator: "Satyam Chaurasia",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Satyam Chaurasia | Full-Stack Software Engineer",
    description:
      "Explore full-stack projects, hackathon builds (MicroSplit AI, GuestVerify, Wanderlust), and open-source software engineering by Satyam Chaurasia.",
    url: SITE_URL,
    siteName: "Satyam Chaurasia Portfolio",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Satyam Chaurasia — Full-Stack Software Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satyam Chaurasia | Full-Stack Software Engineer",
    description:
      "Full-Stack MERN Developer & B.Tech student at SGSITS Indore. Explore Wanderlust, MicroSplit AI, and interactive web projects.",
    images: ["/og-preview.png"],
    creator: "@Satyam2307",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#07060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
