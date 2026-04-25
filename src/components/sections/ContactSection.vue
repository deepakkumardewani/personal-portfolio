<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const { email, contactCta, links } = portfolio;
const mailto = `mailto:${email}`;
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-heading">
    <div class="contact__inner">
      <div class="contact__label">
        <SectionLabel index="06" label="CONTACT" />
      </div>
      <a :href="mailto" class="contact__headline">
        {{ contactCta }}
      </a>
      <h2 id="contact-heading" class="sr-only">Contact</h2>
      <ul class="contact__links">
        <li>
          <a :href="links.linkedin" class="contact__link" rel="noopener noreferrer" target="_blank">
            LinkedIn
          </a>
        </li>
        <li>
          <a :href="links.github" class="contact__link" rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </li>
        <li v-if="links.website">
          <a :href="links.website" class="contact__link" rel="noopener noreferrer" target="_blank">
            Website
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  width: 100%;
  padding: clamp(4.5rem, 10vh, 7rem) clamp(1.25rem, 4vw, 2.5rem);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.contact__inner {
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.contact__label {
  width: 100%;
  text-align: center;
  margin-bottom: 0.25rem;
}

.contact__headline {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.contact__headline:hover,
.contact__headline:focus-visible {
  color: var(--color-accent);
}

.contact__headline:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 0.2rem;
  border-radius: 0.1rem;
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact__link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  color: var(--color-muted);
  border-bottom: 1px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.contact__link:hover,
.contact__link:focus-visible {
  color: var(--color-text);
  border-color: var(--color-muted);
}

.contact__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 0.2rem;
  border-bottom-color: transparent;
}
</style>
