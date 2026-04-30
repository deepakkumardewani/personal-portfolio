<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
import SectionLabel from "@/components/ui/SectionLabel.vue";

const { email, contactCta, links } = portfolio;
const mailto = `mailto:${email}`;
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-heading">
    <h2 id="contact-heading" class="sr-only">Contact</h2>
    <div class="contact__inner">
      <div class="contact__label">
        <SectionLabel index="06" label="CONTACT" />
      </div>
      <a :href="mailto" class="contact__headline">
        {{ contactCta }}
      </a>
      <div class="contact__icons">
        <a
          :href="links.linkedin"
          class="contact__icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M6.5 8.5h-3v12h3v-12zm-1.5-4.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm14 5.5c-2.8 0-3.5 1.4-3.5 3.2V21h3v-7.5c0-.8.3-1.7 1.5-1.7 1.2 0 1.5 1 1.5 2V21h3v-8.2c0-2.5-1.4-3.6-3.5-3.6z" />
          </svg>
        </a>
        <a
          :href="links.github"
          class="contact__icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.48 2.87 8.28 6.84 9.63.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.32 9.32 0 0 1 12 6.82c.85.004 1.71.12 2.51.35 1.9-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" clip-rule="evenodd" />
          </svg>
        </a>
        <a
          :href="mailto"
          class="contact__icon-link"
          aria-label="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.4l-8 5-8-5V6zm0 2.9V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.9l-7.4 4.6a1 1 0 0 1-1.2 0L4 8.9z" />
          </svg>
        </a>
      </div>
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

.contact__icons {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.contact__icon-link {
  display: inline-flex;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact__icon-link:hover,
.contact__icon-link:focus-visible {
  color: var(--color-text);
}

.contact__icon-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 2px;
}
</style>
