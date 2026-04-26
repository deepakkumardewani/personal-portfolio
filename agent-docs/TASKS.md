# Implementation Plan: Deepak Kumar Dewani — Personal Portfolio Website

## Overview

Build a single-page personal portfolio for Deepak Kumar Dewani using Vue 3, TypeScript (strict), GSAP 3 + ScrollTrigger, VueUse, and Zod. The site is a high-conversion personal brand asset demonstrating frontend craft through typography, scroll animation, and performance. Deployed as a static SPA on Vercel.

## Architecture Decisions

- **Single source of truth:** All content lives in `src/data/portfolio.config.ts` — no component ever hardcodes text
- **Zod validation at parse time:** Config is validated on import; malformed data fails the build with a descriptive error
- **GSAP registered once:** `src/utils/gsap.ts` registers all plugins; all composables import from there
- **Plain CSS:** No Tailwind — custom CSS with BEM-ish naming inside scoped blocks is itself a craft signal
- **Self-hosted fonts:** `@fontsource` only; no Google Fonts network calls
- **Vertical slicing:** Each section is a standalone task — static markup first, animations layered in a separate phase

---

## Task List

### Phase 0: Project Setup

---

#### Task 0: Scaffold Vue + TypeScript project with Vite+ and install all dependencies

**Description:** Initialize the Vite+ project in the current directory using the Vue + TypeScript template. Clean out the default boilerplate, install all required dependencies, and configure TypeScript strict mode and path aliases.

> ⚠️ **Critical:** Run `vp create` inside `/Users/deepakdewani1/Documents/Programs/vue/personal-portfolio`. Do NOT create a subdirectory. Use the Vue + TypeScript template flag — the default `vp create` scaffolds a plain TypeScript project, not Vue.

**Exact commands:**

```bash
# In /Users/deepakdewani1/Documents/Programs/vue/personal-portfolio
vp create --template vue-ts

# Install all project dependencies
vp install

# Install runtime dependencies
vp install gsap @vueuse/core zod \
  @fontsource/bebas-neue \
  @fontsource/dm-mono \
  @fontsource/instrument-sans
```

**Post-scaffold cleanup:**

- Delete `src/components/HelloWorld.vue`, `src/assets/vue.svg`, boilerplate CSS
- Clear `src/App.vue` to a minimal shell
- Clear `src/main.ts` to a clean entry point

**tsconfig.json changes:**

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

**vite.config.ts changes:**

```ts
resolve: {
  alias: { '@': '/src' }
}
```

**Acceptance criteria:**

- `vp dev` starts without errors
- `vp build` completes without errors
- `vp check` passes (lint + format + type-check)
- `import gsap from 'gsap'` resolves without error
- `import { useMouseInElement } from '@vueuse/core'` resolves without error
- `import { z } from 'zod'` resolves without error
- All three `@fontsource` packages installed in `node_modules`
- TypeScript strict mode enabled in `tsconfig.json` _(via `tsconfig.app.json`)_
- `@/` alias resolves to `src/`

**Verification:**

- `vp dev` — browser opens, blank page with no console errors
- `vp build` — `/dist` directory created, no type errors
- `vp check` — exits 0

**Dependencies:** None

**Files touched:**

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.ts`
- `src/App.vue`

**Estimated scope:** Medium

---

### Phase 1: Foundation

---

#### Task 1: Global styles, CSS custom properties, and font loading

**Description:** Create the three global stylesheets. `global.css` defines the CSS reset, all custom property tokens (colors, spacing, typography), and base element styles. `animations.css` defines reusable keyframe animations. `utilities.css` holds helper classes (`sr-only`, etc.). Import all three in `main.ts`. Load and apply all three `@fontsource` fonts.

**Acceptance criteria:**

- All color tokens defined as CSS custom properties matching SPEC exactly (8 tokens: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, `--color-accent`, `--color-accent-dim`, `--color-white`)
- Bebas Neue, DM Mono, and Instrument Sans load from `@fontsource` with `font-display: swap`
- CSS reset applied (box-sizing, margin/padding reset, `cursor: none` on `body`)
- Base `font-family`, `background-color`, and `color` set on `:root` / `body`
- `sr-only` utility class defined in `utilities.css`
- `scroll-behavior: smooth` applied globally
- No hex values hardcoded outside `global.css`

**Verification:**

- `vp dev` — page background is `#080808`, no white flash
- Browser DevTools confirms fonts loading from local (not Google Fonts CDN)
- `vp check` passes

**Dependencies:** Task 0

**Files touched:**

- `src/styles/global.css` _(create)_
- `src/styles/animations.css` _(create)_
- `src/styles/utilities.css` _(create)_
- `src/main.ts`

**Estimated scope:** Small

---

#### Task 2: GSAP registration utility

**Description:** Create `src/utils/gsap.ts` which imports GSAP core and registers the ScrollTrigger plugin. This is the single import point for GSAP across the entire project — no component or composable imports GSAP directly from the `gsap` package.

**Acceptance criteria:**

- `gsap` and `ScrollTrigger` exported from `src/utils/gsap.ts`
- `gsap.registerPlugin(ScrollTrigger)` called once at module level
- No other file in the project imports from `'gsap'` directly — all import from `'@/utils/gsap'` _(test smoke uses a relative import to the same module for type-check)_

**Verification:**

- `vp build` — no duplicate GSAP registration warnings
- `vp check` passes

**Dependencies:** Task 0

**Files touched:**

- `src/utils/gsap.ts` _(create)_

**Estimated scope:** XS

---

#### Task 3: TypeScript interfaces

**Description:** Define all TypeScript interfaces in `src/types/portfolio.ts`. These mirror the Zod schemas in `portfolio.config.ts` and are used for component props and template type safety.

**Interfaces to define:** `Project`, `Role`, `Experience`, `Award`, `SkillGroup`, `Education`, `PortfolioLinks`, `PortfolioConfig`

**Acceptance criteria:**

- All interfaces defined with correct field names and types matching SPEC data model
- No use of `any` — all fields explicitly typed
- Optional fields marked with `?`
- File exports all interfaces as named exports

**Verification:**

- `vp check` — no type errors

**Dependencies:** Task 0

**Files touched:**

- `src/types/portfolio.ts` _(create)_

**Estimated scope:** Small

---

#### Task 4: Data layer — `portfolio.config.ts` with Zod validation

**Description:** Create `src/data/portfolio.config.ts` — the single source of truth for all portfolio content. Define all Zod schemas and parse the full config object with real data. If Zod throws, the error message must identify the invalid field path.

**Schemas to define:** `ProjectSchema`, `ExperienceSchema` (with nested `RoleSchema`), `SkillGroupSchema`, `AwardSchema`, `PortfolioConfigSchema`

**Full content to populate (from SPEC):**

- 5 projects: Requestr, Elementum, Visual AI, RocketLander, CreateFolio
- 1 company (AccionLabs) with 4 roles
- 1 award (Innovation & Engineering Excellence)
- 6 skill groups
- 1 education entry

**Acceptance criteria:**

- `PortfolioConfigSchema.parse(...)` succeeds without throwing
- All 5 projects populated with `id`, `title`, `tagline`, `description`, `stack`, `url`, `image`, `accentColor`, `year`
- All 4 AccionLabs roles populated with `title`, `period`, `location`, `highlights`
- `export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>` present
- Removing a required field causes Zod to throw with the field path in the error message
- No hex values used in components — only `accentColor` lives in config

**Verification:**

- `vp build` — no type errors
- Manually delete a required field and confirm Zod throws descriptively
- `vp check` passes

**Dependencies:** Tasks 2 (types)

**Files touched:**

- `src/data/portfolio.config.ts` _(create)_
- `src/types/portfolio.ts` _(may update)_

**Estimated scope:** Medium

---

#### Task 5: Composable scaffolds — `useScrollAnimations`, `useCustomCursor`, `useTheme`

**Description:** Create three composable files. `useScrollAnimations.ts` exports named animation functions (one per section) — for now each function is a stub that only sets up the `onUnmounted` cleanup. `useCustomCursor.ts` exports the cursor tracking logic shell. `useTheme.ts` is a no-op scaffold for future use (exports a placeholder function only).

**Acceptance criteria:**

- All three files exist and export named functions
- Each animation function in `useScrollAnimations.ts` calls `ScrollTrigger.getAll().forEach(t => t.kill())` in `onUnmounted`
- No GSAP animation logic yet — stubs only
- `useTheme.ts` exports an empty `useTheme()` function with a TODO comment
- All composables prefixed `use`\*

**Verification:**

- `vp check` passes — no TypeScript errors on the stubs

**Dependencies:** Tasks 2, 3

**Files touched:**

- `src/composables/useScrollAnimations.ts` _(create)_
- `src/composables/useCustomCursor.ts` _(create)_
- `src/composables/useTheme.ts` _(create)_

**Estimated scope:** Small

---

### Checkpoint: Phase 1

- `vp build` — zero errors, zero type errors
- `vp check` — exits 0
- `vp dev` — blank dark page with correct background color, fonts loaded
- `portfolio.config.ts` parse succeeds; all 5 projects, 4 roles, 6 skill groups present

---

### Phase 2: Layout Shell

---

#### Task 6: `App.vue` shell and section stubs

**Description:** Wire up `App.vue` as the root component. Import and render all section components in order. Create empty stub components for every section and layout component so the full render tree exists and the app compiles. Add correct section `id` attributes for anchor navigation.

**Section order:** `SiteHeader` → `HeroSection` → `ProjectsSection` → `ExperienceSection` → `AwardSection` → `SkillsSection` → `EducationSection` → `ContactSection` → `SiteFooter`

**Section IDs:** `#hero`, `#work`, `#experience`, `#skills`, `#contact`

**Acceptance criteria:**

- All 9 layout/section components imported and rendered in `App.vue`
- Each section stub renders a placeholder `<section>` with correct `id` attribute
- `<CustomCursor />` mounted as a global overlay in `App.vue`
- Page scrolls end-to-end without layout errors
- No section renders content yet — stubs only

**Verification:**

- `vp dev` — page renders, all section `id` anchors present in DOM
- `vp check` passes

**Dependencies:** Tasks 1–5

**Files touched:**

- `src/App.vue`
- `src/components/layout/SiteHeader.vue` _(create stub)_
- `src/components/layout/SiteFooter.vue` _(create stub)_
- `src/components/sections/HeroSection.vue` _(create stub)_
- `src/components/sections/ProjectsSection.vue` _(create stub)_
- `src/components/sections/ExperienceSection.vue` _(create stub)_
- `src/components/sections/AwardSection.vue` _(create stub)_
- `src/components/sections/SkillsSection.vue` _(create stub)_
- `src/components/sections/EducationSection.vue` _(create stub)_
- `src/components/sections/ContactSection.vue` _(create stub)_
- `src/components/ui/CustomCursor.vue` _(create stub)_

**Estimated scope:** Medium

---

#### Task 7: `SiteHeader` — fixed nav with scroll behavior and mobile hamburger

**Description:** Implement the full `SiteHeader` component. Fixed position, transparent on load, blurs on scroll. Hides on scroll-down, reveals on scroll-up via GSAP. Desktop: inline nav links. Mobile (<768px): hamburger toggle that opens a full-width drawer. Active section highlighting via `useIntersectionObserver`.

**Acceptance criteria:**

- `position: fixed`, full width, `z-index: 100`
- Background: transparent on load → `--color-bg` at 85% opacity + `backdrop-filter: blur` on scroll
- GSAP: translates `-100%` on scroll down, `0` on scroll up
- Left: `DKD` monogram in Bebas Neue, links to `#hero`
- Right: `Work · Experience · Skills · Contact` in DM Mono small caps; anchors `#work`, `#experience`, `#skills`, `#contact`
- Active nav link highlighted via `useIntersectionObserver` on each section
- Mobile (<768px): hamburger button visible; nav links hidden
- Hamburger opens full-width drawer; closes on link click or outside tap
- Hamburger has `aria-expanded` and `aria-controls`
- Fully keyboard navigable (tab order correct, focus rings visible)
- GSAP ScrollTrigger killed in `onUnmounted`

**Verification:**

- `vp dev` — scroll down → header hides; scroll up → header appears
- Resize to <768px — hamburger visible; click → drawer opens/closes
- Tab through nav — all links reachable via keyboard
- `vp check` passes

**Dependencies:** Task 6

**Files touched:**

- `src/components/layout/SiteHeader.vue`

**Estimated scope:** Medium

---

#### Task 8: `SiteFooter` — minimal copyright and social links

**Description:** Implement the minimal single-line `SiteFooter`. Copyright text left, icon links right. All external links with `rel="noopener noreferrer" target="_blank"`. Data sourced from `portfolio.config.ts`.

**Acceptance criteria:**

- `© 2026 Deepak Kumar Dewani` in DM Mono, `--color-muted`, left-aligned
- LinkedIn, GitHub, email icon links right-aligned
- Each icon link has `aria-label`
- All external links include `rel="noopener noreferrer" target="_blank"`
- No hardcoded URLs — all sourced from `portfolio.config.ts`

**Verification:**

- `vp dev` — footer renders at bottom of page
- Inspect links — `rel` attribute present on all external links
- `vp check` passes

**Dependencies:** Tasks 4, 6

**Files touched:**

- `src/components/layout/SiteFooter.vue`

**Estimated scope:** Small

---

#### Task 9: `SectionLabel` reusable UI component

**Description:** Implement the `SectionLabel` component used across sections for the `01 / WORK` style side labels. Accepts `index` (string, e.g. `"01"`) and `label` (string, e.g. `"WORK"`) props. Styled in DM Mono, `--color-muted`, small caps.

**Acceptance criteria:**

- Props typed with `defineProps<{ index: string; label: string }>()`
- Renders `{index} / {label}` in DM Mono, `--color-muted`
- No hardcoded content

**Verification:**

- `vp check` passes

**Dependencies:** Task 6

**Files touched:**

- `src/components/ui/SectionLabel.vue`

**Estimated scope:** XS

---

### Phase 3: Sections — Static Markup

_All sections in this phase render real content from `portfolio.config.ts` with correct layout and styling — no GSAP animations yet. Animations are layered in Phase 5._

---

#### Task 10: `HeroSection` — static layout

**Description:** Implement the hero static layout. Name split into individual `<span class="char">` elements for later GSAP targeting. Tagline below. Radial glow behind text. Scroll cue at bottom. No animations yet — elements are visible in their final state.

**Acceptance criteria:**

- `height: 100dvh`, full viewport
- `DEEPAK KUMAR DEWANI` rendered in Bebas Neue, large — intentionally clips viewport edges
- Each character wrapped in `<span class="char">` (manual split — not GSAP SplitText)
- Tagline `8 years. One company. Four promotions. 14 million users.` in DM Mono, below name
- Radial glow: `radial-gradient` from `--color-accent-dim` to transparent behind text
- Scroll cue: thin vertical line at bottom center with CSS pulse keyframe animation
- No photo, no image
- All content sourced from `portfolio.config.ts` (`name`, `tagline`)

**Verification:**

- `vp dev` — name fills viewport, tagline visible, scroll cue pulses
- `vp check` passes

**Dependencies:** Tasks 1, 4, 6

**Files touched:**

- `src/components/sections/HeroSection.vue`
- `src/styles/animations.css` _(add scroll cue keyframe)_

**Estimated scope:** Medium

---

#### Task 11: `ProjectCard` UI component

**Description:** Implement the `ProjectCard` component used inside each project scroll panel. Accepts a `Project` prop. Renders title, tagline, stack tags, screenshot, project counter, and live link. No scroll animation yet.

**Acceptance criteria:**

- Props: `defineProps<{ project: Project; index: number; total: number }>()`
- Renders: title (Bebas Neue), tagline (DM Mono), stack tags, screenshot (`<img loading="lazy">`), counter `01 / 05`
- Live link: `target="_blank"` + `rel="noopener noreferrer"`; hidden if `project.url` is undefined
- Screenshot: `alt` attribute set to project title
- Desktop: screenshot on right half; mobile: screenshot stacked below
- `accentColor` applied as a CSS variable passed via `:style` for panel tint

**Verification:**

- `vp check` passes

**Dependencies:** Tasks 3, 9

**Files touched:**

- `src/components/ui/ProjectCard.vue` _(create)_

**Estimated scope:** Small

---

#### Task 12: `ProjectsSection` — static layout

**Description:** Implement the projects section static layout. Each project gets a full-viewport panel. Sticky scroll setup (CSS only, no GSAP pinning yet). Render all 5 `ProjectCard` components with real data.

**Acceptance criteria:**

- Section `id="work"`, `position: relative`, `height: calc(5 * 100vh)`
- Each panel: `position: sticky; top: 0; height: 100vh`
- All 5 projects render with correct content and per-project accent tint
- All content sourced from `portfolio.config.ts`
- Mobile layout: screenshot stacked below text

**Verification:**

- `vp dev` — scroll through section, each panel sticks as expected
- All 5 project titles, taglines, and stacks visible
- `vp check` passes

**Dependencies:** Tasks 4, 6, 11

**Files touched:**

- `src/components/sections/ProjectsSection.vue`

**Estimated scope:** Medium

---

#### Task 13: `ExperienceSection` — static layout

**Description:** Implement the experience timeline static layout. Vertical timeline with thin `1px` left border. Company watermark at top. All 4 role cards rendered with title, period, location, and highlights. No animations yet — all content visible.

**Acceptance criteria:**

- `id="experience"` on section
- `ACCIONLABS` watermark: large, faded, behind timeline
- Thin `1px` left border for timeline track (using `--color-border`)
- 4 role cards, each with: title + period on one line, location, bullet highlights
- Roles ordered most-recent-first
- All content sourced from `portfolio.config.ts`

**Verification:**

- `vp dev` — timeline renders correctly, all 4 roles visible
- `vp check` passes

**Dependencies:** Tasks 4, 6

**Files touched:**

- `src/components/sections/ExperienceSection.vue`

**Estimated scope:** Medium

---

#### Task 14: `AwardSection` — static layout

**Description:** Implement the award section static layout. Full-width dark panel, centered award name in large Bebas Neue. Giant faded background text. Event, date, location in DM Mono below. No animation yet.

**Acceptance criteria:**

- Full viewport width, dark panel (`--color-surface`)
- `INNOVATION & ENGINEERING EXCELLENCE` as faded large background text (opacity ~0.05)
- Award title centered, large Bebas Neue, `--color-text`
- Event + date + location in DM Mono, `--color-muted`, small
- All content sourced from `portfolio.config.ts`

**Verification:**

- `vp dev` — award renders with watermark visible behind centered text
- `vp check` passes

**Dependencies:** Tasks 4, 6

**Files touched:**

- `src/components/sections/AwardSection.vue`

**Estimated scope:** Small

---

#### Task 15: `SkillOrbit` UI component — mobile tag list

**Description:** Implement `SkillOrbit` with the mobile tag list layout only. Group skill tags by category (`SkillGroup.label`). On mobile, render as stacked labeled groups of tags. The orbital desktop layout is implemented in Task 17 (after the static phase checkpoint).

**Acceptance criteria:**

- Accepts `skillGroups: SkillGroup[]` prop
- Renders category label + skill tags for each group
- Tags styled as pill badges in `--color-surface` with `--color-accent` text
- Layout visible and usable on mobile viewports

**Verification:**

- `vp dev` at mobile viewport — all skill groups and tags render correctly
- `vp check` passes

**Dependencies:** Tasks 3, 9

**Files touched:**

- `src/components/ui/SkillOrbit.vue` _(create)_

**Estimated scope:** Small

---

#### Task 16: `SkillsSection`, `EducationSection`, `ContactSection` — static layouts

**Description:** Implement the three remaining sections as static layouts.

**SkillsSection (`id="skills"`):**

- Uses `SkillOrbit` component with data from `portfolio.config.ts`
- For now renders tag list layout (orbital added in Task 17)

**EducationSection:**

- Single centered card: institution, degree, period, location
- All content from `portfolio.config.ts`

**ContactSection (`id="contact"`):**

- Full-width dark section
- `GET IN TOUCH` in Bebas Neue, links to `mailto:deepakkumardewani@gmail.com`
- LinkedIn, GitHub, website as DM Mono links
- All external links: `rel="noopener noreferrer" target="_blank"`

**Acceptance criteria:**

- All three sections render with real data from `portfolio.config.ts`
- Contact section has no form
- External links have `rel="noopener noreferrer"`
- Education card is centered, minimal, no animations yet

**Verification:**

- `vp dev` — all three sections render, contact email link works
- `vp check` passes

**Dependencies:** Tasks 4, 6, 15

**Files touched:**

- `src/components/sections/SkillsSection.vue`
- `src/components/sections/EducationSection.vue`
- `src/components/sections/ContactSection.vue`

**Estimated scope:** Medium

---

### Checkpoint: Phase 3 — Static Site Complete

- `vp build` — zero errors, zero type errors
- `vp check` — exits 0
- `vp dev` — all 9 sections render with real content
- All content sourced from `portfolio.config.ts` — no hardcoded text in any component
- Mobile layout renders correctly at 375px viewport
- All external links have `rel="noopener noreferrer"`
- Sticky project panels work (CSS only)

---

### Phase 4: Skills Orbital (Desktop)

---

#### Task 17: `SkillOrbit` — orbital CSS 3D system with mouse parallax

**Description:** Extend `SkillOrbit` with the desktop orbital layout. One center node `"8+ years"`, 6 category satellites positioned via CSS 3D transforms + Vue computed positions. Mouse parallax via `useMouseInElement` tilts the orbit plane ±5°. Hover on a category node expands its skills with GSAP. Mobile tag list from Task 15 is preserved via `@media (hover: none)` detection.

**Acceptance criteria:**

- [x] Desktop (pointer device): orbital system rendered with center node + 6 satellites
- [x] Satellite positions computed in Vue using trigonometry — no canvas, no Three.js
- [x] Mouse parallax: orbit plane tilts ±5° toward cursor via `useMouseInElement`
- [x] Hover on satellite: skill tags expand outward via GSAP `scale` animation
- [x] Mobile / touch (`@media (hover: none)`): tag list from Task 15 shown; orbital hidden
- [x] `prefers-reduced-motion` check: if reduced motion, skip tilt and expansion animations
- [x] GSAP cleanup in `onUnmounted`

**Verification:**

- [x] `vp dev` on desktop — orbital renders, moves with mouse, hover expands skills
- [x] Resize to mobile — collapses to tag groups
- [x] DevTools: simulate `prefers-reduced-motion: reduce` — no tilt/expansion animations
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 15

**Files touched:**

- `src/components/ui/SkillOrbit.vue`
- `src/composables/useScrollAnimations.ts` _(add skills hover animation)_

**Estimated scope:** Large

---

### Phase 5: GSAP Animations

_All sections are already rendering correct static content. This phase layers scroll-driven animations on top using the composable stubs from Task 5._ **Complete.**

---

#### Task 18: `useCustomCursor` and `CustomCursor` component

**Description:** Implement the custom crosshair cursor. `useCustomCursor` composable tracks mouse position reactively. `CustomCursor` component renders the crosshair overlay with magnetic pull toward interactive elements (`a`, `button`). `cursor: none` already set on `body` in Task 1.

**Acceptance criteria:**

- [x] Crosshair renders at mouse position smoothly (GSAP quickSetter for performance)
- [x] Magnetic pull: cursor snaps toward nearest interactive element on hover
- [x] Degrades on touch devices: component renders `display: none` when `hover: none` media matches
- [x] `prefers-reduced-motion`: skip GSAP quickSetter, use direct position update
- [x] `onUnmounted` cleanup removes event listeners

**Verification:**

- [x] `vp dev` — custom cursor follows mouse, magnetic pull works on links/buttons
- [x] Mobile viewport — custom cursor not visible
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 6

**Files touched:**

- `src/components/ui/CustomCursor.vue`
- `src/composables/useCustomCursor.ts`

**Estimated scope:** Medium

---

#### Task 19: Hero animation — character stagger on mount

**Description:** Implement the hero name stagger animation in `useScrollAnimations.ts`. Characters (`.char` spans) animate from `y: 80, opacity: 0` to `y: 0, opacity: 1` with stagger on mount. Tagline fades in after name completes.

**Acceptance criteria:**

- [x] `useHeroAnimation(nameEl, taglineEl)` exported from `useScrollAnimations.ts`
- [x] GSAP `fromTo` on `.char` spans: `y: 80 → 0`, `opacity: 0 → 1`, duration 0.4s, stagger 0.02s, `ease: 'power4.out'`
- [x] Tagline fades in after name animation completes (`delay` or timeline)
- [x] `prefers-reduced-motion`: elements set to final state immediately, no animation
- [x] `onUnmounted` cleanup

**Verification:**

- [x] `vp dev` — page load: name characters stagger in, tagline fades after
- [x] DevTools: `prefers-reduced-motion: reduce` — elements visible immediately
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 10

**Files touched:**

- `src/composables/useScrollAnimations.ts`
- `src/components/sections/HeroSection.vue`

**Estimated scope:** Small

---

#### Task 20: Projects section — GSAP scroll-driven panel animations

**Description:** Implement GSAP ScrollTrigger animations for each project panel. On scroll into panel: project title slides up, stack tags appear, screenshot scales `80% → 100%`.

**Acceptance criteria:**

- [x] `useProjectsAnimation(sectionEl)` exported from `useScrollAnimations.ts`
- [x] Per-panel: title slides up (`y: 40 → 0`, `opacity: 0 → 1`), stack tags fade in sequentially, screenshot scales `0.8 → 1`
- [x] ScrollTrigger trigger: each panel's scroll position
- [x] `prefers-reduced-motion`: elements at final state, no animation
- [x] `onUnmounted` cleanup

**Verification:**

- [x] `vp dev` — scroll through projects: each panel animates in correctly
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 12

**Files touched:**

- `src/composables/useScrollAnimations.ts`
- `src/components/sections/ProjectsSection.vue`

**Estimated scope:** Medium

---

#### Task 21: Experience section — timeline reveal animations

**Description:** Implement GSAP ScrollTrigger animations for the experience timeline. Role cards slide in from left on scroll. Highlights fade in sequentially within each card.

**Acceptance criteria:**

- [x] `useExperienceAnimation(sectionEl)` exported from `useScrollAnimations.ts`
- [x] Role cards: `x: -20 → 0`, `opacity: 0 → 1` on scroll-enter
- [x] Highlights within each card fade in sequentially after card enters
- [x] `prefers-reduced-motion`: elements at final state
- [x] `onUnmounted` cleanup

**Verification:**

- [x] `vp dev` — scroll into experience: cards slide in, highlights sequence
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 13

**Files touched:**

- `src/composables/useScrollAnimations.ts`
- `src/components/sections/ExperienceSection.vue`

**Estimated scope:** Small

---

#### Task 22: Award section — blur-assemble animation

**Description:** Implement the award section blur-assemble GSAP animation. On scroll-enter, text assembles from `blur(20px) → blur(0)` with `opacity: 0 → 1`.

**Acceptance criteria:**

- [x] `useAwardAnimation(sectionEl)` exported from `useScrollAnimations.ts`
- [x] Award title + event details: `filter: blur(20px) → blur(0)`, `opacity: 0 → 1`
- [x] `prefers-reduced-motion`: fade only (`blur` skipped), no motion
- [x] `onUnmounted` cleanup

**Verification:**

- [x] `vp dev` — scroll into award: text assembles from blur
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 14

**Files touched:**

- `src/composables/useScrollAnimations.ts`
- `src/components/sections/AwardSection.vue`

**Estimated scope:** Small

---

#### Task 23: Header scroll-hide/show animation

**Description:** Wire the `SiteHeader` scroll behavior to GSAP ScrollTrigger (or `useScroll` from VueUse). Translate `-100%` on scroll down, `0` on scroll up. Background blur transition on scroll.

**Acceptance criteria:**

- [x] Header hides (`translateY(-100%)`) within 100px of scroll-down start
- [x] Header reappears (`translateY(0)`) immediately on scroll-up
- [x] Background blur triggers after scrolling > 50px from top
- [x] GSAP cleanup in `onUnmounted`
- [x] `prefers-reduced-motion`: header always visible, skip translate animation

**Verification:**

- [x] `vp dev` — scroll down → header hides; scroll up → header reappears
- [x] `vp check` passes

**Dependencies:** Tasks 2, 5, 7

**Files touched:**

- `src/components/layout/SiteHeader.vue`
- `src/composables/useScrollAnimations.ts`

**Estimated scope:** Small

---

### Checkpoint: Phase 5 — Animations Complete

- [x] `vp build` — zero errors
- [x] `vp check` — exits 0
- [x] All section animations trigger correctly on scroll
- [x] Custom cursor works on desktop, hidden on mobile
- [x] `prefers-reduced-motion: reduce` — all animations disabled / instant
- [x] GSAP not leaking: open DevTools → navigate away from dev → no ScrollTrigger errors

---

### Phase 6: Testing

---

#### Task 24: Unit tests — `portfolio.config.ts` Zod validation

**Description:** Write Vitest tests for the data layer. Tests validate that the Zod schema correctly accepts valid data and rejects invalid data with descriptive errors.

**Tests to write:**

- Parse succeeds with full valid config
- All 5 projects present with required fields
- Invalid email throws Zod error with field path
- Missing required field (e.g., `name`) throws Zod error
- Invalid URL in `links.linkedin` throws Zod error
- `url` field on project accepts `undefined` without throwing

**Acceptance criteria:**

- [x] All 6 test cases pass
- [x] Coverage on `src/data/` ≥ 80%
- [x] `vp test --run` exits 0

**Verification:**

- [x] `vp test --run` — all tests pass

**Dependencies:** Task 4

**Files touched:**

- `tests/portfolio.config.test.ts` _(create)_

**Estimated scope:** Small

---

#### Task 25: Unit tests — `useScrollAnimations` composable cleanup

**Description:** Write Vitest tests for the scroll animation composables. Focus on verifying that GSAP ScrollTrigger cleanup runs on `onUnmounted`.

**Tests to write:**

- `useHeroAnimation`: `ScrollTrigger.getAll().forEach(t => t.kill())` called on unmount
- `useExperienceAnimation`: cleanup called on unmount
- `useProjectsAnimation`: cleanup called on unmount

**Acceptance criteria:**

- [x] All 3 cleanup tests pass
- [x] GSAP is mocked in tests (no real DOM required)
- [x] Coverage on `src/composables/` ≥ 80%
- [x] `vp test --run` exits 0

**Verification:**

- [x] `vp test --run` — all tests pass

**Dependencies:** Tasks 5, 19–22

**Files touched:**

- `tests/composables/useScrollAnimations.test.ts` _(create)_

**Estimated scope:** Small

---

### Checkpoint: Phase 6 — Tests

- [x] `vp test --run` — all tests pass, 0 failures
- [x] Coverage ≥ 80% on `src/data/` and `src/composables/` (enforced via `vite.config.ts` — run `bun run test -- --run --coverage`)

---

### Phase 7: Polish and Assets

**Status: complete** _(Tasks 26–28)_

---

#### Task 26: `favicon.svg` — DKD monogram

**Description:** Create `public/favicon.svg` with the DKD monogram. Confirm style with Deepak before implementing (see Open Question #6 in PRD). Default: stacked "DKD" in Bebas Neue on `--color-accent` (`#6366f1`) background circle.

**Acceptance criteria:**

- [x] Valid SVG at `public/favicon.svg`
- [x] Renders correctly in browser tab
- [x] Referenced in `index.html` `<link rel="icon">`

**Verification:**

- [x] `vp dev` — browser tab shows DKD favicon

**Dependencies:** Task 0

**Files touched:**

- `public/favicon.svg` _(create)_
- `index.html`

**Estimated scope:** XS

---

#### Task 27: OG image and meta tags

**Description:** Add Open Graph and Twitter card meta tags to `index.html`. Create or place `public/og-image.png` (1200×630px — provide designed PNG; see Open Question #4 in PRD). Add site description, title, and canonical URL.

**Acceptance criteria:**

- [x] `og:title`, `og:description`, `og:image`, `og:url` meta tags present in `index.html`
- [x] `twitter:card`, `twitter:title`, `twitter:image` present
- [x] `public/og-image.png` exists at 1200×630px
- [x] `<title>Deepak Kumar Dewani — Senior Frontend Engineer</title>` in `index.html`

**Verification:**

- [x] `vp build` — meta tags present in `/dist/index.html`

**Dependencies:** Task 0

**Files touched:**

- `index.html`
- `public/og-image.png` _(place manually)_

**Estimated scope:** XS

---

#### Task 28: Accessibility audit and keyboard navigation pass

**Description:** Audit the full site for accessibility. Verify keyboard navigation, focus rings, ARIA attributes, semantic HTML, and `alt` text.

**Checklist:**

- [x] Tab through entire page — all interactive elements reachable
- [x] Focus rings visible on all focusable elements
- [x] All `<img>` have `alt` attributes
- [x] `<nav>` wraps header navigation
- [x] `<main>` wraps content sections
- [x] Hamburger button has `aria-expanded` and `aria-controls`
- [x] Icon-only links have `aria-label`
- [x] Section headings follow correct `h1` → `h2` → `h3` hierarchy
- [x] `prefers-reduced-motion: reduce` verified in DevTools

**Verification:**

- [x] Lighthouse Accessibility score = 100 _(run in Chrome DevTools on production build)_
- [x] `vp check` passes

**Dependencies:** Tasks 7–23

**Files touched:**

- Multiple components as needed for fixes

**Estimated scope:** Medium

---

### Final Checkpoint: Ship

- `vp build` — zero errors, zero type errors
- `vp check` — exits 0
- `vp test --run` — all tests pass
- Lighthouse: Performance ≥ 95, Accessibility = 100, Best Practices = 100
- LCP < 2.5s on simulated 4G
- CLS = 0
- All 5 project panels render with correct content and animations
- Orbital skills responds to mouse on desktop; degrades to tag list on mobile
- `prefers-reduced-motion: reduce` — all animations disabled
- `portfolio.config.ts` edit → `vp dev` hot reload reflects change in UI
- Zod throws descriptively if required field removed from config
- Keyboard navigation works end-to-end
- Custom cursor active on desktop, hidden on mobile
- All external links have `rel="noopener noreferrer"`

---

## Risks and Mitigations

| Risk                                              | Impact | Mitigation                                                                                                          |
| ------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| `vp create --template vue-ts` flag syntax differs | High   | Run `vp create --help` first to confirm exact template flag; fallback: scaffold manually from Vue 3 + Vite template |
| GSAP SplitText requires Club license              | Low    | Task 10 uses manual `<span class="char">` split — no SplitText dependency                                           |
| CLS from `font-display: swap` flash               | High   | Task 1 sets `font-display: swap`; verify CLS = 0 in Lighthouse before deploy                                        |
| Orbital skills perf on mid-range devices          | Medium | Use `will-change: transform` on orbital elements; test on real device before Task 29                                |
| GSAP ScrollTrigger memory leaks                   | High   | Task 25 tests cleanup; enforced in every animation task                                                             |
| Project screenshots missing at Task 12            | Medium | Use placeholder images in `/public/projects/` for development; replace before Task 29                               |

## Open Questions (resolve before starting affected task)

| #   | Question                                                            | Blocks       | Priority |
| --- | ------------------------------------------------------------------- | ------------ | -------- |
| 1   | Exact `vp create` template flag for Vue + TypeScript                | Task 0       | Critical |
| 2   | Where does photo appear? Header? Contact? Both?                     | Task 7 or 16 | High     |
| 3   | Is `deepakd.me` pointed at Vercel already?                          | Task 29      | High     |
| 4   | OG image: custom PNG provided, or generate?                         | Task 27      | High     |
| 5   | Are all 5 project screenshots available at `/public/projects/`?     | Task 12      | High     |
| 6   | Favicon style: stacked DKD, ligature, or monogram on accent circle? | Task 26      | Medium   |
| 7   | Smooth scroll: CSS global or per-link GSAP?                         | Task 1       | Low      |
