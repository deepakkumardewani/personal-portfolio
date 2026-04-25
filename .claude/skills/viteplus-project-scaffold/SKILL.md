---
name: viteplus-project-scaffold
description: Scaffolds a new Vite+ (vp) app from a create-vite template (vue-ts, react-ts, etc.) directly in a chosen directory—preferring in-place `create-vite@latest .` and falling back to a local child folder merge without using /tmp. Also documents why `vp create vite` with `--template` is unreliable. Use when the user wants a new Vite+ or Vite project, names a template, or says they want the project in the parent/target folder without a temp directory.
---

# Vite+ project scaffold (create-vite → in cwd → `vp migrate`)

## Do not use for new apps

- **`vp create vite PROJ -- --template <tpl>`** — the CLI can mis-parse arguments and scaffold into a folder literally named after the flag, or a non-Framework template. Prefer **create-vite** for templates, then **migrate to Vite+** (this matches the official “use create-vite / migrate” path in Vite+ docs).
- Relying on **`/tmp` or a random path** is optional. Prefer the flows below in the **target directory** only.

## Inputs

- **`TARGET_DIR`**: the folder that should end up with `package.json` at its root (often the repo root, or `mkdir` it first).
- **`<template>`**: pass-through to create-vite, e.g. `vue-ts`, `react-ts`, `vanilla-ts`, `svelte-ts`.

## Rules

1. **Refuse to clobber** an existing `package.json` in `TARGET_DIR` (unless the user explicitly asked to add Vite+ to an existing app—in that case use `vp migrate` only, not full create-vite over the tree).
2. **Prefer in-place** when the directory is safe for create-vite (typically no `package.json` yet).
3. **Fallback without `/tmp`**: if in-place fails (non-empty tree, or tool error), create a **child** folder in `TARGET_DIR`, scaffold there, **rsync** into `TARGET_DIR`, delete the child. Use a fixed name (e.g. `__scaffold` or `app`) and remove it in the same step.
4. After files exist, run **`command vp migrate --no-interactive`** (add `--no-agent --no-editor --no-hooks` if you must avoid writing agent/editor files or hooks).
5. Install extras with `command vp add` / `command vp install` as needed, then `command vp check` and `command vp run build`.

## Procedure A — empty or new `TARGET_DIR` (best)

```bash
cd /path/to/TARGET_DIR
# Official pattern (npm); bun works analogously with bunx: always use bunx
# npm create vite@latest . -- --template <template>
bunx create-vite@latest . -- --template <template>
command vp migrate --no-interactive
```

Use **`--` before `--template`** so the package manager does not eat flags. Example: `bunx create-vite@latest . -- --template vue-ts`.

## Procedure B — `TARGET_DIR` already has `.git` / docs / other files, no `package.json`

1. **Try** Procedure A. If create-vite refuses or would merge unsafely, go to step 2.
2. In **`TARGET_DIR`** only (no parent temp path):

```bash
cd /path/to/TARGET_DIR
bunx create-vite@latest app -- --template <template>
rsync -a --exclude='.git' app/ . && rm -rf app
command vp migrate --no-interactive
```

The **`app` segment** is the create-vite project name (use any unused name, e.g. `scaffold-app`). The folder exists only until `rm -rf app`.

## Procedure C — helper script (optional)

If this repo’s skill is present, the agent may run the bundled script from the target directory (make executable once if needed: `chmod +x`):

- Path: [scripts/scaffold-into-cwd.sh](scripts/scaffold-into-cwd.sh)
- Example: `bash /path/to/personal-portfolio/.claude/skills/viteplus-project-scaffold/scripts/scaffold-into-cwd.sh vue-ts`

The script implements: refuse existing `package.json` → try in-place → on failure, `app/` + rsync + `vp migrate`.

## After migrate

- Set **`name`** in `package.json` to the product name if the template left a placeholder.
- If tests fail typecheck in app scope, add **`src/vite-env.d.ts`** (Vue) or `exclude` `**/*.test.ts` in `tsconfig` as the project’s rules require.
- **Templates reference**: same list as [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite#readme) (e.g. `vue`, `vue-ts`, `react`, `react-ts`).

## Verification

- `command vp run build` and `command vp check` pass.
- `command vp dev` starts; no import errors for core deps the user added.

## Summary checklist

- [ ] `cd` to `TARGET_DIR` (the folder that should own the app root).
- [ ] In-place: `* create-vite@latest . -- --template <template>`, or child `app/` + `rsync` + `rm -rf app`.
- [ ] `command vp migrate --no-interactive`.
- [ ] Do not use broken `vp create vite … -- --template` for primary scaffolding without verifying output in a dry run.
