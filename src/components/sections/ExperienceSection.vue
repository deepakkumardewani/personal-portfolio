<script setup lang="ts">
import { computed } from "vue";

import { portfolio } from "@/data/portfolio.config";
import type { Role } from "@/types/portfolio";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const company = computed(() => portfolio.experience[0]?.company ?? "");

const roles = computed((): Role[] => portfolio.experience[0]?.roles ?? []);

const watermark = computed(() => company.value.toUpperCase().replaceAll(" ", ""));
</script>

<template>
  <section id="experience" class="experience" :aria-label="`Experience at ${company}`">
    <p class="experience__watermark" aria-hidden="true">
      {{ watermark }}
    </p>
    <div class="experience__inner">
      <div class="experience__label">
        <SectionLabel index="02" label="EXPERIENCE" />
      </div>
      <div class="experience__body">
        <h2 class="sr-only">Professional experience</h2>
        <p class="experience__company">
          {{ company }}
        </p>
        <div class="experience__track">
          <ol class="experience__list">
            <li v-for="(role, i) in roles" :key="`role-${i}`" class="experience__card">
              <h3 class="experience__role-line">
                <span class="experience__title">{{ role.title }}</span>
                <span class="experience__meta">{{ role.period }}</span>
              </h3>
              <p class="experience__location">
                {{ role.location }}
              </p>
              <ul v-if="role.highlights.length" class="experience__highlights">
                <li v-for="(h, j) in role.highlights" :key="`h-${i}-${j}`">
                  {{ h }}
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  position: relative;
  overflow: hidden;
  padding: clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2.5rem);
  background: var(--color-bg);
}

.experience__watermark {
  position: absolute;
  top: clamp(0.5rem, 2vw, 1.5rem);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: clamp(4rem, 16vw, 12rem);
  line-height: 0.9;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text);
  opacity: 0.05;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
  z-index: 0;
}

.experience__inner {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience__label {
  margin-bottom: 0.5rem;
}

.experience__company {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.experience__body {
  min-width: 0;
}

.experience__track {
  border-left: 1px solid var(--color-border);
  padding-left: 1.5rem;
}

.experience__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.experience__card {
  position: relative;
}

.experience__card::before {
  content: "";
  position: absolute;
  top: 0.35rem;
  left: calc(-1.5rem - 5px);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.experience__role-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.4rem;
}

.experience__title {
  min-width: 0;
}

.experience__meta {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.experience__location {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.75rem;
}

.experience__highlights {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
