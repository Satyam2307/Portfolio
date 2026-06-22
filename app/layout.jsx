import "./globals.css";

export const metadata = {
  title: "Satyam Chaurasia — Aspiring Software Engineer",
  description:
    "Portfolio of Satyam Chaurasia, an Aspiring Software Engineer passionate about web development, UI design, and interactive coding. Featuring Spotify Web Player UI Clone, Sidebar Navigation Menu, and Creative Storytelling Website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Display + body fonts. Swap for self-hosted files via next/font/local
            if you prefer not to rely on Google Fonts at build time. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
