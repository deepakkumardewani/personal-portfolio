<script setup lang="ts">
import { computed, ref } from "vue";

import {
  useSkillOrbitEntrance,
  useSkillOrbitTagBurst,
  useSkillOrbitTilt,
} from "@/composables/useScrollAnimations";
import { DEFAULT_ORBIT_RADIUS_PX, satellitePosition } from "@/utils/skillOrbitLayout";
import type { SkillGroup } from "@/types/portfolio";

const props = defineProps<{
  skillGroups: SkillGroup[];
}>();

const orbitRef = ref<HTMLElement | null>(null);
const tiltRef = ref<HTMLElement | null>(null);
const satRefs = ref<(HTMLElement | null)[]>([]);
const tagRefs = ref<(HTMLElement | null)[]>([]);

const { prefersReducedMotion } = useSkillOrbitTilt(orbitRef, tiltRef);
useSkillOrbitTagBurst(satRefs, tagRefs, prefersReducedMotion);
useSkillOrbitEntrance(orbitRef);

const total = computed(() => props.skillGroups.length);

const satelliteStyles = computed(() => {
  const n = total.value;
  const r = DEFAULT_ORBIT_RADIUS_PX;
  return props.skillGroups.map((_, i) => {
    const { x, y } = satellitePosition(i, n, r);
    return {
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    } as const;
  });
});

function setSatRef(el: unknown, i: number) {
  satRefs.value[i] = el instanceof HTMLElement ? el : null;
}

function setTagRef(el: unknown, i: number) {
  tagRefs.value[i] = el instanceof HTMLElement ? el : null;
}
</script>

<template>
  <div class="skill-orbit">
    <!-- Mobile / touch: stacked list -->
    <div class="skill-orbit__list" data-skills="list">
      <div
        v-for="(group, i) in skillGroups"
        :key="`list-${group.label}-${i}`"
        class="skill-orbit__group"
      >
        <h3 class="skill-orbit__label">
          {{ group.label }}
        </h3>
        <ul class="skill-orbit__tags" :aria-label="group.label">
          <li v-for="tag in group.skills" :key="tag" class="skill-orbit__tag">
            {{ tag }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Desktop orbital -->
    <div
      ref="orbitRef"
      class="skill-orbit__orbital"
      :aria-label="'Skill categories in orbit, center: 8+ years'"
    >
      <div ref="tiltRef" class="skill-orbit__tilt">
        <div class="skill-orbit__pivot">
          <!-- Orbit ring -->
          <div class="skill-orbit__ring" aria-hidden="true" />

          <div class="skill-orbit__center" aria-hidden="true">
            <span class="skill-orbit__center-years">8+</span>
            <span class="skill-orbit__center-label">years</span>
          </div>

          <div
            v-for="(group, i) in skillGroups"
            :key="`orb-${group.label}-${i}`"
            :ref="(el) => setSatRef(el, i)"
            class="skill-orbit__sat"
            :style="satelliteStyles[i]"
            tabindex="0"
            :aria-label="`${group.label} skills`"
          >
            <p class="skill-orbit__sat-title">
              {{ group.label }}
            </p>
            <ul
              :ref="(el) => setTagRef(el, i)"
              class="skill-orbit__sat-burst"
              :aria-label="`${group.label} skills`"
            >
              <li
                v-for="tag in group.skills"
                :key="tag"
                class="skill-orbit__tag skill-orbit__tag--orbital"
              >
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-orbit {
  --skill-orbit-r: 220px;
  --skill-perspective: 1000px;
  position: relative;
}

/* ─── Mobile list ──────────────────────────────────── */
.skill-orbit__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.skill-orbit__group {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
}

.skill-orbit__group:first-child {
  border-top: 1px solid var(--color-border);
}

.skill-orbit__label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
  border-left: 2px solid var(--color-accent);
}

.skill-orbit__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.skill-orbit__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  line-height: 1.2;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  white-space: nowrap;
}

/* ─── Desktop orbital ──────────────────────────────── */
.skill-orbit__orbital {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .skill-orbit__list {
    display: none;
  }

  .skill-orbit__orbital {
    display: block;
    min-height: min(70vh, 32rem);
    position: relative;
    perspective: var(--skill-perspective);
    z-index: 0;
    outline: none;
  }
}

.skill-orbit__tilt {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: min(70vh, 32rem);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  will-change: transform;
}

.skill-orbit__pivot {
  position: relative;
  width: min(calc(2 * (var(--skill-orbit-r) + 6rem)), 100%);
  max-width: 56rem;
  aspect-ratio: 1;
  margin: 0 auto;
  transform-style: preserve-3d;
}

/* Orbit path ring */
.skill-orbit__ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(2 * var(--skill-orbit-r) + 10.5rem);
  height: calc(2 * var(--skill-orbit-r) + 10.5rem);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px dashed #3a3a3a;
  pointer-events: none;
  opacity: 1;
}

/* Center node */
.skill-orbit__center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  pointer-events: none;
  text-align: center;
}

.skill-orbit__center-years {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--color-text);
  text-transform: uppercase;
}

.skill-orbit__center-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-top: 0.2rem;
}

/* Satellites */
.skill-orbit__sat {
  position: absolute;
  z-index: 1;
  width: min(10rem, 32vw);
  text-align: center;
  transform-style: preserve-3d;
  cursor: default;
  border-radius: 0.5rem;
  padding: 0.5rem 0.4rem 0.6rem;
  margin: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition:
    opacity 0.25s ease,
    border-color 0.2s ease;
}

/* Spotlight: dim all siblings when any satellite is hovered/focused */
.skill-orbit__pivot:has(.skill-orbit__sat:hover) .skill-orbit__sat:not(:hover),
.skill-orbit__pivot:has(.skill-orbit__sat:focus-visible) .skill-orbit__sat:not(:focus-visible) {
  opacity: 0.2;
}

.skill-orbit__sat:hover,
.skill-orbit__sat:focus-visible {
  z-index: 3;
  border-color: color-mix(in srgb, var(--color-accent) 60%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-accent) 20%, transparent),
    0 4px 20px color-mix(in srgb, var(--color-accent) 12%, transparent);
  outline: none;
}

.skill-orbit__sat-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
}

.skill-orbit__sat-burst {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  justify-content: center;
  align-items: center;
}

.skill-orbit__tag--orbital {
  font-size: 0.6rem;
  padding: 0.2rem 0.45rem;
  color: var(--color-muted);
  background: transparent;
  border-color: color-mix(in srgb, var(--color-border) 80%, transparent);
}

.skill-orbit__sat:hover .skill-orbit__tag--orbital,
.skill-orbit__sat:focus-visible .skill-orbit__tag--orbital {
  color: var(--color-text);
  border-color: var(--color-border);
}
</style>
