# Portfolio build tasks (from `agent-docs/TASKS.md`)

## Phase 0: Project Setup

### Task 0: Scaffold Vue + TypeScript project with Vite+ and install all dependencies

**Acceptance criteria**

- [x] `vp dev` starts without errors
- [x] `vp build` completes without errors
- [x] `vp check` passes (lint + format + type-check)
- [x] `import gsap from 'gsap'` resolves without error
- [x] `import { useMouseInElement } from '@vueuse/core'` resolves without error
- [x] `import { z } from 'zod'` resolves without error
- [x] All three `@fontsource` packages installed in `node_modules`
- [x] TypeScript strict mode enabled in `tsconfig.app.json`
- [x] `@/` alias resolves to `src/` (Vite `resolve.alias` + `tsconfig` `paths`)

**Test targets:** `src/setup-dependencies.test.ts` — dependency import smoke

- [x] Impl
- [x] Test

**Dependencies:** None

---

## Phase 1+ (pending)

See `agent-docs/TASKS.md` for remaining phases.
