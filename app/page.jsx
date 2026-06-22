import VideoIntro from "../components/VideoIntro";
import PortfolioSections from "../components/PortfolioSections";

export default function Page() {
  return (
    <main>
      <VideoIntro
        videoSrc="/videos/portfolio_video.mp4"
        tagline="Aspiring Software Engineer"
        firstName="Satyam"
        lastName="Chaurasia"
        subtitle={
          <>
            Passionate about <strong>web development and UI design</strong>. Crafting 
            interactive, responsive, and cinematic digital products that blend solid engineering 
            with visual aesthetics.
          </>
        }
        nextSectionId="about"
      />

      <PortfolioSections />
    </main>
  );
}
