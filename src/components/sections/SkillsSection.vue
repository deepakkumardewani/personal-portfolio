<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
import SkillOrbit from "@/components/ui/SkillOrbit.vue";
import SectionLabel from "@/components/ui/SectionLabel.vue";
</script>

<template>
  <section id="skills" class="skills" aria-labelledby="skills-heading">
    <div class="skills__inner">
      <div class="skills__label">
        <SectionLabel index="04" label="SKILLS" />
      </div>
      <h2 id="skills-heading" class="sr-only">Skills</h2>
      <SkillOrbit :skill-groups="portfolio.skillGroups" />
    </div>
  </section>
</template>

<style scoped>
.skills {
  padding: clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2.5rem);
  background: var(--color-bg);
}

.skills__inner {
  max-width: 900px;
  margin: 0 auto;
}

.skills__label {
  margin-bottom: 1.5rem;
}
</style>
