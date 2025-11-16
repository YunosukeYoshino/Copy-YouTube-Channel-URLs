# Implementation Plan: Select Channel Videos to Copy

**Branch**: `001-select-video-urls` | **Date**: November 16, 2025 | **Spec**: [specs/001-select-video-urls/spec.md](specs/001-select-video-urls/spec.md)
**Input**: Feature specification from `/specs/001-select-video-urls/spec.md`

## Summary

Enhance the existing Chrome extension UI to enumerate the currently visible videos (title + URL) from the active channel, let users toggle a checkbox list, and copy only the selected watch URLs to the clipboard. The feature maintains the existing Manifest V3 flow (content script collects video metadata, popup surface displays the list, background service worker writes to clipboard) but adds selection controls, messaging for the structured snapshot, and clear failure messaging for non-channel contexts.

## Technical Context

**Language/Version**: TypeScript 5+ targeting Manifest V3 with Bun-managed tooling.  
**Primary Dependencies**: Chrome Extensions APIs, esbuild for bundling Service Worker/content scripts/popup, Vitest + happy-dom for unit tests, Bun for scripts.  
**Storage**: N/A (no persistent databases).  
**Testing**: Vitest-based unit tests for DOM parsing (`tests/unit/videoCollector.test.ts`); manual QA for clipboard/user flows.  
**Target Platform**: Chrome/Chromium desktop browsers on Windows/macOS/Linux.  
**Project Type**: Single browser-extension project with `src/background`, `src/content`, `src/popup`, shared modules, and docs/scripts at repo root.  
**Performance Goals**: Structured list renders within 2s for 30 thumbnails; clipboard copy completes within 3s.  
**Constraints**: Manifest V3 restrictions on service worker modules (bundle to IIFE), strict host permissions (`https://www.youtube.com/*`), and user-initiated clipboard writes only.  
**Scale/Scope**: Single extension portal focused on YouTube channel pages; no broader catalog scraping or multi-tab coordination.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*  
Feature-specific gates: Manifest V3 bundling verification, spec-driven story coverage, and documented manual test steps in `docs/manual-testing.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-select-video-urls/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Provided user scenarios and requirements
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated)
```

### Source Code (repository root)

```text
dist/
src/
├── background/
│   └── index.ts
├── content/
│   └── videoCollector.ts
├── shared/
│   └── messages.ts
├── popup/
│   └── index.ts
├── contentScript.ts
├── logo.png
└── ...
popup/
├── popup.html

tests/
└── unit/
    └── videoCollector.test.ts

docs/
└── manual-testing.md

manifest.json
package.json
tsconfig.json
vitest.config.ts
README.md
```

**Structure Decision**: Keep the single browser-extension layout with modular directories (`src/background`, `src/content`, `src/popup`, `src/shared`), bundler outputs in `dist/`, and docs/tests as shown.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | Not applicable | Manifest V3 compliance already satisfied |
