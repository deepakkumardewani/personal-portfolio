import { useMouseInElement, usePreferredReducedMotion } from "@vueuse/core";
import { computed, nextTick, onUnmounted, type Ref, watch } from "vue";

import { gsap, ScrollTrigger } from "@/utils/gsap";

const SKILL_ORBIT_TILT_DEG = 5;

const HERO_STAGGER = 0.02;
const HERO_CHAR_DURATION = 0.4;
const HEADER_SCROLL_MIN_PX = 100;
const SCROLL_DIR_EPSILON = 4;

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
 * Mobile parallax for the skills orbital stage (desktop). ±5° toward cursor; disabled when
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

/**
 * Staggered hero name + tagline fade on mount. Uses a scoped `gsap.context` for cleanup.
 */
export function useHeroAnimation(
  nameEl: Readonly<Ref<HTMLElement | null>>,
  taglineEl: Readonly<Ref<HTMLElement | null>>,
) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let ctx: gsap.Context | null = null;

  function run() {
    ctx?.revert();
    const name = nameEl.value;
    if (!name) {
      return;
    }
    const chars = name.querySelectorAll<HTMLElement>(".char");
    if (chars.length === 0) {
      return;
    }
    const tag = taglineEl.value;
    const reduced = isPreferredReducedMotionQuery(prefersReducedMotion.value);

    ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(chars, { y: 0, opacity: 1, clearProps: "transform" });
        if (tag) {
          gsap.set(tag, { opacity: 1 });
        }
        return;
      }
      if (tag) {
        gsap.set(tag, { opacity: 0 });
      }
      gsap.fromTo(
        chars,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: HERO_CHAR_DURATION,
          stagger: HERO_STAGGER,
          ease: "power4.out",
          onComplete: () => {
            if (tag) {
              gsap.to(tag, { opacity: 1, duration: 0.5, ease: "power2.out" });
            }
          },
        },
      );
    }, name);
  }

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });

  watch(
    () => [nameEl.value, taglineEl.value, prefersReducedMotion.value] as const,
    () => {
      void nextTick(run);
    },
    { flush: "post", immediate: true },
  );
}

/**
 * ScrollTrigger-driven reveals per sticky project panel.
 */
export function useProjectsAnimation(sectionEl: Readonly<Ref<HTMLElement | null>>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let ctx: gsap.Context | null = null;

  function run() {
    ctx?.revert();
    const root = sectionEl.value;
    if (!root) {
      return;
    }
    const reduced = isPreferredReducedMotionQuery(prefersReducedMotion.value);

    ctx = gsap.context(() => {
      const panels = root.querySelectorAll<HTMLElement>(".projects__panel");
      panels.forEach((panel) => {
        const title = panel.querySelector<HTMLElement>(".project-card__title");
        const stackItems = panel.querySelectorAll<HTMLElement>(".project-card__stack-item");
        const image = panel.querySelector<HTMLElement>(".project-card__image");

        if (reduced) {
          if (title) {
            gsap.set(title, { y: 0, opacity: 1 });
          }
          gsap.set(stackItems, { opacity: 1 });
          if (image) {
            gsap.set(image, { scale: 1, clearProps: "transform" });
          }
          return;
        }
        if (title) {
          gsap.set(title, { y: 40, opacity: 0 });
        }
        gsap.set(stackItems, { opacity: 0 });
        if (image) {
          gsap.set(image, { scale: 0.8, transformOrigin: "50% 50%" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 75%",
            end: "bottom top",
            toggleActions: "play none none none",
          },
        });
        if (title) {
          tl.to(
            title,
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            0,
          );
        }
        if (stackItems.length) {
          tl.to(
            stackItems,
            {
              opacity: 1,
              duration: 0.3,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.12,
          );
        }
        if (image) {
          tl.to(
            image,
            {
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            0.05,
          );
        }
      });
    }, root);
  }

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });

  watch(
    () => [sectionEl.value, prefersReducedMotion.value] as const,
    () => {
      void nextTick(run);
    },
    { flush: "post", immediate: true },
  );
}

/**
 * Experience timeline: card slide-in, then staggered highlight lines.
 */
export function useExperienceAnimation(sectionEl: Readonly<Ref<HTMLElement | null>>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let ctx: gsap.Context | null = null;

  function run() {
    ctx?.revert();
    const root = sectionEl.value;
    if (!root) {
      return;
    }
    const reduced = isPreferredReducedMotionQuery(prefersReducedMotion.value);

    ctx = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>(".experience__card");
      cards.forEach((card) => {
        const items = card.querySelectorAll<HTMLElement>(".experience__highlights li");
        if (reduced) {
          gsap.set(card, { x: 0, opacity: 1 });
          if (items.length) {
            gsap.set(items, { opacity: 1 });
          }
          return;
        }
        gsap.set(card, { x: -20, opacity: 0 });
        if (items.length) {
          gsap.set(items, { opacity: 0 });
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
        tl.to(card, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
        if (items.length) {
          tl.to(items, { opacity: 1, duration: 0.28, stagger: 0.1, ease: "power1.out" }, "-=0.15");
        }
      });
    }, root);
  }

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });

  watch(
    () => [sectionEl.value, prefersReducedMotion.value] as const,
    () => {
      void nextTick(run);
    },
    { flush: "post", immediate: true },
  );
}

/**
 * Award section: blur-to-sharp; reduced motion uses opacity only.
 */
export function useAwardAnimation(sectionEl: Readonly<Ref<HTMLElement | null>>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let ctx: gsap.Context | null = null;

  function run() {
    ctx?.revert();
    const root = sectionEl.value;
    if (!root) {
      return;
    }
    const title = root.querySelector<HTMLElement>(".award__title");
    const meta = root.querySelector<HTMLElement>(".award__meta");
    if (!title && !meta) {
      return;
    }
    const reduced = isPreferredReducedMotionQuery(prefersReducedMotion.value);
    const targets: HTMLElement[] = [title, meta].filter((n): n is HTMLElement => n !== null);

    ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 0, clearProps: "filter" });
        gsap.to(targets, {
          opacity: 1,
          duration: 0.45,
          ease: "power1.out",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        });
        return;
      }
      gsap.set(targets, { opacity: 0, filter: "blur(20px)" });
      gsap.to(targets, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    }, root);
  }

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });

  watch(
    () => [sectionEl.value, prefersReducedMotion.value] as const,
    () => {
      void nextTick(run);
    },
    { flush: "post", immediate: true },
  );
}

/**
 * Site header: hide on scroll down past threshold, show on scroll up. Skips transform when
 * `prefers-reduced-motion: reduce` (header stays visible).
 */
export function useSiteHeaderScrollAnimation(headerRef: Readonly<Ref<HTMLElement | null>>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let headerScrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
  let lastScrollY = 0;

  function setHeaderVisibility(visible: boolean) {
    const el = headerRef.value;
    if (!el) {
      return;
    }
    if (isPreferredReducedMotionQuery(prefersReducedMotion.value)) {
      gsap.set(el, { yPercent: 0 });
      return;
    }
    gsap.to(el, {
      yPercent: visible ? 0 : -100,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function mountTrigger() {
    if (!headerRef.value) {
      return;
    }
    if (isPreferredReducedMotionQuery(prefersReducedMotion.value)) {
      gsap.set(headerRef.value, { yPercent: 0 });
      return;
    }
    headerScrollTrigger?.kill();
    lastScrollY = window.scrollY;
    headerScrollTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        const y = window.scrollY;
        if (y < HEADER_SCROLL_MIN_PX) {
          setHeaderVisibility(true);
          lastScrollY = y;
          return;
        }
        if (y > lastScrollY + SCROLL_DIR_EPSILON) {
          setHeaderVisibility(false);
        } else if (y < lastScrollY - SCROLL_DIR_EPSILON) {
          setHeaderVisibility(true);
        }
        lastScrollY = y;
      },
    });
  }

  function teardown() {
    headerScrollTrigger?.kill();
    headerScrollTrigger = null;
    if (headerRef.value) {
      gsap.killTweensOf(headerRef.value);
    }
  }

  onUnmounted(() => {
    teardown();
  });

  watch(
    () => [headerRef.value, prefersReducedMotion.value] as const,
    () => {
      teardown();
      if (isPreferredReducedMotionQuery(prefersReducedMotion.value) && headerRef.value) {
        gsap.set(headerRef.value, { yPercent: 0 });
        return;
      }
      void nextTick(mountTrigger);
    },
    { flush: "post", immediate: true },
  );
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
