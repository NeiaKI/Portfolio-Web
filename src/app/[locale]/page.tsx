import { MainLayout } from "@/components/layout/main-layout";
import { FadeSection } from "@/components/layout/page-transition";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { EducationSection } from "@/components/home/education-section";
import { ContactSection } from "@/components/home/contact-section";
import {
  LazyCodingProgress,
  LazyDuolingoProgress,
  LazyMonkeyTypeWidget,
} from "@/components/home/lazy-widgets";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
        <FadeSection className="flex flex-col gap-2">
          <HeroSection />
          <AboutSection />
        </FadeSection>

        <FadeSection><SkillsSection /></FadeSection>
        <FadeSection><ExperienceSection /></FadeSection>
        <FadeSection><EducationSection /></FadeSection>
        <FadeSection><LazyCodingProgress /></FadeSection>
        <FadeSection><LazyDuolingoProgress /></FadeSection>
        <FadeSection><LazyMonkeyTypeWidget /></FadeSection>
        <FadeSection><ContactSection /></FadeSection>
      </div>
    </MainLayout>
  );
}
