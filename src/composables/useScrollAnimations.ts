import { useMouseInElement, usePreferredReducedMotion } from "@vueuse/core";
import { computed, onUnmounted, type Ref, watch } from "vue";

import { gsap, ScrollTrigger } from "@/utils/gsap";

const SKILL_ORBIT_TILT_DEG = 5;

function isPreferredReducedMotionQuery(value: unknown): boolean {
  return value === true || value === "reduce";
}
const skillOrbitBurstTeardown: Array<() => void> = [];

function registerScrollAnimationCleanup() {
  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
}

/**
 * Mouse parallax for the skills orbital stage (desktop). ±5° toward cursor; disabled when
 * `prefers-reduced-motion: reduce` or pointer leaves the orbit.
 */
export function useSkillOrbitTilt(orbitRef: Ref<HTMLElement | null>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(
    orbitRef,
    { handleOutside: true },
  );

  const stageStyle = computed(() => {
    if (isPreferredReducedMotionQuery(prefersReducedMotion.value)) {
      return { transform: "rotateX(0deg) rotateY(0deg)" };
    }
    const w = elementWidth.value;
    const h = elementHeight.value;
    if (w <= 0 || h <= 0 || isOutside.value) {
      return { transform: "rotateX(0deg) rotateY(0deg)" };
    }
    const nx = (elementX.value / w) * 2 - 1;
    const ny = (elementY.value / h) * 2 - 1;
    const rotX = -ny * SKILL_ORBIT_TILT_DEG;
    const rotY = nx * SKILL_ORBIT_TILT_DEG;
    return {
      transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
    };
  });

  const reducedMotionBoolean = computed(() =>
    isPreferredReducedMotionQuery(prefersReducedMotion.value),
  );

  return { stageStyle, prefersReducedMotion: reducedMotionBoolean };
}

function tearDownSkillOrbitBursts() {
  while (skillOrbitBurstTeardown.length > 0) {
    const run = skillOrbitBurstTeardown.pop();
    run?.();
  }
}

/**
 * GSAP scale burst for skill tags on satellite hover/focus. Skipped when reduced motion.
 */
export function useSkillOrbitTagBurst(
  satRefs: Readonly<Ref<(HTMLElement | null)[]>>,
  tagRefs: Readonly<Ref<(HTMLElement | null)[]>>,
  prefersReducedMotion: Readonly<Ref<boolean>>,
) {
  const setup = () => {
    tearDownSkillOrbitBursts();
    const sats = satRefs.value;
    const tags = tagRefs.value;
    const n = Math.min(sats.length, tags.length);
    const reduced = prefersReducedMotion.value;
    for (let i = 0; i < n; i++) {
      const sat = sats[i];
      const tagContainer = tags[i];
      if (!sat || !tagContainer) {
        continue;
      }
      if (reduced) {
        gsap.set(tagContainer, { scale: 1, clearProps: "transform" });
        continue;
      }
      gsap.set(tagContainer, { scale: 0, transformOrigin: "50% 50%" });
      const onEnter = () => {
        gsap.to(tagContainer, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.3)",
        });
      };
      const onLeave = () => {
        gsap.to(tagContainer, { scale: 0, duration: 0.25, ease: "power2.in" });
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!sat.contains(e.relatedTarget as Node | null)) {
          onLeave();
        }
      };
      sat.addEventListener("mouseenter", onEnter);
      sat.addEventListener("mouseleave", onLeave);
      sat.addEventListener("focusin", onEnter);
      sat.addEventListener("focusout", onFocusOut);
      skillOrbitBurstTeardown.push(() => {
        sat.removeEventListener("mouseenter", onEnter);
        sat.removeEventListener("mouseleave", onLeave);
        sat.removeEventListener("focusin", onEnter);
        sat.removeEventListener("focusout", onFocusOut);
        gsap.killTweensOf(tagContainer);
      });
    }
  };

  watch(
    [() => satRefs.value, () => tagRefs.value, () => prefersReducedMotion.value],
    () => {
      setup();
    },
    { flush: "post", deep: true, immediate: true },
  );

  onUnmounted(() => {
    tearDownSkillOrbitBursts();
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
