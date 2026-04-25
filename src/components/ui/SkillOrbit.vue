<script setup lang="ts">
import type { SkillGroup } from "@/types/portfolio";

defineProps<{
  skillGroups: SkillGroup[];
}>();
</script>

<template>
  <div class="skill-orbit" data-skills="list">
    <div v-for="(group, i) in skillGroups" :key="`${group.label}-${i}`" class="skill-orbit__group">
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
</template>

<style scoped>
.skill-orbit {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
</style>
