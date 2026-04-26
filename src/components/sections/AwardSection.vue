<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import { useAwardAnimation } from "@/composables/useScrollAnimations";
import { portfolio } from "@/data/portfolio.config";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const sectionRef = useTemplateRef<HTMLElement | null>("sectionRef");
useAwardAnimation(sectionRef);

const award = portfolio.award;
const backgroundText = computed(() => award.title.toUpperCase());
</script>

<template>
  <section id="award" ref="sectionRef" class="award" aria-labelledby="award-title">
    <p class="award__bg-text" aria-hidden="true">
      {{ backgroundText }}
    </p>
    <div class="award__inner">
      <div class="award__label">
        <SectionLabel index="03" label="AWARD" />
      </div>
      <h2 id="award-title" class="award__title">
        {{ award.title }}
      </h2>
      <p class="award__meta">
        <span class="award__line">{{ award.event }}</span>
        <span class="award__line">{{ award.date }} · {{ award.location }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.award {
  position: relative;
  overflow: hidden;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(4rem, 10vh, 6rem) 1.25rem;
  background: var(--color-surface);
}

.award__bg-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 8vw, 5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-align: center;
  text-transform: uppercase;
  color: var(--color-text);
  opacity: 0.05;
  user-select: none;
  padding: 1rem;
  white-space: normal;
  pointer-events: none;
  z-index: 0;
}

.award__inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 40rem;
}

.award__label {
  text-align: left;
  margin-bottom: 1.5rem;
}

.award__title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5.5vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text);
  font-weight: 400;
  margin-bottom: 1.25rem;
}

.award__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
