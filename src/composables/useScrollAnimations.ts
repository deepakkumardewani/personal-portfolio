import { usePreferredReducedMotion } from "@vueuse/core";
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
function registerScrollAnimationCleanup() {
  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
}

/**
 * Mouse-driven 3D tilt for the skills orbital stage. ±5° toward cursor.
 *
 * Uses direct DOM event listeners + GSAP quickTo so that:
 * 1. Updates are RAF-batched, never interrupting CSS :hover hit-testing (no flicker).
 * 2. event.target lets us freeze the tilt while the cursor is inside a satellite card.
 *
 * quickTo is created lazily on first mousemove so it is guaranteed to see the mounted
 * tilt element — avoids the watch-ordering race where [orbitRef, tiltRef] might not both
 * be populated in the same flush.
 */
export function useSkillOrbitTilt(
  orbitRef: Ref<HTMLElement | null>,
  tiltRef: Ref<HTMLElement | null>,
) {
  const prefersReducedMotion = usePreferredReducedMotion();

  const reducedMotionBoolean = computed(() =>
    isPreferredReducedMotionQuery(prefersReducedMotion.value),
  );

  type QuickToFunc = (value: number) => void;
  let quickRotX: QuickToFunc | null = null;
  let quickRotY: QuickToFunc | null = null;
  let cachedTiltEl: HTMLElement | null = null;

  function getQuickTo(): { x: QuickToFunc; y: QuickToFunc } | null {
    const tilt = tiltRef.value;
    if (!tilt) return null;
    if (tilt !== cachedTiltEl) {
      cachedTiltEl = tilt;
      quickRotX = gsap.quickTo(tilt, "rotateX", {
        duration: 0.3,
        ease: "power2.out",
      }) as QuickToFunc;
      quickRotY = gsap.quickTo(tilt, "rotateY", {
        duration: 0.3,
        ease: "power2.out",
      }) as QuickToFunc;
    }
    return { x: quickRotX!, y: quickRotY! };
  }

  function resetTilt() {
    const fns = getQuickTo();
    if (!fns) return;
    fns.x(0);
    fns.y(0);
  }

  function onMouseMove(e: MouseEvent) {
    if (reducedMotionBoolean.value) return;
    const fns = getQuickTo();
    if (!fns) return;

    // Freeze tilt when cursor is on or inside a satellite card to prevent hover flicker.
    if ((e.target as Element | null)?.closest(".skill-orbit__sat")) {
      fns.x(0);
      fns.y(0);
      return;
    }

    const orbit = orbitRef.value;
    if (!orbit) return;
    const { width, height, left, top } = orbit.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;

    const nx = ((e.clientX - left) / width) * 2 - 1;
    const ny = ((e.clientY - top) / height) * 2 - 1;
    fns.x(-ny * SKILL_ORBIT_TILT_DEG);
    fns.y(nx * SKILL_ORBIT_TILT_DEG);
  }

  // Only orbitRef needs watching — listeners attach/detach when the container mounts.
  // tiltRef is read lazily inside onMouseMove so there is no ordering dependency.
  watch(
    orbitRef,
    (orbit, prevOrbit) => {
      if (prevOrbit) {
        prevOrbit.removeEventListener("mousemove", onMouseMove);
        prevOrbit.removeEventListener("mouseleave", resetTilt);
      }
      if (!orbit) return;
      orbit.addEventListener("mousemove", onMouseMove);
      orbit.addEventListener("mouseleave", resetTilt);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    const orbit = orbitRef.value;
    if (orbit) {
      orbit.removeEventListener("mousemove", onMouseMove);
      orbit.removeEventListener("mouseleave", resetTilt);
    }
    quickRotX = null;
    quickRotY = null;
    cachedTiltEl = null;
  });

  return { prefersReducedMotion: reducedMotionBoolean };
}

/**
 * Spotlight effect is handled entirely via CSS :has() — no JS needed.
 * Kept for API compatibility with SkillOrbit.vue.
 */
export function useSkillOrbitTagBurst(
  _satRefs: Readonly<Ref<(HTMLElement | null)[]>>,
  _tagRefs: Readonly<Ref<(HTMLElement | null)[]>>,
  _prefersReducedMotion: Readonly<Ref<boolean>>,
) {}

/**
 * Fade + scale reveal for the orbital container on scroll-in.
 */
export function useSkillOrbitEntrance(orbitRef: Readonly<Ref<HTMLElement | null>>) {
  const prefersReducedMotion = usePreferredReducedMotion();
  let ctx: gsap.Context | null = null;

  function run() {
    ctx?.revert();
    const el = orbitRef.value;
    if (!el) return;
    const reduced = isPreferredReducedMotionQuery(prefersReducedMotion.value);

    ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el, { opacity: 1, scale: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);
  }

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });

  watch(
    () => [orbitRef.value, prefersReducedMotion.value] as const,
    () => {
      void nextTick(run);
    },
    { flush: "post", immediate: true },
  );
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
