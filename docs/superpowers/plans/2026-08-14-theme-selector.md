# Claude Theme Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible Claude Sandstone/Ink selector to DeepSeek Harness Web settings and publish real Mac mini screenshots.

**Architecture:** The static client plugin registers one React row in `settings.general.item` through the public slots service. It reads/writes the already-registered theme definitions through the public theme service and lets Cordis dispose every effect.

**Tech Stack:** TypeScript, React, DeepSeek Harness client slots/theme APIs, Vitest, Playwright CLI.

---

### Task 1: Implement and test the settings selector

**Files:**
- Create: `src/client/ThemeSelectorRow.tsx`
- Modify: `src/client/index.ts`
- Modify: `src/client-contract.ts`
- Modify: `src/client/theme.module.css`
- Modify: `tests/client.spec.ts`

- [ ] **Step 1: Write failing tests**

Add tests that expect `inject` to equal `['theme', 'slots']`, one `settings.general.item` registration with ID `claude-theme-selector`, two buttons named `Claude Sandstone` and `Claude Ink`, an `aria-pressed` state from `theme.getTheme().preference`, and calls to `theme.setTheme('claude-sandstone')` / `theme.setTheme('claude-ink')`.

- [ ] **Step 2: Run the focused test**

Run: `npm test -- tests/client.spec.ts`

Expected: FAIL because the selector and `slots` registration do not exist.

- [ ] **Step 3: Implement the public-slot component**

Register `settings.general.item` only through `ctx.slots.inject`, using a React component that creates the two buttons with `aria-pressed`. Subscribe to `theme/change`, retain the current preference in component state, and return/own the registration plus listener disposers through `ctx.effect`.

- [ ] **Step 4: Add CSS and type contracts**

Use only existing `--dsw-alias-*` variables for card surfaces, focus rings, selected state, swatches, and responsive layout. Extend only the minimal local type contract for `ThemeRuntime`, `SlotRegistry`, and `settings.general.item` registration.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run typecheck && npm run bundle && npm pack --dry-run`

Expected: all commands exit 0.

Commit: `git add -- src/client tests/client.spec.ts && git commit -m "feat: add Claude theme selector"`

### Task 2: Install, verify, capture, and publish

**Files:**
- Create: `docs/images/sandstone.png`
- Create: `docs/images/ink.png`
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Repackage and install on Mac mini**

Run local `npm pack`, copy the archive to the known Mac mini plugin directory, update only the existing Web Profile dependency, and keep the one `claude-web-theme` Loader row. Restart only the 3080 Harness Web process and confirm `deepseek-claude-web-theme` appears in `window.__DSH_BOOT__`.

- [ ] **Step 2: Perform browser acceptance**

Open the tunneled Web UI. In Settings → General, select Sandstone and Ink in turn. Verify each card is visible, selected, and changes the major page surfaces. Capture one PNG per active theme.

- [ ] **Step 3: Add screenshot gallery and verify release**

Add a two-image gallery with descriptive alt text to both README files. Run `npm test`, typecheck, bundle, `npm pack --dry-run`, and `git diff --check`.

- [ ] **Step 4: Commit and publish**

Commit only source, tests, docs, and screenshots. Push the feature branch and merge it into `main` only after the user-authorized publication flow is complete.

## Self-review

- Task 1 covers slot registration, switching, active state, cleanup, styles, and tests.
- Task 2 covers the actual Mac mini installation, browser evidence, README gallery, and GitHub publication.
- The plan uses no core Harness modification, external assets, or undocumented browser APIs.
