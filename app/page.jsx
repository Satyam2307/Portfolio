import VideoIntro from "../components/VideoIntro";
import PortfolioSections from "../components/PortfolioSections";
import SpideyWidgets from "../components/SpideyWidgets";
import WebShooterCursor from "../components/WebShooterCursor";

export default function Page() {
  return (
    <main>
      <WebShooterCursor />
      <SpideyWidgets />
      <VideoIntro
        videoSrc="/videos/portfolio_video.mp4"
        role="Aspiring Full-Stack Software Engineer"
        skills={["Full-Stack Dev", "MERN Stack", "Next.js", "TypeScript", "Java (DSA)"]}
        firstName="Satyam"
        lastName="Chaurasia"
        nextSectionId="about"
      />

      <PortfolioSections />
    </main>
  );
}
