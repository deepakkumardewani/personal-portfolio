import { onUnmounted } from "vue";

import { ScrollTrigger } from "@/utils/gsap";

function registerScrollAnimationCleanup() {
  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
}

export function useHeroAnimation() {
  registerScrollAnimationCleanup();
}

export function useProjectsAnimation() {
  registerScrollAnimationCleanup();
}

export function useExperienceAnimation() {
  registerScrollAnimationCleanup();
}

export function useAwardAnimation() {
  registerScrollAnimationCleanup();
}

export function useSkillsAnimation() {
  registerScrollAnimationCleanup();
}

export function useEducationAnimation() {
  registerScrollAnimationCleanup();
}

export function useContactAnimation() {
  registerScrollAnimationCleanup();
}
