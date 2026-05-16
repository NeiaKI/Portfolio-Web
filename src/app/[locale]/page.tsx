import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { EducationSection } from "@/components/home/education-section";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { GitHubContributions } from "@/components/widgets/github-contributions";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
        <HeroSection />
        <AboutSection />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WeatherWidget />
          <GitHubContributions />
        </div>
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
      </div>
    </MainLayout>
  );
}
