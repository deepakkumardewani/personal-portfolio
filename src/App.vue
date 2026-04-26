<script setup lang="ts">
import CustomCursor from "@/components/ui/CustomCursor.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import SiteHeader from "@/components/layout/SiteHeader.vue";
import AwardSection from "@/components/sections/AwardSection.vue";
import ContactSection from "@/components/sections/ContactSection.vue";
import EducationSection from "@/components/sections/EducationSection.vue";
import ExperienceSection from "@/components/sections/ExperienceSection.vue";
import HeroSection from "@/components/sections/HeroSection.vue";
import ProjectsSection from "@/components/sections/ProjectsSection.vue";
import SkillsSection from "@/components/sections/SkillsSection.vue";
</script>

<template>
  <div class="app-root">
    <CustomCursor />
    <SiteHeader />
    <main class="app-main">
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <AwardSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.app-main {
  padding-top: 0;
  min-height: 100dvh;
}
</style>
