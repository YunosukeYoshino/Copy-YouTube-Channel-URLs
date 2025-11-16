---
description: "Task list for Copy YouTube Channel URLs implementation"
---

# Tasks: Copy YouTube Channel URLs

**Input**: plan.md, spec.md
**Prerequisites**: chrome extension scaffold, manifest, and TypeScript tooling

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [Setup] Initialize `tsconfig.json` and `package.json` entries so the TypeScript-based extension can compile sources under `src/`.
- [x] T002 [Setup] Add base manifest (`manifest.json` at repo root) and the popup shell (`popup/popup.html`) so the extension can be installed and manually tested.
- [x] T003 [P] [Setup] Provide build scripts (`npm run build`, `npm run lint`) and bundler config that emit `dist/` so Chrome can load the packaged extension.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 [Foundation] Update `manifest.json` to give the extension `permissions` for `https://www.youtube.com/*` and `clipboardWrite`, and register the content and background scripts referenced in later tasks.
- [x] T005 [Foundation] Establish messaging glue between popup, background, and content scripts using `chrome.runtime.sendMessage`/`onMessage` handlers defined in `src/background/index.ts`.
- [x] T006 [Foundation] Create a clipboard helper in `src/background/clipboard.ts` that listens for the copy payload, writes newline-separated URLs, and reports success or failure back to the popup.

---

## Phase 3: User Story 1 - Copy visible channel video URLs (Priority: P1) 🎯

- [x] T101 [US1] Implement `src/content/videoCollector.ts` to detect video tiles on a YouTube channel page, extract direct watch URLs, and deduplicate results before returning them to the popup.
- [x] T102 [US1] Build the popup UI (`src/popup/index.ts`) that offers a single "Copy visible videos" action and shows a spinner/status message while the script runs.
- [x] T103 [US1] Wire the popup action to the background clipboard helper so the collected URLs are written to the clipboard and the popup receives confirmation of success/failure.

---

## Phase 4: User Story 2 - Refresh list after scrolling loads more videos (Priority: P2)

- [x] T201 [US2] Extend `src/content/videoCollector.ts` so repeated invocations capture all currently rendered tiles, including those loaded via scrolling, without requiring a full reload.
- [x] T202 [US2] Update the popup status text to report how many URLs were copied and remind the user they can scroll and repeat if the initial copy missed entries.

---

## Phase 5: User Story 3 - Handle non-channel pages gracefully (Priority: P3)

- [x] T301 [US3] Add validation logic in `src/content/videoCollector.ts` to detect when the DOM does not represent a channel view and respond with an explicit error code.
- [x] T302 [US3] Ensure the popup UI surface displays the error reason and suggests navigating to a channel before retrying, without overwriting clipboard contents.

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T401 [P] Document the manual testing steps, expected behaviors, and Clipboard permission notes in `README.md` or a dedicated doc under `docs/`.
- [x] T402 [P] Add unit tests under `tests/unit/videoCollector.test.ts` to verify the DOM parsing and URL extraction logic across a few representative HTML snippets.
