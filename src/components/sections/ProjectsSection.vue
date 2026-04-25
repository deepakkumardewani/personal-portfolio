<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
import ProjectCard from "@/components/ui/ProjectCard.vue";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const projects = portfolio.projects;
const total = projects.length;
</script>

<template>
  <section id="work" class="projects" aria-labelledby="work-heading">
    <h2 id="work-heading" class="sr-only">Selected work</h2>
    <div class="projects__stack" :style="{ height: `calc(${total} * 100vh)` }">
      <div
        v-for="(project, i) in projects"
        :key="project.id"
        class="projects__panel"
        :style="{ zIndex: i + 1 }"
      >
        <div class="projects__panel-inner">
          <div v-if="i === 0" class="projects__label">
            <SectionLabel index="01" label="WORK" />
          </div>
          <ProjectCard :index="i" :project="project" :total="total" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  position: relative;
  background: var(--color-bg);
}

.projects__stack {
  position: relative;
}

.projects__panel {
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  min-height: 100vh;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.projects__panel-inner {
  position: relative;
  width: min(1100px, 100% - 2.5rem);
  margin: 0 auto;
}

.projects__label {
  margin-bottom: 1.25rem;
}
</style>
