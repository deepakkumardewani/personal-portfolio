<script setup lang="ts">
defineProps<{
  index: string;
  label: string;
}>();
</script>

<template>
  <p class="section-label">{{ index }} / {{ label }}</p>
</template>

<style scoped>
.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant: small-caps;
  letter-spacing: 0.12em;
  color: var(--color-muted);
}
</style>
