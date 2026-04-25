<script setup lang="ts">
import { computed, ref } from "vue";

import { useSkillOrbitTagBurst, useSkillOrbitTilt } from "@/composables/useScrollAnimations";
import { DEFAULT_ORBIT_RADIUS_PX, satellitePosition } from "@/utils/skillOrbitLayout";
import type { SkillGroup } from "@/types/portfolio";

const props = defineProps<{
  skillGroups: SkillGroup[];
}>();

const CENTER_NODE_LABEL = "8+ years";

const orbitRef = ref<HTMLElement | null>(null);
const satRefs = ref<(HTMLElement | null)[]>([]);
const tagRefs = ref<(HTMLElement | null)[]>([]);

const { stageStyle, prefersReducedMotion } = useSkillOrbitTilt(orbitRef);
useSkillOrbitTagBurst(satRefs, tagRefs, prefersReducedMotion);

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
  if (el instanceof HTMLElement) {
    satRefs.value[i] = el;
  } else {
    satRefs.value[i] = null;
  }
}

function setTagRef(el: unknown, i: number) {
  if (el instanceof HTMLElement) {
    tagRefs.value[i] = el;
  } else {
    tagRefs.value[i] = null;
  }
}
</script>

<template>
  <div class="skill-orbit">
    <!-- Task 15: touch / coarse pointers — same stacked list -->
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

    <!-- Task 17: desktop orbital -->
    <div
      ref="orbitRef"
      class="skill-orbit__orbital"
      :aria-label="'Skill categories in orbit, center: ' + CENTER_NODE_LABEL"
    >
      <div class="skill-orbit__tilt" :style="stageStyle">
        <div class="skill-orbit__pivot">
          <div class="skill-orbit__center" aria-hidden="true">
            {{ CENTER_NODE_LABEL }}
          </div>
          <div
            v-for="(group, i) in skillGroups"
            :key="`orb-${group.label}-${i}`"
            :ref="(el) => setSatRef(el, i)"
            class="skill-orbit__sat"
            :style="satelliteStyles[i]"
            tabindex="0"
            :aria-label="`${group.label} skills. Hover or focus to expand tags.`"
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
  --skill-orbit-r: 148px;
  --skill-perspective: 1000px;
  position: relative;
}

/* Mobile / touch: list only (Task 15) */
.skill-orbit__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-orbit__orbital {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .skill-orbit__list {
    display: none;
  }

  .skill-orbit__orbital {
    display: block;
  }
}

.skill-orbit__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
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
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--color-accent);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  white-space: nowrap;
}

/* Orbital (desktop) */
.skill-orbit__orbital {
  min-height: min(70vh, 32rem);
  position: relative;
  perspective: var(--skill-perspective);
  z-index: 0;
  outline: none;
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
  width: min(calc(2 * (var(--skill-orbit-r) + 5rem)), 100%);
  max-width: 42rem;
  aspect-ratio: 1;
  margin: 0 auto;
  transform-style: preserve-3d;
}

.skill-orbit__center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1;
  color: var(--color-text);
  text-align: center;
  text-transform: uppercase;
  pointer-events: none;
  white-space: nowrap;
}

.skill-orbit__sat {
  position: absolute;
  z-index: 1;
  width: min(10rem, 32vw);
  min-height: 2.5rem;
  text-align: center;
  transform-style: preserve-3d;
  cursor: default;
  border-radius: 0.5rem;
  padding: 0.35rem 0.25rem 0.5rem;
  margin: 0;
}

.skill-orbit__sat:hover,
.skill-orbit__sat:focus-visible {
  z-index: 3;
  outline: 1px solid var(--color-border);
  outline-offset: 2px;
}

.skill-orbit__sat-title {
  margin: 0 0 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-muted);
}

.skill-orbit__sat-burst {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.4rem;
  justify-content: center;
  align-items: center;
  min-height: 0;
  will-change: transform;
}

.skill-orbit__tag--orbital {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}
</style>
