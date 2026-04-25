<script setup lang="ts">
 /** Placeholder; full crosshair in Task 18. */
</script>

<template>
  <div class="custom-cursor" aria-hidden="true" role="presentation" />
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}
</style>
