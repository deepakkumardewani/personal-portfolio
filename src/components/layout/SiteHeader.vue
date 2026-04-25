<script setup lang="ts">
import {
  useEventListener,
  useIntersectionObserver,
  useWindowScroll,
  onClickOutside,
} from "@vueuse/core";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type Ref,
} from "vue";

import { useSiteHeaderScrollAnimation } from "@/composables/useScrollAnimations";
import { ANCHOR_IDS, MAIN_NAV_ANCHOR_KEYS, type MainNavAnchorKey } from "@/constants/navigation";

const MOBILE_MAX_PX = 767;
const SCROLL_BLUR_PX = 50;

const NAV_LINKS: ReadonlyArray<{
  id: "work" | "experience" | "skills" | "contact";
  label: string;
  href: string;
}> = [
  { id: "work", label: "Work", href: `#${ANCHOR_IDS.work}` },
  { id: "experience", label: "Experience", href: `#${ANCHOR_IDS.experience}` },
  { id: "skills", label: "Skills", href: `#${ANCHOR_IDS.skills}` },
  { id: "contact", label: "Contact", href: `#${ANCHOR_IDS.contact}` },
];

const headerRef = useTemplateRef<HTMLElement | null>("headerRef");
const drawerRef = useTemplateRef<HTMLElement | null>("drawerRef");
const menuButtonRef = useTemplateRef<HTMLButtonElement | null>("menuButtonRef");

const targetHero = ref<HTMLElement | null>(null);
const targetWork = ref<HTMLElement | null>(null);
const targetExperience = ref<HTMLElement | null>(null);
const targetSkills = ref<HTMLElement | null>(null);
const targetContact = ref<HTMLElement | null>(null);

const targetMap: Record<MainNavAnchorKey, Ref<HTMLElement | null>> = {
  hero: targetHero,
  work: targetWork,
  experience: targetExperience,
  skills: targetSkills,
  contact: targetContact,
};

const activeSection = ref<MainNavAnchorKey>("hero");
const isDrawerOpen = ref(false);
const isMobile = ref(false);
const { y: scrollY } = useWindowScroll();

const isScrolled = computed(() => scrollY.value > SCROLL_BLUR_PX);

useSiteHeaderScrollAnimation(headerRef);

function onMediaQuery() {
  isMobile.value = window.innerWidth <= MOBILE_MAX_PX;
  if (!isMobile.value) {
    isDrawerOpen.value = false;
  }
}

const stopResizeListener = useEventListener("resize", onMediaQuery, { passive: true });

onClickOutside(
  drawerRef,
  () => {
    if (isDrawerOpen.value) {
      isDrawerOpen.value = false;
    }
  },
  { ignore: [menuButtonRef] },
);

watch(isDrawerOpen, (open) => {
  if (open) {
    void nextTick(() => {
      const first = document.querySelector<HTMLAnchorElement>("#site-header-drawer a[href^='#']");
      first?.focus();
    });
  } else {
    void nextTick(() => {
      menuButtonRef.value?.focus();
    });
  }
});

onMounted(() => {
  for (const key of MAIN_NAV_ANCHOR_KEYS) {
    targetMap[key].value = document.getElementById(key);
  }

  onMediaQuery();
});

onBeforeUnmount(() => {
  stopResizeListener();
});

const spyOptions = { rootMargin: "-38% 0px -38% 0px", threshold: 0 } as const;

for (const key of MAIN_NAV_ANCHOR_KEYS) {
  useIntersectionObserver(
    () => targetMap[key].value,
    (entries) => {
      if (entries[0]?.isIntersecting) {
        activeSection.value = key;
      }
    },
    spyOptions,
  );
}

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}

function isNavItemActive(id: (typeof NAV_LINKS)[number]["id"]) {
  return activeSection.value === id;
}
</script>

<template>
  <header
    ref="headerRef"
    class="site-header"
    :class="{ 'site-header--scrolled': isScrolled, 'site-header--mobile': isMobile }"
  >
    <div class="site-header__bar">
      <a
        class="site-header__brand"
        href="#hero"
        :aria-current="activeSection === 'hero' ? 'page' : undefined"
        >DKD</a
      >

      <nav class="site-header__nav site-header__nav--desktop" aria-label="Primary">
        <template v-for="(item, index) in NAV_LINKS" :key="item.id">
          <span v-if="index > 0" class="site-header__dot" aria-hidden="true">·</span>
          <a
            :href="item.href"
            class="site-header__link"
            :class="{ 'site-header__link--active': isNavItemActive(item.id) }"
            :aria-current="isNavItemActive(item.id) ? 'page' : undefined"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>

      <button
        ref="menuButtonRef"
        type="button"
        class="site-header__hamburger"
        aria-controls="site-header-drawer"
        :aria-expanded="isDrawerOpen"
        @click="toggleDrawer"
      >
        <span class="sr-only">{{ isDrawerOpen ? "Close menu" : "Open menu" }}</span>
        <span class="site-header__hamburger-line" aria-hidden="true" />
        <span class="site-header__hamburger-line" aria-hidden="true" />
        <span class="site-header__hamburger-line" aria-hidden="true" />
      </button>
    </div>

    <div
      v-show="isMobile"
      id="site-header-drawer"
      ref="drawerRef"
      class="site-header__drawer"
      :data-open="isDrawerOpen"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <nav
        v-if="isDrawerOpen"
        class="site-header__nav site-header__nav--drawer"
        aria-label="Primary mobile"
      >
        <a
          v-for="item in NAV_LINKS"
          :key="`drawer-${item.id}`"
          :href="item.href"
          class="site-header__link site-header__link--stacked"
          :class="{ 'site-header__link--active': isNavItemActive(item.id) }"
          :aria-current="isNavItemActive(item.id) ? 'page' : undefined"
          @click="closeDrawer"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  will-change: transform;
}

.site-header__bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem clamp(1rem, 4vw, 2rem);
  transition:
    background-color 0.35s ease,
    backdrop-filter 0.35s ease;
}

.site-header--scrolled .site-header__bar {
  background-color: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.site-header__brand {
  font-family: var(--font-display);
  font-size: 1.75rem;
  letter-spacing: 0.04em;
  line-height: 1;
  color: var(--color-text);
  text-decoration: none;
}

.site-header__brand:hover,
.site-header__brand:focus-visible {
  color: var(--color-accent);
}

.site-header__brand:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 2px;
}

.site-header__nav--desktop {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  font-size: 0.7rem;
  font-variant: small-caps;
  letter-spacing: 0.14em;
}

.site-header__dot {
  color: var(--color-muted);
  user-select: none;
}

.site-header__link {
  font-family: var(--font-mono);
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-header__link:hover,
.site-header__link:focus-visible {
  color: var(--color-text);
}

.site-header__link--active {
  color: var(--color-accent);
}

.site-header__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 2px;
}

.site-header__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.site-header__hamburger-line {
  display: block;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.site-header__hamburger:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.site-header__drawer {
  position: fixed;
  inset: 0;
  z-index: 1;
  padding: 5rem 1.5rem 2rem;
  background-color: var(--color-bg);
  overflow-y: auto;
}

.site-header__drawer[data-open="false"] {
  visibility: hidden;
  pointer-events: none;
}

.site-header__drawer[data-open="true"] {
  visibility: visible;
  pointer-events: auto;
}

.site-header__nav--drawer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.site-header__link--stacked {
  font-size: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .site-header__nav--desktop {
    display: flex;
  }

  .site-header__hamburger {
    display: none;
  }
}

@media (max-width: 767px) {
  .site-header__nav--desktop {
    display: none;
  }

  .site-header__hamburger {
    display: flex;
  }
}
</style>
