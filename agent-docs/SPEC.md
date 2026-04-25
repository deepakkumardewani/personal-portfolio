# Spec: Deepak Kumar Dewani — Personal Portfolio Website

## Objective

Build a personal portfolio website for Deepak Kumar Dewani, a Senior Frontend Engineer with 8+ years of
experience. The site must function as a high-conversion personal brand asset that serves three audiences
simultaneously: recruiters/hiring managers, potential freelance clients, and the developer community.

**The single design mandate:** When anyone lands on this site, they must immediately feel they are looking
at the work of a craftsperson — not a resume page, not an AI-generated template. The website _itself_ is
the proof of skill. No visitor should leave without having scrolled through the entire page.

**What success looks like:**

- A recruiter shares the URL with their team unprompted
- A peer developer says "who made this?" in a Slack channel
- Any visitor can feel the seniority and taste within 3 seconds of landing

---

## Tech Stack

| Layer              | Choice                                                               | Rationale                                                               |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Toolchain          | Vite+ (`vp`)                                                         | User's explicit choice; unified CLI (Vite + Vitest + Oxlint + Rolldown) |
| Framework          | Vue 3 (Composition API + `<script setup>`)                           | User's primary expertise; showcase the stack                            |
| Language           | TypeScript (strict mode)                                             | Non-negotiable for a senior FE portfolio                                |
| Styling            | Plain CSS custom properties + scoped `<style>` blocks                | No Tailwind — custom CSS is itself a craft signal                       |
| Animation          | GSAP 3 + ScrollTrigger plugin                                        | Level-5 animation brief; most capable scroll animation lib              |
| Reactivity helpers | VueUse (`useMouseInElement`, `useScroll`, `useIntersectionObserver`) | Clean reactive hooks for mouse parallax + scroll state                  |
| Data layer         | `src/data/portfolio.config.ts` (typed, exported object)              | Single file to update — no CMS, no API, no friction                     |
| Validation         | Zod (inline schema for config type safety)                           | Catches malformed data before build                                     |
| Testing            | Vitest + Vue Test Utils                                              | Bundled with Vite+; test composables and config parsing                 |
| Deployment         | Vercel (static SPA)                                                  | Zero-config for Vite; user's confirmed target                           |
| Font strategy      | `@fontsource` packages (self-hosted)                                 | No Google Fonts network call; full control; better privacy              |

**Fonts chosen:**

- Display / Hero: `Bebas Neue` — tall, condensed, typographic authority
- Body: `DM Mono` — monospaced precision, signals engineering background
- UI labels: `Instrument Sans` — clean, contemporary, not overused

**Color palette (CSS custom properties):**

```css
--color-bg: #080808; /* near-black, not pure */
--color-surface: #111111; /* card/panel surfaces */
--color-border: #1e1e1e; /* subtle borders */
--color-text: #f0ede8; /* off-white, not harsh */
--color-muted: #6b6b6b; /* secondary text */
--color-accent: #6366f1; /* electric indigo — primary CTA, highlights */
--color-accent-dim: #6366f122; /* accent at low opacity for glows */
--color-white: #ffffff;
```

---

## Commands

```bash
# Install Vite+ globally (one-time)
curl -fsSL https://vite.plus | bash

# Create project
vp create

# Install dependencies
vp install

# Development server (hot reload)
vp dev

# Type-check + lint + format (run before committing)
vp check

# Run unit tests
vp test

# Production build (outputs to /dist)
vp build

# Preview production build locally
vp preview

# Deploy (Vercel CLI, after vp build)
vercel --prod
```

---

## Project Structure

```
/
├── public/
│   ├── favicon.svg              # Custom SVG favicon (initials DKD)
│   ├── og-image.png             # Open Graph image for social sharing
│   └── fonts/                   # Fallback if @fontsource not used
│
├── src/
│   ├── main.ts                  # App entry point
│   ├── App.vue                  # Root component, imports sections
│   │
│   ├── data/
│   │   └── portfolio.config.ts  # ← SINGLE SOURCE OF TRUTH for all content
│   │
│   ├── types/
│   │   └── portfolio.ts         # TypeScript interfaces (Project, Experience, etc.)
│   │
│   ├── composables/
│   │   ├── useScrollAnimations.ts   # GSAP ScrollTrigger setup per section
│   │   ├── useCustomCursor.ts       # Crosshair cursor with magnetic pull
│   │   └── useTheme.ts              # (future) dark/light toggle hook
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.vue       # Fixed nav, hides on scroll-down, shows on scroll-up
│   │   │   └── SiteFooter.vue       # Minimal: copyright + links
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroSection.vue      # Full-viewport, name assembly animation, one punchy line
│   │   │   ├── ProjectsSection.vue  # Fullscreen scroll-takeover per project
│   │   │   ├── ExperienceSection.vue# GSAP-revealed vertical timeline
│   │   │   ├── AwardSection.vue     # Own dedicated moment between Experience + Skills
│   │   │   ├── SkillsSection.vue    # Orbital canvas (CSS 3D transforms + VueUse mouse)
│   │   │   ├── EducationSection.vue # Clean minimal card
│   │   │   └── ContactSection.vue   # Full-width, email + social links
│   │   │
│   │   └── ui/
│   │       ├── CustomCursor.vue     # Global crosshair cursor overlay
│   │       ├── SectionLabel.vue     # Reusable "01 / WORK" side label
│   │       ├── ProjectCard.vue      # Used inside ProjectsSection scroll panels
│   │       └── SkillOrbit.vue       # The orbital skills canvas component
│   │
│   ├── styles/
│   │   ├── global.css           # CSS reset, custom properties, base typography
│   │   ├── animations.css       # Keyframe definitions
│   │   └── utilities.css        # Reusable utility classes (sr-only, etc.)
│   │
│   └── utils/
│       └── gsap.ts              # GSAP + plugins registration (import once)
│
├── tests/
│   ├── portfolio.config.test.ts # Validates config shape with Zod
│   └── composables/
│       └── useScrollAnimations.test.ts
│
├── vite.config.ts               # Vite config (aliases, plugins)
├── tsconfig.json
├── .eslintrc (oxlint config)
└── SPEC.md                      # This file — committed to repo
```

---

## Data Layer: `portfolio.config.ts`

This is the only file Deepak edits to update his portfolio. It exports a single typed object validated by Zod.

```typescript
// src/data/portfolio.config.ts
import { z } from "zod";

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(), // One punchy sentence
  description: z.string(),
  stack: z.array(z.string()),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  image: z.string(), // Path to /public/projects/*.png
  accentColor: z.string(), // Per-project accent for the takeover panel
  year: z.number(),
});

const ExperienceSchema = z.object({
  company: z.string(),
  roles: z.array(
    z.object({
      title: z.string(),
      period: z.string(),
      location: z.string(),
      highlights: z.array(z.string()),
    }),
  ),
});

const SkillGroupSchema = z.object({
  label: z.string(), // e.g. "Frontend", "Testing"
  skills: z.array(z.string()),
});

const AwardSchema = z.object({
  title: z.string(),
  event: z.string(),
  date: z.string(),
  location: z.string(),
});

const PortfolioConfigSchema = z.object({
  name: z.string(),
  title: z.string(), // "Senior Frontend Engineer"
  tagline: z.string(), // Hero punchy line
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  photo: z.string().optional(), // Path to photo in /public
  links: z.object({
    linkedin: z.string().url(),
    github: z.string().url(),
    website: z.string().url().optional(),
  }),
  projects: z.array(ProjectSchema),
  experience: z.array(ExperienceSchema),
  award: AwardSchema,
  skillGroups: z.array(SkillGroupSchema),
  education: z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string(),
    period: z.string(),
  }),
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

export const portfolio = PortfolioConfigSchema.parse({
  name: "Deepak Kumar Dewani",
  title: "Senior Frontend Engineer",
  tagline: "8 years. One company. Four promotions. 14 million users.",
  email: "deepakkumardewani@gmail.com",
  phone: "+91-8308887772",
  location: "Mumbai, India",
  photo: "/photo.jpg",
  links: {
    linkedin: "https://linkedin.com/in/deepakkumardewani",
    github: "https://github.com/deepakkumardewani",
    website: "https://deepakd.me",
  },
  projects: [
    {
      id: "requestr",
      title: "Requestr",
      tagline: "A Postman alternative that lives entirely in your browser.",
      description:
        "Fully browser-native API testing tool with zero backend. All data persisted in IndexedDB, requests proxied via server-side route to eliminate CORS entirely. Multi-tab workspace with collections, drag-and-drop, environment variable interpolation, cURL import/export, and Postman v2.1-compatible collection format.",
      stack: [
        "Next.js 15",
        "React 19",
        "Tailwind",
        "Zustand",
        "IndexedDB",
        "CodeMirror 6",
        "shadcn/ui",
      ],
      url: "https://requestr-api.vercel.app",
      image: "/projects/requestr.png",
      accentColor: "#6366f1",
      year: 2024,
    },
    {
      id: "elementum",
      title: "Elementum",
      tagline: "The periodic table, rebuilt for people who care about craft.",
      description:
        "High-performance interactive periodic table with real-time search, dynamic heatmaps, 3D atom visualisations, and side-by-side element comparison. Lighthouse score of 100 and LCP under 200ms.",
      stack: ["Vue 3", "TypeScript", "Vite", "Three.js", "Pinia", "ApexCharts"],
      url: "https://elementum-periodic-table.vercel.app",
      image: "/projects/elementum.png",
      accentColor: "#10b981",
      year: 2023,
    },
    {
      id: "visual-ai",
      title: "Visual AI",
      tagline: "Production AI SaaS. Auth, payments, queues — the full stack.",
      description:
        "Production AI SaaS with Clerk auth and Razorpay payments. Node.js backend with Redis job queues and Docker CI/CD. Achieved 99.9% uptime.",
      stack: ["Vue 3", "TypeScript", "Node.js", "Redis", "Razorpay", "Docker"],
      url: "https://visual-ai.app",
      image: "/projects/visual-ai.png",
      accentColor: "#f59e0b",
      year: 2023,
    },
    {
      id: "rocketlander",
      title: "RocketLander",
      tagline: "Physics. Particles. Firebase. 60 FPS.",
      description:
        "Physics-based browser game with Firebase real-time leaderboard. Consistently maintaining 60 FPS with optimised particle systems.",
      stack: ["Vue 3", "TypeScript", "Three.js", "Pinia", "Firebase"],
      url: "https://rocketlander.in",
      image: "/projects/rocketlander.png",
      accentColor: "#ef4444",
      year: 2022,
    },
    {
      id: "createfolio",
      title: "CreateFolio",
      tagline: "Portfolio generator. Pick a template. Ship in minutes.",
      description:
        "Portfolio generator with multi-step forms, template selection, Appwrite auth, and one-click CI/CD deployment to Netlify.",
      stack: ["Next.js", "TypeScript", "Vite", "Appwrite"],
      url: "https://createfolio.app",
      image: "/projects/createfolio.png",
      accentColor: "#8b5cf6",
      year: 2022,
    },
  ],
  experience: [
    {
      company: "AccionLabs",
      roles: [
        {
          title: "Senior Frontend Engineer",
          period: "Nov 2023 — Present",
          location: "Mumbai",
          highlights: [
            "Architected production-grade React + TypeScript component libraries for enterprise applications, establishing component-driven standards adopted across the engineering org",
            "Led AI-first engineering workflow using Claude Code and GitHub Copilot with reusable prompt templates for tests, reviews, and commits — cutting sprint delivery time by ~30%",
            "Achieved 90% test coverage across production apps using Jest and React Testing Library, reducing regression incidents and building a culture of automated validation",
            "Optimised bundle performance via tree-shaking, dynamic imports, and Vite pipelines — delivering sub-2s load times on data-heavy dashboards including maps, tables, and reporting modules",
            "Established PR standards and led architecture discussions across a distributed team, elevating code consistency and reducing review cycle time",
          ],
        },
        {
          title: "Frontend Engineer",
          period: "Dec 2020 — Oct 2023",
          location: "Mumbai",
          highlights: [
            "Led end-to-end development of Nexial UI using Vue.js and TypeScript — transforming a terminal-based platform into a production GUI and migrating Excel workflows to structured JSON, significantly reducing operator task time",
            "Built scalable, reusable Vue component systems following advanced design patterns, establishing modular architecture that improved maintainability across the platform",
            "Collaborated with UX/UI designers to deliver pixel-perfect, accessible interfaces across multiple frontend modules",
          ],
        },
        {
          title: "Frontend Developer",
          period: "Sep 2019 — Nov 2020",
          location: "Mumbai",
          highlights: [
            "Delivered bill payments and real-time notifications using React — directly contributing to a $9M revenue increase and serving 14M+ active users at scale",
            "Designed and implemented GraphQL APIs to optimise data retrieval and eliminate over-fetching, significantly improving performance and frontend responsiveness",
            "Established automated testing practices using Jest and Mocha, enabling early bug detection and improving release confidence",
          ],
        },
        {
          title: "Junior Frontend Developer",
          period: "Aug 2017 — Aug 2019",
          location: "Mumbai",
          highlights: [
            "Engineered an AI-powered web assistant using Dialogflow with NLP workflows integrated via Node.js/Express REST APIs — deployed to 7,000+ internal users, boosting productivity by 20%",
            "Led mobile-first responsive UI development, driving a 42% increase in user engagement",
            "Drove adoption of Angular 2+ as the core framework, reducing development time by 58% and significantly improving team efficiency",
          ],
        },
      ],
    },
  ],
  award: {
    title: "Innovation & Engineering Excellence",
    event: "Accionlabs Innovation Summit",
    date: "February 2026",
    location: "Goa, India",
  },
  skillGroups: [
    {
      label: "Frontend",
      skills: [
        "React",
        "Next.js",
        "Vue.js",
        "Angular",
        "TypeScript",
        "JavaScript",
        "Tailwind",
        "CSS",
        "SASS",
        "MUI",
        "ShadCN",
        "Ant Design",
        "Vuetify",
      ],
    },
    {
      label: "State & Data",
      skills: ["Redux", "Pinia", "Jotai", "Tanstack Query", "GraphQL", "REST APIs"],
    },
    {
      label: "Testing",
      skills: ["Jest", "React Testing Library", "Vitest", "Cypress", "Playwright", "Mocha"],
    },
    {
      label: "Backend & Infra",
      skills: ["Node.js", "Express", "MongoDB", "Redis", "Docker", "CI/CD", "GitHub Actions"],
    },
    {
      label: "AI & Productivity",
      skills: ["Claude Code", "GitHub Copilot", "Cursor", "Prompt Engineering"],
    },
    {
      label: "Platforms",
      skills: ["Vercel", "Firebase", "Netlify", "DigitalOcean", "Cloudinary"],
    },
  ],
  education: {
    degree: "Bachelor of Technology in Computer Engineering",
    institution: "MPSTME, NMIMS",
    location: "Mumbai, India",
    period: "Jun 2013 — Jul 2017",
  },
});
```

---

## Section-by-Section Design & Animation Spec

### `SiteHeader`

- Fixed, `position: fixed`, full width, `z-index: 100`
- Background: transparent on load, blurs to `--color-bg` at 85% opacity on scroll
- Hides on scroll-down (translate -100%), reveals on scroll-up — GSAP ScrollTrigger
- Left: `DKD` monogram in `Bebas Neue`, links back to `#hero`
- Right: nav links `Work · Experience · Skills · Contact` — `DM Mono`, small caps; link to anchors `#work`, `#experience`, `#skills`, `#contact`
- Active section highlighted via `useIntersectionObserver` on each section
- **Mobile (< 768px):** nav links collapse to a hamburger toggle; links render in a full-width drawer that closes on link click or outside tap

### `HeroSection`

- Full viewport height (`100dvh`)
- Name `DEEPAK KUMAR DEWANI` in `Bebas Neue`, massive — clips the viewport edges intentionally
- Characters split and stagger-in on load: GSAP `SplitText` or manual span split, 400ms total, ease: `power4.out`
- Tagline underneath: `8 years. One company. Four promotions. 14 million users.` — in `DM Mono`, small, fades in after name
- Subtle radial glow behind text: `radial-gradient` from `--color-accent-dim` to transparent
- Bottom: a single animated scroll cue (not an arrow — a thin line that extends downward with a pulse)
- **No hero image. No photo here.** The typography IS the visual.

### `ProjectsSection`

- Section is `position: relative`, height = `(number of projects) * 100vh`
- Each project panel is `position: sticky; top: 0; height: 100vh` — GSAP ScrollTrigger pinning
- On scroll into each panel: project title slides up, stack tags appear, screenshot scales from 80% → 100%
- Per-project `accentColor` drives a background tint on the active panel
- Screenshot: full bleed on right half (desktop), stacked on mobile
- Bottom left: project number `01 / 05` in `DM Mono`
- Live link opens in new tab — no modal

### `ExperienceSection`

- All 4 roles at AccionLabs — this is the story of one company, one growth arc
- Vertical timeline: thin `1px` left border, role cards appear on scroll via GSAP `fromTo` (x: -20 → 0, opacity: 0 → 1)
- Each role: title + period on one line, then bullet highlights fade in sequentially on scroll
- Company name appears once at the top as a large watermark behind the timeline

### `AwardSection`

- Standalone full-viewport-width section between Experience and Skills
- Dark panel with the award name centered, large, `Bebas Neue`
- Subtle: `INNOVATION & ENGINEERING EXCELLENCE` fills the background as giant faded text
- Event name + date + location in small `DM Mono` below
- GSAP: text assembles from blur on scroll-enter (`filter: blur(20px) → blur(0)`, `opacity: 0 → 1`)

### `SkillsSection`

- An orbital system: one center node labeled `"8+ years"`, surrounded by 6 category satellites
- Each satellite has its skill tags orbiting it
- Implemented in pure CSS 3D transforms + Vue computed positions — no canvas, no Three.js (keeps bundle lean)
- Mouse parallax via `useMouseInElement` — the orbit plane tilts ±5deg toward cursor
- On hover of a category node: its skills expand outward with GSAP scale animation
- Mobile: collapses to grouped tag lists (the orbital layout requires pointer device)

### `EducationSection`

- One card, centered, minimal
- Institution name, degree, period, location
- No fluff — this section earns its place by being clean amid the animation-heavy surroundings

### `SiteFooter`

- Minimal single-line footer below `ContactSection`
- Left: copyright line `© 2026 Deepak Kumar Dewani` in `DM Mono`, `--color-muted`
- Right: icon links — LinkedIn, GitHub, email — each with `aria-label`
- All external links must include `rel="noopener noreferrer" target="_blank"`

### `ContactSection`

- Full-width section, dark; `id="contact"`
- Giant `GET IN TOUCH` in `Bebas Neue` — links to `mailto:`
- Below: LinkedIn + GitHub + website as monospaced links
- All external links: `rel="noopener noreferrer" target="_blank"`
- No contact form (reduces friction, matches senior engineer positioning — you don't fill out forms)

---

## Code Style

```typescript
// composables/useScrollAnimations.ts — example of style

import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation(nameEl: Ref<HTMLElement | null>) {
  onMounted(() => {
    if (!nameEl.value) return;

    const chars = nameEl.value.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power4.out",
      },
    );
  });

  onUnmounted(() => ScrollTrigger.getAll().forEach((t) => t.kill()));
}
```

**Conventions:**

- All composables prefixed `use*`
- Components: PascalCase files, kebab-case in templates
- CSS: BEM-ish inside scoped blocks — `.hero__title`, `.hero__tagline`
- No inline styles except GSAP-driven transforms
- Props typed with `defineProps<{...}>()`, never `PropType`
- `<script setup lang="ts">` on every component — no Options API
- Zod schema colocated with the data it validates

---

## Testing Strategy

**Framework:** Vitest (bundled via Vite+)

**What gets tested:**

- `portfolio.config.ts` — Zod parse must not throw; all required fields present; URLs valid
- Composables — `useScrollAnimations` cleanup called on unmount; no GSAP leaks
- Utilities — any helper functions in `src/utils/`

**What does NOT get tested:**

- Visual animation output (no value in testing GSAP values)
- Component snapshots (they break on every design iteration)

**Coverage target:** 80% on `src/data/` and `src/composables/`

```bash
vp test              # watch mode during dev
vp test --run        # single run (CI)
```

---

## Boundaries

**Always do:**

- Run `vp check` before every commit
- Keep all content in `portfolio.config.ts` — never hardcode text in components
- Use CSS custom properties for all colors — never hardcode hex values in components
- Lazy-load project screenshots with `loading="lazy"` on `<img>`
- Test Zod parse after any change to config schema
- Kill all GSAP ScrollTrigger instances in `onUnmounted`
- Add `rel="noopener noreferrer"` to every `target="_blank"` link
- Wrap all GSAP animations with a `prefers-reduced-motion` check — use `matchMedia('(prefers-reduced-motion: reduce)')` and provide instant/no-animation fallback
- Use `font-display: swap` for all `@fontsource` font imports to prevent invisible text flash

**Ask first:**

- Adding any new npm dependency (keep bundle lean — every dep is a choice)
- Changing the data shape in `portfolio.config.ts` (requires updating Zod schema + types)
- Adding a new section (affects scroll math and nav links)
- Changing fonts (affects perceived identity significantly)

**Never do:**

- Use `any` in TypeScript — use `unknown` or fix the type
- Add skill progress bars / percentage indicators
- Add a contact form
- Use Google Fonts (use `@fontsource` only)
- Use `!important` in CSS
- Commit with failing `vp check`
- Add loading spinners — if something loads, it loads fast or it's lazy

---

## Success Criteria

- [ ] `vp build` completes with zero errors and zero type errors
- [ ] `vp check` passes (lint + format + type-check)
- [ ] Lighthouse score ≥ 95 on Performance, 100 on Accessibility, 100 on Best Practices
- [ ] LCP < 2.5s on simulated 4G (Chrome DevTools)
- [ ] CLS = 0 (no layout shift from GSAP or font loading)
- [ ] All 5 projects render correctly in their scroll-takeover panels
- [ ] Orbital skills section responds to mouse parallax on desktop; degrades gracefully to tag groups on mobile
- [ ] Editing `portfolio.config.ts` and running `vp dev` reflects changes without touching any component
- [ ] Zod parse in `portfolio.config.ts` throws a descriptive error if a required field is missing
- [ ] GSAP ScrollTriggers are cleaned up on component unmount (verified by test)
- [ ] Site is fully navigable via keyboard (tab order, focus rings)
- [ ] Vercel deployment runs `vp build` and serves `/dist` — zero config needed

---

## Open Questions

- [ ] **Photo:** Deepak confirmed he has a photo — where should it appear? Current plan: header avatar on desktop nav (small, circular), and optionally in Contact section. Confirm before implementing.
- [ ] **Blog / writing:** No mention in brief. Skip for now — can be added as a section later via config.
- [ ] **Analytics:** Vercel Analytics (zero-config, privacy-friendly) vs. nothing. Recommend adding — confirm.
- [ ] **OG image:** Auto-generate from name/title, or provide a custom one? Recommend a static designed PNG at 1200×630px. Content: name, title, accent color background. Must exist before deployment.
- [ ] **Favicon:** `public/favicon.svg` spec is "initials DKD" — confirm preferred style (stacked? ligature? monogram on accent background?).
- [ ] **Smooth scroll:** Should `scroll-behavior: smooth` be applied globally via CSS, or handled per-link via GSAP/JS for more control over easing?
- [ ] **GSAP SplitText:** This plugin requires a GSAP Club (paid) license. If unavailable, hero animation falls back to manual `<span class="char">` split in Vue template. Confirm license status before implementation.
- [ ] **Domain:** `deepakd.me` — is this already pointed at Vercel, or does DNS need configuring?
