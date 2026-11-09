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
        tagline="Aspiring Full-Stack Software Engineer"
        firstName="Satyam"
        lastName="Chaurasia"
        subtitle={
          <>
            Passionate about <strong>full-stack development and modern web technologies</strong>. Building 
            end-to-end applications with the MERN stack, crafting everything from frontend interfaces 
            to backend systems and APIs.
          </>
        }
        nextSectionId="about"
      />

      <PortfolioSections />
    </main>
  );
}
