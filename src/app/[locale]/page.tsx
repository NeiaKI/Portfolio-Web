import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { EducationSection } from "@/components/home/education-section";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { CodingProgress } from "@/components/widgets/coding-progress";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <HeroSection />
          <AboutSection />
        </div>
        <SkillsSection />
        <CodingProgress />
        <ExperienceSection />
        <EducationSection />
      </div>
    </MainLayout>
  );
}
