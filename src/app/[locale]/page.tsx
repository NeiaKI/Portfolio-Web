import { MainLayout } from "@/components/layout/main-layout";
import { FadeSection } from "@/components/layout/page-transition";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { CoursesSection } from "@/components/home/courses-section";
import { EducationSection } from "@/components/home/education-section";
import { ContactSection } from "@/components/home/contact-section";
import {
  LazySkillsSection,
  LazyCodingProgress,
  LazyDuolingoProgress,
  LazyBrilliantProgress,
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

        <FadeSection><LazySkillsSection /></FadeSection>
        <FadeSection><ExperienceSection /></FadeSection>
        <FadeSection><CoursesSection /></FadeSection>
        <FadeSection><EducationSection /></FadeSection>
        <FadeSection><LazyCodingProgress /></FadeSection>
        <FadeSection><LazyDuolingoProgress /></FadeSection>
        <FadeSection><LazyBrilliantProgress /></FadeSection>
        <FadeSection><LazyMonkeyTypeWidget /></FadeSection>
        <FadeSection><ContactSection /></FadeSection>
      </div>
    </MainLayout>
  );
}
