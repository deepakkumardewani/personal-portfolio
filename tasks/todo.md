# Portfolio build tasks (from `agent-docs/TASKS.md`)

## Phase 0: Project Setup

### Task 0: Scaffold Vue + TypeScript project with Vite+ and install all dependencies

**Acceptance criteria:** _(see `agent-docs/TASKS.md`; all checked)_

**Test targets:** `src/setup-dependencies.test.ts` — dependency import smoke

- [x] Impl
- [x] Test

**Dependencies:** None

---

## Phase 1: Foundation

Tasks 1–5: **Impl** and **acceptance** tracked in `agent-docs/TASKS.md` (all checkboxes for Phase 0–1 and the Phase 1 checkpoint are complete).

- [x] Task 1 — Global styles, fonts
- [x] Task 2 — `src/utils/gsap.ts`
- [x] Task 3 — `src/types/portfolio.ts`
- [x] Task 4 — `src/data/portfolio.config.ts`
- [x] Task 5 — composable scaffolds

---

## Phase 2: Layout Shell (Tasks 6–9)

Completed — details and checkboxes in `agent-docs/TASKS.md`.

- [x] Task 6 — `App.vue` shell and section stubs
- [x] Task 7 — `SiteHeader` (fixed nav, scroll, mobile drawer)
- [x] Task 8 — `SiteFooter` (config-driven links and copyright)
- [x] Task 9 — `SectionLabel` UI

## Phase 3: Sections — static markup (Tasks 10–16)

Completed (see `agent-docs/TASKS.md` and Phase 3 checkpoint).

- [x] Task 10 — `HeroSection` static layout
- [x] Task 11 — `ProjectCard` UI
- [x] Task 12 — `ProjectsSection` static layout
- [x] Task 13 — `ExperienceSection` static layout
- [x] Task 14 — `AwardSection` static layout
- [x] Task 15 — `SkillOrbit` mobile tag list
- [x] Task 16 — `SkillsSection`, `EducationSection`, `ContactSection`

**Tests added:** `HeroSection.test.ts`, `ProjectCard.test.ts`, `phase3-sections.test.ts`

## Phase 4: Skills Orbital (Desktop) — Task 17

- [x] Impl
- [x] Test (see `SkillOrbit.test.ts`, `skillOrbitLayout.test.ts`)

**Dependencies:** Tasks 2, 5, 15 (complete in `agent-docs/TASKS.md`)

## Phase 5: GSAP Animations (Tasks 18–23) — complete

Details and checkboxes in `agent-docs/TASKS.md`.

- [x] Task 18 — `useCustomCursor` + `CustomCursor`
- [x] Task 19 — Hero stagger + tagline
- [x] Task 20 — Projects ScrollTrigger panels
- [x] Task 21 — Experience timeline
- [x] Task 22 — Award blur-assemble
- [x] Task 23 — Header scroll hide/show

**Tests added:** `useScrollAnimations.phase5.test.ts`, `useCustomCursor.test.ts`

## Phase 6+ (next)

See `agent-docs/TASKS.md` for config tests, polish, deploy.
