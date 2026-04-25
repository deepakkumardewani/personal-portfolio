# Product Requirement Document

**Product:** Deepak Kumar Dewani — Personal Portfolio Website  
**Version:** 1.0  
**Date:** 2026-04-24  
**Author:** Product & Engineering Team

---

## 1. Overview

### Description

A high-performance, single-page personal portfolio website for Deepak Kumar Dewani, a Senior Frontend Engineer with 8+ years of experience. Built with Vue 3, TypeScript, GSAP, and Vite+, the site functions as a personal brand asset deployed on Vercel.

### Problem Statement

Generic portfolio templates fail to communicate the craft and seniority of experienced engineers. Deepak needs a site that _itself_ demonstrates his frontend expertise — through typography, animation, performance, and code quality — rather than merely listing it.

### Product Vision

> When anyone lands on this site, they must immediately feel they are looking at the work of a craftsperson. The website itself is the proof of skill. No visitor should leave without having scrolled through the entire page.

**Success looks like:**

- A recruiter shares the URL with their team unprompted
- A peer developer asks "who made this?" in a Slack channel
- Any visitor senses seniority and taste within 3 seconds of landing

---

## 2. Goals & Objectives

| Goal              | Metric                             | Target           |
| ----------------- | ---------------------------------- | ---------------- |
| Performance       | Lighthouse Performance Score       | ≥ 95             |
| Accessibility     | Lighthouse Accessibility Score     | 100              |
| Best Practices    | Lighthouse Best Practices Score    | 100              |
| Loading Speed     | LCP on simulated 4G                | < 2.5s           |
| Layout Stability  | Cumulative Layout Shift (CLS)      | 0                |
| Build Quality     | `vp build` errors                  | 0                |
| Type Safety       | TypeScript errors                  | 0                |
| Test Coverage     | `src/data/` and `src/composables/` | ≥ 80%            |
| Engagement        | Visitor scroll depth               | 100% page scroll |
| Brand Recognition | Recruiter/peer unprompted shares   | Qualitative      |

---

## 3. Assumptions

1. **Photo availability:** Deepak has a photo available at `/public/photo.jpg`. Its placement (header avatar vs. contact section) is pending confirmation.
2. **Domain:** `deepakd.me` is assumed to already point at Vercel, or DNS configuration is handled separately.
3. **Analytics:** Vercel Analytics (zero-config, privacy-friendly) will be added pending user confirmation.
4. **OG Image:** A static designed PNG will be used for Open Graph; auto-generation is out of scope for v1.
5. **No blog section:** Skipped for v1 — can be added later via `portfolio.config.ts`.
6. **No contact form:** Senior engineer positioning means direct email/social links only.
7. **Single language:** English only; no i18n requirements.
8. **Projects have screenshots:** Images exist or will be placed at `/public/projects/*.png` before launch.
9. **GSAP license:** Standard GSAP free tier is sufficient; `SplitText` plugin requires GSAP Club (fallback: manual span split).

---

## 4. Scope

### In Scope

- Full single-page application with 7 sections: Hero, Projects, Experience, Award, Skills, Education, Contact
- Fixed navigation header with scroll-hide/show behavior
- GSAP ScrollTrigger animations for all sections
- Orbital skills visualization with mouse parallax (desktop) + tag list fallback (mobile)
- Fullscreen scroll-takeover project panels (one per project, pinned scroll)
- Vertical timeline experience section with sequential reveal
- Award section with blur-assemble animation
- Custom crosshair cursor with magnetic pull
- Typed data layer (`portfolio.config.ts`) with Zod validation
- Responsive layout (desktop-first, mobile-graceful)
- Self-hosted fonts via `@fontsource` (Bebas Neue, DM Mono, Instrument Sans)
- Keyboard navigation and accessible focus rings
- Vitest unit tests for config and composables
- Vercel static deployment

### Out of Scope

- Blog or writing section
- Contact form
- Dark/light theme toggle (hook scaffolded but not activated)
- CMS or external data API
- Google Fonts or any external font CDN
- Analytics (pending confirmation — not in MVP)
- i18n / multi-language support
- Backend or serverless functions
- Authentication of any kind
- Custom OG image generation

---

## 5. User Personas

### Persona 1: The Recruiter / Hiring Manager

- **Description:** Technical recruiter or engineering manager evaluating Deepak for a senior or staff frontend role
- **Goals:** Quickly assess seniority, depth of experience, and technology fit; find contact details; share with team
- **Pain Points:** Generic template portfolios that read like resumes; no demonstration of actual skill; hard to find key info fast

### Persona 2: The Freelance Client

- **Description:** Startup founder or product manager looking for a senior freelance frontend engineer
- **Goals:** Understand scope of work Deepak can handle; see real project outcomes; reach out easily
- **Pain Points:** Portfolios that list skills without demonstrating judgment or delivery track record

### Persona 3: The Developer Peer

- **Description:** Fellow frontend engineer encountering the site via a share, GitHub, or conference
- **Goals:** See what stack choices Deepak made and why; be inspired or curious about implementation details
- **Pain Points:** Sites that are technically mediocre despite claiming frontend expertise; slow or janky animations

---

## 6. User Stories

### US-01: First Impression

**As a recruiter,**  
I want to immediately understand who Deepak is and his seniority level,  
So that I can decide within 3 seconds whether to continue reading.

**Acceptance Criteria:**

- Name renders in large Bebas Neue with stagger animation on load
- Tagline `8 years. One company. Four promotions. 14 million users.` is visible below name
- No hero image — typography carries the entire visual weight
- Page feels fast (no flash of unstyled content, no layout shift)

---

### US-02: Project Exploration

**As a hiring manager,**  
I want to scroll through Deepak's projects with immersive detail,  
So that I can evaluate the depth and variety of his work.

**Acceptance Criteria:**

- Each of 5 projects occupies a full-viewport sticky panel during scroll
- Project title, tagline, stack, and screenshot are visible per panel
- Per-project accent color differentiates each panel visually
- Live link opens project in new tab
- Project counter `01 / 05` is visible in each panel
- Screenshots load lazily

---

### US-03: Experience Timeline

**As a technical recruiter,**  
I want to read through Deepak's career progression at AccionLabs,  
So that I can understand his growth arc and impact.

**Acceptance Criteria:**

- All 4 roles render on a vertical timeline
- Company name appears as a watermark behind the timeline
- Role cards animate in on scroll (slide from left + fade)
- Each role shows title, period, location, and bullet highlights
- Highlights fade in sequentially on scroll

---

### US-04: Award Recognition

**As a peer developer,**  
I want to see notable achievements highlighted with visual emphasis,  
So that I can understand Deepak's recognition within his organization.

**Acceptance Criteria:**

- Dedicated full-width section between Experience and Skills
- Award name assembles from blur on scroll-enter
- Background shows large faded award text
- Event, date, and location displayed in DM Mono below

---

### US-05: Skills Overview

**As a hiring manager,**  
I want to visually explore Deepak's technical skills organized by category,  
So that I can quickly assess technology fit.

**Acceptance Criteria:**

- Desktop: orbital system with center node `"8+ years"` and 6 category satellites
- Orbit plane tilts ±5° toward cursor via mouse parallax
- Hovering a category node expands its skills outward
- Mobile: collapses to grouped tag lists with category labels
- No progress bars or percentage indicators

---

### US-06: Contact

**As a freelance client,**  
I want to contact Deepak directly without friction,  
So that I can reach out for a potential engagement.

**Acceptance Criteria:**

- `GET IN TOUCH` headline links to `mailto:deepakkumardewani@gmail.com`
- LinkedIn, GitHub, and website links visible as monospaced text
- No contact form

---

### US-07: Navigation

**As any visitor,**  
I want to navigate between sections without losing my place,  
So that I can jump to the section I care about.

**Acceptance Criteria:**

- Fixed header with links: Work · Experience · Skills · Contact
- Header hides on scroll-down, reveals on scroll-up
- Active section is highlighted in nav via IntersectionObserver
- Header background transitions from transparent to blurred on scroll
- All navigation usable via keyboard (tab + enter)

---

## 7. Functional Requirements

### Feature: Data Layer

- `src/data/portfolio.config.ts` is the single source of truth for all content
- Config exports a Zod-validated `portfolio` object
- Changing config and restarting dev server reflects changes without touching any component
- Zod parse throws a descriptive error if a required field is missing or malformed
- URLs in config validated as proper URLs by Zod
- No content hardcoded in any component

**Edge Cases:**

- Missing required field → Zod throws with field path in error message
- Invalid URL format → Zod throws with validation message
- Empty arrays (e.g., no projects) → sections render gracefully or are hidden

---

### Feature: SiteHeader

- `position: fixed`, full width, `z-index: 100`
- On page load: background transparent
- On scroll > 0: background transitions to `--color-bg` at 85% opacity with backdrop blur
- On scroll down: translates `-100%` (hidden) via GSAP ScrollTrigger
- On scroll up: translates `0` (visible)
- Left: `DKD` monogram in Bebas Neue, links to `#hero`
- Right: nav links in DM Mono small caps — anchors `#work`, `#experience`, `#skills`, `#contact`
- Active section: highlighted via `useIntersectionObserver` on each section
- Desktop (≥768px): full nav links visible inline
- Mobile (<768px): nav collapses to hamburger toggle; drawer opens full-width, closes on link click or outside tap
- Fully keyboard navigable; hamburger button has `aria-expanded` + `aria-controls`

---

### Feature: HeroSection

- Height: `100dvh`
- Name `DEEPAK KUMAR DEWANI` in Bebas Neue — intentionally clips viewport edges
- Characters split into individual `<span class="char">` elements
- On mount: GSAP stagger animation — `y: 80 → 0`, `opacity: 0 → 1`, duration 0.4s, stagger 0.02s, ease `power4.out`
- Tagline fades in after name animation completes
- Radial glow: `radial-gradient` from `--color-accent-dim` to transparent behind text
- Scroll cue: thin line extending downward with a CSS pulse animation (not an arrow)
- No photo, no hero image

---

### Feature: ProjectsSection

- Section height = `(number of projects) × 100vh`
- Each project panel: `position: sticky; top: 0; height: 100vh`
- GSAP ScrollTrigger pins each panel during its scroll window
- On scroll into panel: title slides up, stack tags appear, screenshot scales `80% → 100%`
- Per-project `accentColor` applied as background tint
- Desktop layout: screenshot full-bleed on right half
- Mobile layout: screenshot stacked below text
- Bottom left: `01 / 05` counter in DM Mono
- Live link: opens in `target="_blank"` (no modal)
- Screenshots: `<img loading="lazy">`

---

### Feature: ExperienceSection

- Vertical timeline with `1px` left border
- Company name `ACCIONLABS` as large faded watermark behind timeline
- 4 role cards revealed on scroll: `x: -20 → 0`, `opacity: 0 → 1` via GSAP
- Each card: role title + period on one line, location, then highlights
- Highlights fade in sequentially on scroll within each card
- Roles ordered most-recent-first

---

### Feature: AwardSection

- Full-viewport-width standalone section
- Background: `INNOVATION & ENGINEERING EXCELLENCE` as giant faded text
- Center: award title in large Bebas Neue
- Below: event name + date + location in DM Mono small text
- GSAP on scroll-enter: `filter: blur(20px) → blur(0)`, `opacity: 0 → 1`

---

### Feature: SkillsSection — Desktop

- Orbital system with one center node `"8+ years"`
- 6 category satellites (Frontend, State & Data, Testing, Backend & Infra, AI & Productivity, Platforms)
- Skill tags orbit each satellite using CSS 3D transforms + Vue computed positions
- Mouse parallax via `useMouseInElement`: orbit plane tilts ±5° toward cursor
- Hover on category node: skills expand outward (GSAP scale animation)
- No canvas, no Three.js

### Feature: SkillsSection — Mobile

- Detects absence of pointer device (CSS `@media (hover: none)` or `useMediaQuery`)
- Renders grouped tag lists per category
- No orbital animation

---

### Feature: EducationSection

- Single centered card
- Fields: institution, degree, period, location
- No animation required — clean and minimal

---

### Feature: ContactSection

- Full-width dark section; `id="contact"`
- `GET IN TOUCH` in Bebas Neue — is a `<a href="mailto:...">` link
- Below: LinkedIn, GitHub, website displayed as monospaced links
- All external links must include `rel="noopener noreferrer" target="_blank"`
- No form, no CAPTCHA, no validation

### Feature: SiteFooter

- Single-line footer rendered below ContactSection
- Left: `© 2026 Deepak Kumar Dewani` in DM Mono, `--color-muted`
- Right: icon links — LinkedIn, GitHub, email — each with `aria-label` for screen readers
- All external links: `rel="noopener noreferrer" target="_blank"`

---

### Feature: CustomCursor

- Global overlay component mounted in `App.vue`
- Crosshair cursor with magnetic pull toward interactive elements
- Hides default OS cursor via `cursor: none` on `body`
- Degrades gracefully on touch devices (cursor hidden, component inactive)

---

## 8. User Flow

### Primary Scroll Journey

```
User lands on site
→ Hero loads — name animates in character-by-character
→ Tagline fades in below name
→ User scrolls down
→ Header appears (transparent → blurred background)
→ Projects section: each project panel sticks, animates in on scroll
→ Experience section: timeline reveals role by role
→ Award section: text assembles from blur
→ Skills section: orbital system with mouse interaction (desktop)
→ Education section: clean card
→ Contact section: email + social links
→ User clicks GET IN TOUCH → mailto: opens email client
```

### Navigation Jump Flow

```
User clicks nav link (e.g. "Skills")
→ Page smooth-scrolls to #skills
→ Header active state updates to "Skills"
→ Orbital animation triggers on scroll-enter
```

### Project Link Flow

```
User scrolls to a project panel
→ Screenshot and details animate in
→ User clicks live link
→ New tab opens with project URL
→ User returns to portfolio, continues scrolling
```

---

## 9. API Requirements

This product has no external API dependencies.

| Integration  | Type             | Usage              |
| ------------ | ---------------- | ------------------ |
| `mailto:`    | Browser protocol | Contact email link |
| LinkedIn URL | External link    | Opens in new tab   |
| GitHub URL   | External link    | Opens in new tab   |
| Project URLs | External links   | Open in new tab    |

> No REST, GraphQL, or serverless API endpoints are required.

---

## 10. Data Models

### PortfolioConfig

| Field          | Type           | Required | Description              |
| -------------- | -------------- | -------- | ------------------------ |
| name           | string         | ✓        | Full name                |
| title          | string         | ✓        | Job title                |
| tagline        | string         | ✓        | Hero punchy line         |
| email          | string (email) | ✓        | Contact email            |
| phone          | string         | ✗        | Phone number             |
| location       | string         | ✓        | City, Country            |
| photo          | string         | ✗        | Path to photo in /public |
| links.linkedin | string (URL)   | ✓        | LinkedIn profile         |
| links.github   | string (URL)   | ✓        | GitHub profile           |
| links.website  | string (URL)   | ✗        | Personal website         |
| projects       | Project[]      | ✓        | Array of projects        |
| experience     | Experience[]   | ✓        | Array of companies       |
| award          | Award          | ✓        | Single award object      |
| skillGroups    | SkillGroup[]   | ✓        | Grouped skill arrays     |
| education      | Education      | ✓        | Single education object  |

### Project

| Field       | Type         | Required | Description                     |
| ----------- | ------------ | -------- | ------------------------------- |
| id          | string       | ✓        | Unique slug                     |
| title       | string       | ✓        | Project name                    |
| tagline     | string       | ✓        | One punchy sentence             |
| description | string       | ✓        | Full description                |
| stack       | string[]     | ✓        | Technology list                 |
| url         | string (URL) | ✗        | Live project URL                |
| repo        | string (URL) | ✗        | Repository URL                  |
| image       | string       | ✓        | Path to /public/projects/\*.png |
| accentColor | string       | ✓        | Hex color for panel tint        |
| year        | number       | ✓        | Launch year                     |

### Experience

| Field   | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| company | string | ✓        | Company name              |
| roles   | Role[] | ✓        | Array of roles at company |

### Role

| Field      | Type     | Required | Description               |
| ---------- | -------- | -------- | ------------------------- |
| title      | string   | ✓        | Job title                 |
| period     | string   | ✓        | e.g. "Nov 2023 — Present" |
| location   | string   | ✓        | City                      |
| highlights | string[] | ✓        | Achievement bullets       |

### Award

| Field    | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| title    | string | ✓        | Award name           |
| event    | string | ✓        | Event/ceremony name  |
| date     | string | ✓        | e.g. "February 2026" |
| location | string | ✓        | City, Country        |

### SkillGroup

| Field  | Type     | Required | Description         |
| ------ | -------- | -------- | ------------------- |
| label  | string   | ✓        | Category name       |
| skills | string[] | ✓        | List of skill names |

---

## 11. UI/UX Requirements

### Layout

- Single-page application, no routing
- Full-width sections, no max-width container on hero/projects/award/contact
- Content sections (experience, education): max-width ~900px, centered
- Mobile breakpoint: 768px

### Typography

| Use            | Font            | Weight  | Notes               |
| -------------- | --------------- | ------- | ------------------- |
| Display / Hero | Bebas Neue      | 400     | All caps, condensed |
| Body / Code    | DM Mono         | 400     | Monospaced          |
| UI labels      | Instrument Sans | 400–500 | Clean, contemporary |

### Color Palette

| Token                | Value       | Usage            |
| -------------------- | ----------- | ---------------- |
| `--color-bg`         | `#080808`   | Page background  |
| `--color-surface`    | `#111111`   | Cards, panels    |
| `--color-border`     | `#1e1e1e`   | Borders          |
| `--color-text`       | `#f0ede8`   | Primary text     |
| `--color-muted`      | `#6b6b6b`   | Secondary text   |
| `--color-accent`     | `#6366f1`   | CTAs, highlights |
| `--color-accent-dim` | `#6366f122` | Glows            |
| `--color-white`      | `#ffffff`   | Pure white       |

### Components Required

| Component           | Location  | Purpose                  |
| ------------------- | --------- | ------------------------ |
| `SiteHeader`        | layout/   | Fixed nav                |
| `SiteFooter`        | layout/   | Minimal footer           |
| `HeroSection`       | sections/ | Full-viewport hero       |
| `ProjectsSection`   | sections/ | Scroll-takeover projects |
| `ExperienceSection` | sections/ | Timeline                 |
| `AwardSection`      | sections/ | Award spotlight          |
| `SkillsSection`     | sections/ | Orbital / tag list       |
| `EducationSection`  | sections/ | Education card           |
| `ContactSection`    | sections/ | Contact links            |
| `CustomCursor`      | ui/       | Global crosshair cursor  |
| `SectionLabel`      | ui/       | "01 / WORK" labels       |
| `ProjectCard`       | ui/       | Project panel content    |
| `SkillOrbit`        | ui/       | Orbital skills canvas    |

### Responsive Behavior

| Feature       | Desktop (≥768px)         | Mobile (<768px)                  |
| ------------- | ------------------------ | -------------------------------- |
| Hero name     | Clips viewport edges     | Slightly smaller, still dominant |
| Projects      | Screenshot on right half | Screenshot stacked below         |
| Skills        | Orbital 3D system        | Grouped tag lists                |
| Custom cursor | Active                   | Hidden (touch device)            |
| Header nav    | Full links visible       | Collapsed (hamburger or hidden)  |

### Accessibility

- All interactive elements keyboard-navigable (tab order correct)
- Focus rings visible and styled (not removed)
- `alt` text on all `<img>` elements
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<h1>`–`<h3>`
- Section anchors: `id="hero"`, `id="work"`, `id="experience"`, `id="skills"`, `id="contact"`
- ARIA labels on icon-only links; `aria-expanded` + `aria-controls` on mobile hamburger
- Motion: all GSAP animations wrapped in `matchMedia('(prefers-reduced-motion: reduce)')` check — instant/no-animation fallback required

---

## 12. Non-Functional Requirements

### Performance

- LCP < 2.5s on simulated 4G
- Lighthouse Performance ≥ 95
- CLS = 0 (no layout shift from fonts or GSAP)
- Fonts self-hosted via `@fontsource` with `font-display: swap` to prevent invisible text flash
- Project screenshots lazy-loaded (`loading="lazy"`)
- Bundle optimized: tree-shaking, dynamic imports where applicable
- GSAP registered once in `src/utils/gsap.ts`

### Security

- No user input accepted (no forms)
- No authentication
- No external data fetch from untrusted sources
- `rel="noopener noreferrer"` on **every** `target="_blank"` link — enforced in code review, never skipped

### Scalability

- Static SPA — scales infinitely via Vercel CDN
- Content updates require only editing `portfolio.config.ts` and redeploying

### Reliability

- `vp build` must complete with zero errors before any deployment
- Zod validation catches malformed config at build time
- GSAP ScrollTrigger instances killed in `onUnmounted` to prevent memory leaks
- No loading spinners — content is either ready or lazy-loaded invisibly

### Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions)
- No IE11 support required
- CSS 3D transforms required for orbital skills (gracefully degrades on mobile)

---

## 13. Edge Cases

| Scenario                               | Expected Behavior                                                    |
| -------------------------------------- | -------------------------------------------------------------------- |
| Project has no `url`                   | Live link button hidden                                              |
| Project has no `repo`                  | Repo link hidden                                                     |
| Photo not provided                     | No broken image; avatar space hidden                                 |
| Touch device detected                  | Custom cursor hidden; orbital skills replaced with tag list          |
| `prefers-reduced-motion: reduce`       | GSAP animations disabled or reduced to simple fades                  |
| Zod validation fails on config         | Build fails with descriptive error message pointing to invalid field |
| Project screenshot missing (`404`)     | Broken image placeholder shown; does not crash page                  |
| User navigates directly to `/#contact` | Page scrolls to contact section; animations trigger correctly        |
| Very long highlight text               | Text wraps correctly; no overflow                                    |
| Single role at a company               | Timeline renders correctly with one card                             |

---

## 14. Analytics & Tracking

> **Pending confirmation from Deepak.** Vercel Analytics recommended — zero-config, privacy-friendly, no cookie consent banner needed.

| Event                | Trigger               | Implementation        |
| -------------------- | --------------------- | --------------------- |
| `page_view`          | On load               | Vercel Analytics auto |
| `project_link_click` | Click on live link    | Manual event          |
| `contact_click`      | Click on GET IN TOUCH | Manual event          |
| `linkedin_click`     | Click LinkedIn link   | Manual event          |
| `github_click`       | Click GitHub link     | Manual event          |
| `scroll_depth_50`    | 50% page scroll       | Vercel Analytics auto |
| `scroll_depth_100`   | 100% page scroll      | Vercel Analytics auto |

---

## 15. Release Plan

### Phase 1 — MVP (v1.0)

| Milestone     | Deliverables                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Foundation    | Project scaffold, global styles, fonts (`font-display: swap`), CSS variables, data layer + Zod |
| Core Sections | Hero, Projects, Experience, Contact (static, no animations)                                    |
| Navigation    | SiteHeader with scroll behavior + mobile hamburger drawer                                      |
| Animations    | GSAP ScrollTrigger for all sections + `prefers-reduced-motion` fallbacks                       |
| Skills        | Orbital system (desktop) + tag list (mobile)                                                   |
| Polish        | Custom cursor, Award section, Education section, SiteFooter                                    |
| Assets        | `favicon.svg` (DKD monogram), `og-image.png` (1200×630px)                                      |
| QA            | `vp check` passing (lint + format + type-check), Vitest coverage ≥ 80%, Lighthouse ≥ 95        |
| Deploy        | Vercel production deployment at `deepakd.me`                                                   |

### Phase 2 — Post-Launch (v1.1+)

- Photo placement (header avatar and/or contact section) — pending confirmation
- Vercel Analytics integration — pending confirmation
- Blog / writing section — optional future addition
- Dark/light theme toggle (hook already scaffolded)
- OG image (designed static PNG or auto-generated)

---

## 16. Engineering Constraints

These are hard rules derived from SPEC.md. They are non-negotiable and must be enforced in code review.

**Always:**

- Run `vp check` (lint + format + type-check) before every commit — failing check = no merge
- Keep all content in `portfolio.config.ts`; never hardcode text or URLs in components
- Use CSS custom properties for all colors; never hardcode hex values in component files
- Lazy-load all project screenshots with `loading="lazy"`
- Run Zod parse after any change to config schema
- Kill all GSAP ScrollTrigger instances in `onUnmounted`
- Add `rel="noopener noreferrer"` to every `target="_blank"` link
- Wrap GSAP animations with `prefers-reduced-motion` check

**Never:**

- Use `any` in TypeScript — use `unknown` or fix the type
- Add skill progress bars or percentage indicators
- Add a contact form of any kind
- Load fonts from Google Fonts — `@fontsource` only
- Use `!important` in CSS
- Add loading spinners
- Use Options API — `<script setup lang="ts">` on every component
- Hardcode hex values outside of `global.css` custom properties

## 17. Risks & Mitigations

| Risk                                               | Likelihood | Impact | Mitigation                                                             |
| -------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| GSAP `SplitText` requires Club license             | Medium     | Low    | Fallback: manual character split with `<span>` elements                |
| CLS from font loading                              | Medium     | High   | `@fontsource` self-hosted fonts; `font-display: block` to prevent FOUT |
| Orbital 3D skills performance on mid-range devices | Medium     | Medium | Test on real devices; CSS `will-change: transform` optimization        |
| GSAP ScrollTrigger memory leaks                    | Low        | High   | Enforced `onUnmounted` cleanup; covered by unit tests                  |
| Project screenshots not available at launch        | Medium     | Medium | Placeholder images in `/public/projects/` as fallback                  |
| `vp build` compatibility issues with Vite+ CLI     | Low        | High   | Pin Vite+ version; test build in CI early                              |
| Mobile orbital fallback not detected correctly     | Low        | Medium | Use both CSS `@media (hover: none)` and `useMediaQuery` for redundancy |

---

## 17. Open Questions

| #   | Question                                                                                                        | Owner  | Priority |
| --- | --------------------------------------------------------------------------------------------------------------- | ------ | -------- | ----------------------------- |
| 1   | Where should Deepak's photo appear? (Header avatar? Contact section? Both?)                                     | Deepak | High     | header avatar                 |
| 2   | Should Vercel Analytics be added to v1?                                                                         | Deepak | Medium   | no                            |
| 3   | Is `deepakd.me` already pointed at Vercel, or does DNS need configuring?                                        | Deepak | High     | already pointed               |
| 4   | OG image: provide a custom designed PNG (1200×630px), or use a programmatic fallback? Must exist before deploy. | Deepak | High     | i will provide                |
| 5   | Is GSAP Club (for `SplitText`) available, or should manual span-split be used for hero animation?               | Deepak | Medium   | see whats best, not available |
| 6   | Favicon style: what should `favicon.svg` look like? Stacked "DKD" letters? Monogram on accent background?       | Deepak | Medium   | see what works best           |
| 7   | Smooth scroll: global `scroll-behavior: smooth` in CSS, or per-link GSAP control for custom easing?             | Deepak | Low      | both                          |
| 8   | Should the footer include a "Built with Vue + GSAP" credit line?                                                | Deepak | Low      | no                            |
| 9   | Are all 5 project screenshots ready and available at `/public/projects/*.png`?                                  | Deepak | High     | not yet, i will provide       |
