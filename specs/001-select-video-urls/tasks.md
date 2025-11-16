# Tasks: Select Channel Videos to Copy

**Input**: plan.md, spec.md
**Prerequisites**: Chrome extension scaffold, Manifest V3 bundler, existing clipboard workflow

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [Setup] Update `src/shared/messages.ts` to describe the structured `VideoEntry` payload, selection snapshot metadata, and failure states so both content and popup share the new contract.
- [x] T002 [Setup] Enhance `src/background/index.ts` to record the new selection clipboard events sent from the popup and keep the existing logging so downstream telemetry can consume success/failure results.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 [Foundation] Refine `src/content/videoCollector.ts` to gather video titles, channel names, and sanitized watch URLs into `VideoEntry` objects, calculate the snapshot metadata, and report whether the view is a channel list or a failure state.
- [x] T004 [Foundation] Update `src/contentScript.ts` so the popup can request the latest `VideoEntry` snapshot, receive failure/status cases, and include deduped retry metadata before any UI logic runs.

---

## Phase 3: User Story 1 - Preview & select visible channel videos (Priority: P1) 🎯

**Goal**: Surface a checklist of titles/URLs from the currently rendered channel videos and copy only the checked entries.  
**Independent Test**: Open a populated channel, verify the popup lists entries with checkboxes, uncheck some, click copy, and confirm clipboard contains only selected watch URLs.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [x] T101 [US1] Add/extend `tests/unit/videoCollector.test.ts` to assert the collector returns structured `VideoEntry` objects (title + sanitized URL + selection-ready metadata) and fails gracefully when no videos exist.

### Implementation for User Story 1

- [x] T102 [US1] Implement the popup list UI in `popup/index.ts` (and markup in `popup/popup.html`) with checkboxes per entry, a “Select all” control, dynamic status text, and a count of selected videos.
- [x] T103 [US1] Wire the popup workflow (`popup/index.ts`) so it requests the snapshot via `chrome.tabs.sendMessage`, updates the checkbox state, sends the selected URLs to the background logger, and disables the copy button when nothing is selected.

**Checkpoint**: Story 1 delivers a selectable list and clipboard write even before scroll updates arrive.

---

## Phase 4: User Story 2 - Refresh list after load-more or context change (Priority: P2)

**Goal**: Keep the checklist in sync with newly visible video tiles after the user scrolls down or revisits the popup.  
**Independent Test**: Scroll a channel to load more videos, reopen the popup, confirm the new entries appear, toggle selections (old + new), and copy to verify the clipboard contains the union.

- [ ] T201 [US2] Detect DOM refresh triggers in `src/content/videoCollector.ts` (e.g., MutationObserver or explicit re-query) and include `lastUpdated` metadata so the popup knows when to refresh selection state.
- [ ] T202 [US2] Update `popup/index.ts` to remember previous selections, merge them with incoming snapshots, show the updated timestamp, and allow the user to refresh the checklist without losing prior checkbox choices.

**Checkpoint**: Story 2 ensures the list stays current after scrolling, with selection persistence across refreshes.

---

## Phase 5: User Story 3 - Communicate when selection is unavailable (Priority: P3)

**Goal**: Prevent clipboard actions on invalid pages by showing a clear message and disabling the copy button.  
**Independent Test**: Open the extension on a non-channel tab, verify the popup displays a “not a channel” notice, the copy button remains disabled, and no clipboard change occurs.

- [ ] T301 [US3] Teach `src/content/videoCollector.ts` to detect non-channel contexts (search results, homepage) or empty thumbnails, then signal that state through the shared message contract.
- [ ] T302 [US3] Update `popup/index.ts` to render the failure message, keep selections empty, and include guidance text pointing the user back to a channel when the snapshot indicates `noChannel` or `noVideos`.

**Checkpoint**: Story 3 assures the UI fails gracefully and communicates what the user should do next.

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T401 [P] Document the selection checklist workflow and manual verification steps in `README.md` and `docs/manual-testing.md` so future contributors know how to exercise the feature.
- [ ] T402 [P] Review and tidy shared messaging/helper files (`src/shared/messages.ts`, `src/content/videoCollector.ts`) to ensure naming consistency, comments, and error strings align with the constitution’s observability goals.

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: Shared messaging and background logging must exist before the collector or popup rely on them.  
- **Phase 2 → User Stories**: The snapshot contract and collector metadata must be in place before UI features consume them.  
- **Story Order**: US1 (selection UI) can start once Phase 2 completes. US2 (refresh) depends on Story 1 delivering a working list; US3 (non-channel messaging) can proceed in parallel with Story 1 but finalizes the communication behavior.  
- **Polish**: Depends on all stories to ensure docs reflect reality.

## Parallel Opportunities

- [US1] UI rendering and clipboard wiring can be worked on in parallel with the unit tests defined for the collector.  
- [US2] DOM-observer work can run parallel to popup selection persistence logic since they touch different files.  
- [US3] Failure messaging UI and collector detection can be implemented concurrently with US1 as long as the shared contract is ready.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (shared messaging + logging) and Phase 2 (collector snapshot contract).  
2. Deliver US1 with the selectable list and clipboard copy control.  
3. Validate via unit test and manual QA that selected URLs reach the clipboard.  
4. Feature demo ready for early users.

### Incremental Delivery

1. US2 enhances reactivity; once US1 works, add DOM refresh detection and checklist persistence.  
2. US3 addresses edge states (non-channel, empty lists).  
3. Polish phase updates docs and ensures naming/observability stay tidy.
