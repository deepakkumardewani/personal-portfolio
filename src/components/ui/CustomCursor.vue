<script setup lang="ts">
import { useTemplateRef } from "vue";

import { useCustomCursor } from "@/composables/useCustomCursor";

const rootRef = useTemplateRef<HTMLElement | null>("rootRef");
const { isTouchCoarse } = useCustomCursor(rootRef);
</script>

<template>
  <div
    v-show="!isTouchCoarse"
    ref="rootRef"
    class="custom-cursor"
    aria-hidden="true"
    role="presentation"
  >
    <span class="custom-cursor__line custom-cursor__line--h" />
    <span class="custom-cursor__line custom-cursor__line--v" />
  </div>
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  pointer-events: none;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.custom-cursor__line {
  position: absolute;
  background: var(--color-text);
  opacity: 0.9;
  border-radius: 1px;
}

.custom-cursor__line--h {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  margin-top: -0.5px;
}

.custom-cursor__line--v {
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  margin-left: -0.5px;
}
</style>
