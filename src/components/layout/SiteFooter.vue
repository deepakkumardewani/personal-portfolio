<script setup lang="ts">
import { portfolio } from "@/data/portfolio.config";
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer__copy">© 2026 {{ portfolio.name }}</p>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 1.5rem clamp(1rem, 4vw, 2.5rem);
  border-top: 1px solid var(--color-border);
}

.site-footer__copy {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-muted);
}
</style>
