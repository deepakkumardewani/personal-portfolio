<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const e = portfolio.education;
</script>

<template>
  <section id="education" class="education" :aria-label="`Education: ${e.institution}`">
    <div class="education__label">
      <SectionLabel index="05" label="EDUCATION" />
    </div>
    <div class="education__card">
      <h2 class="education__institution">
        {{ e.institution }}
      </h2>
      <p class="education__degree">
        {{ e.degree }}
      </p>
      <p class="education__meta">
        <span class="education__line">{{ e.period }}</span>
        <span class="education__line">{{ e.location }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.education {
  padding: clamp(3.5rem, 8vw, 5rem) clamp(1.25rem, 4vw, 2.5rem);
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.education__label {
  width: 100%;
  max-width: 28rem;
  margin-bottom: 1.5rem;
}

.education__card {
  max-width: 32rem;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

.education__institution {
  font-family: var(--font-sans);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  line-height: 1.35;
}

.education__degree {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-muted);
  margin-bottom: 1.25rem;
}

.education__meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
