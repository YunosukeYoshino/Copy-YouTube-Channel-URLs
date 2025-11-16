# Implementation Plan: Copy YouTube Channel URLs

**Branch**: `001-copy-youtube-urls` | **Date**: November 16, 2025 | **Spec**: [specs/001-copy-youtube-urls/spec.md](specs/001-copy-youtube-urls/spec.md)
**Input**: Feature specification from `/specs/001-copy-youtube-urls/spec.md`

## Summary

Deliver a Chrome extension workflow that detects the YouTube channel the user is viewing, scrapes the currently rendered video tiles, deduplicates their watch URLs, and copies the resulting newline-separated list to the clipboard with clear success and failure messaging.

## Technical Context

**Language/Version**: TypeScript 5+ targeting Chrome extension Manifest V3 runtime
**Primary Dependencies**: Chrome Extensions APIs, TypeScript compiler or bundler (esbuild/tsc), Jest for unit tests
**Storage**: N/A (no persistent data stores required)
**Testing**: Manual Chrome-based functional tests plus unit tests for the DOM parsing helper
**Target Platform**: Chrome/Chromium-based desktop browsers (Windows/macOS/Linux)
**Project Type**: Browser extension (single project with popup + content scripts)
**Performance Goals**: Clipboard copy completes within 3 seconds on a standard broadband connection; DOM scanning for a page of 30 videos finishes without noticeable UI freeze
**Constraints**: Must respect Manifest V3 CSP, request only Chrome permissions required (YouTube host, clipboardWrite), and minimize clipboard writes by requiring explicit user action
**Scale/Scope**: Single Chrome extension with a focused feature (copying visible channel video URLs)

## Constitution Check

*GATE: Must pass all planned checks before release.* No constitution file was provided, so no additional gating criteria apply beyond the standard QA flow.

## Project Structure

### Documentation (this feature)

```text
specs/001-copy-youtube-urls/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (not created yet)
├── data-model.md        # Phase 1 output (not created yet)
├── quickstart.md        # Phase 1 output (not created yet)
├── contracts/           # Phase 1 output (not created yet)
└── tasks.md             # This file (later phases will list execution tasks)
```

### Source Code (repository root)

```text
src/
├── background/
│   └── clipboard.ts       # Clipboard helper and messaging entry points
├── content/
│   └── videoCollector.ts  # DOM parsing for YouTube video tiles
├── popup/
│   └── index.tsx          # UI to launch copy action and show status
├── assets/
│   └── icons/             # Optional icons for toolbar
└── manifest.json          # Manifest V3 configuration
```

**Structure Decision**: A single browser-extension project with separate `content` and `popup` modules keeps the messaging boundaries clear and isolates DOM parsing logic from UI concerns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None | No special architectural gating currently required | Not applicable |
