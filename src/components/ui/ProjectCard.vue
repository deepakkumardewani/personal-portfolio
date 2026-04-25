<script setup lang="ts">
import type { Project } from "@/types/portfolio";

const props = defineProps<{
  project: Project;
  index: number;
  total: number;
}>();

const counter = `${String(props.index + 1).padStart(2, "0")} / ${String(props.total).padStart(2, "0")}`;
</script>

<template>
  <article
    class="project-card"
    :style="{
      '--project-accent': project.accentColor,
    }"
  >
    <div class="project-card__content">
      <p class="project-card__counter">
        {{ counter }}
      </p>
      <h3 class="project-card__title">
        {{ project.title }}
      </h3>
      <p class="project-card__tagline">
        {{ project.tagline }}
      </p>
      <ul class="project-card__stack" aria-label="Tech stack">
        <li v-for="tag in project.stack" :key="tag" class="project-card__stack-item">
          {{ tag }}
        </li>
      </ul>
      <a
        v-if="project.url"
        :href="project.url"
        class="project-card__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        View live
      </a>
    </div>
    <div class="project-card__media">
      <img
        :alt="project.title"
        :src="project.image"
        class="project-card__image"
        height="800"
        loading="lazy"
        width="1200"
      />
    </div>
  </article>
</template>

<style scoped>
.project-card {
  --panel-tint: color-mix(in srgb, var(--project-accent) 18%, transparent);
  display: grid;
  grid-template-columns: 1fr;
  min-height: min(100%, 100dvh);
  align-items: center;
  column-gap: clamp(1.5rem, 4vw, 3.5rem);
  row-gap: 1.75rem;
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 3vw, 2rem);
  background: linear-gradient(
    120deg,
    var(--color-bg) 0%,
    var(--color-bg) 45%,
    var(--panel-tint) 100%
  );
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

.project-card__content {
  min-width: 0;
  order: 1;
}

.project-card__media {
  min-width: 0;
  order: 2;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--project-accent) 20%, transparent);
}

.project-card__image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.project-card__counter {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant: small-caps;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  margin-bottom: 0.75rem;
}

.project-card__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.project-card__tagline {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--color-muted);
  margin-bottom: 1.25rem;
  max-width: 36ch;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.5rem;
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
}

.project-card__stack-item {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.project-card__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.project-card__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (min-width: 768px) {
  .project-card {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .project-card {
    align-content: start;
  }

  .project-card__content {
    order: 1;
  }

  .project-card__media {
    order: 2;
  }
}
</style>
