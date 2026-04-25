<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import { useHeroAnimation } from "@/composables/useScrollAnimations";
import { portfolio } from "@/data/portfolio.config";

const nameChars = computed(() => portfolio.name.toUpperCase().split(""));

const nameRef = useTemplateRef<HTMLHeadingElement | null>("nameRef");
const taglineRef = useTemplateRef<HTMLElement | null>("taglineRef");
useHeroAnimation(nameRef, taglineRef);
</script>

<template>
  <section id="hero" class="hero" aria-labelledby="hero-name">
    <div class="hero__glow" aria-hidden="true" />
    <div class="hero__inner">
      <h1 id="hero-name" ref="nameRef" class="hero__name">
        <span
          v-for="(ch, i) in nameChars"
          :key="`${ch}-${i}`"
          :class="['char', { 'char--space': ch === ' ' }]"
          >{{ ch === " " ? "\u00a0" : ch }}</span
        >
      </h1>
      <p ref="taglineRef" class="hero__tagline">
        {{ portfolio.tagline }}
      </p>
    </div>
    <div class="hero__scroll-cue" aria-hidden="true">
      <span class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.hero__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 42%, var(--color-accent-dim) 0%, transparent 60%);
}

.hero__inner {
  position: relative;
  z-index: 1;
  max-width: 100%;
  text-align: center;
}

.hero__name {
  font-family: var(--font-display);
  line-height: 0.88;
  font-size: clamp(3.5rem, 12.5vw, 14rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text);
}

:deep(.char) {
  display: inline-block;
  transform-origin: 50% 80%;
}

:deep(.char--space) {
  width: 0.3em;
}

.hero__tagline {
  margin-top: clamp(1.25rem, 3vw, 2.5rem);
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-muted);
  font-weight: 400;
}

.hero__scroll-cue {
  position: absolute;
  bottom: clamp(1.5rem, 4vh, 2.5rem);
  left: 50%;
  z-index: 1;
  display: flex;
  width: 1px;
  height: 2.5rem;
  transform: translateX(-50%);
  align-items: flex-end;
  justify-content: center;
}

.hero__scroll-line {
  display: block;
  width: 1px;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    to bottom,
    var(--color-muted) 0%,
    var(--color-muted) 45%,
    transparent 100%
  );
  animation: dkd-scroll-cue-pulse 1.6s ease-in-out infinite;
}
</style>
