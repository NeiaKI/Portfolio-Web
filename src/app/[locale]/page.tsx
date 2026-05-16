import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { EducationSection } from "@/components/home/education-section";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { SpotifyWidget } from "@/components/widgets/spotify-widget";
import { CodingProgress } from "@/components/widgets/coding-progress";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <HeroSection />
          <AboutSection />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WeatherWidget />
          <SpotifyWidget />
        </div>

        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <CodingProgress />
      </div>
    </MainLayout>
  );
}
