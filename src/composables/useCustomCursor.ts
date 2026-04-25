import { type Ref, ref } from "vue";

export function useCustomCursor(): { x: Ref<number>; y: Ref<number> } {
  const x = ref(0);
  const y = ref(0);
  // TODO(Phase 5): wire pointer + magnetic target tracking
  return { x, y };
}
