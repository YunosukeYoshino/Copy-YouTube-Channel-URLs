# Feature Specification: Select Channel Videos to Copy

**Feature Branch**: `001-select-video-urls`  
**Created**: November 16, 2025  
**Status**: Draft  
**Input**: User description: "やっぱりコピペ前に、どの動画のURLをコピーするかをユーザーが決められるようにするべきで、一旦前URLとタイトルをエクステンション上で構造化したものをリスト貸して、チェックリストでユーザーに選ばさせてクリップボードに保存かな"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview & select visible channel videos (Priority: P1)

When visiting a YouTube channel, the user wants to see every currently rendered video expressed as title + URL in the extension UI, so they can check the ones they intend to copy instead of blindly copying the whole list.

**Why this priority**: Giving users control over which videos to copy prevents cluttered clipboards and lets them target only the links they need, which is the new value proposition.

**Independent Test**: Open the extension on a populated YouTube channel, inspect the popup list to ensure each tile shows a title and watch URL, toggle a few checkboxes, trigger copy, and verify the clipboard contains only the selected URLs.

**Acceptance Scenarios**:

1. **Given** the user is on a populated channel page and opens the popup, **When** the extension collects videos, **Then** a scrollable list of entries (title + URL) appears with checkboxes set to selected by default.
2. **Given** the user unchecks several videos, **When** they press the copy button, **Then** only the checked URLs are written to the clipboard in newline-separated form and the UI reports the number copied.

---

### User Story 2 - Reuse list after load-more or new context (Priority: P2)

If the channel loads more videos when the user scrolls or refreshes, the user expects to re-open the extension, see an updated list, adjust selections, and copy the latest batch without losing prior selections.

**Why this priority**: Channels often hide older videos behind infinite scroll, so selection persistence and reactivity keep the feature useful beyond the first fetch.

**Independent Test**: Scroll down the channel to load more thumbnails, reopen the popup, confirm the new entries were appended, selectively copy both new and previously selected URLs, and verify clipboard reflects the union.

**Acceptance Scenarios**:

1. **Given** the user previously copied from the first 20 thumbnails, **When** they scroll and load more videos and re-open the popup, **Then** newly visible entries appear in the list, the user can toggle them independently, and copying includes both the newly selected and prior selections.

---

### User Story 3 - Communicate when selection is impossible (Priority: P3)

Users sometimes open the extension on a non-channel tab (search, homepage) or before thumbnails are ready; the extension should explain why selection is unavailable instead of presenting an empty checklist.

**Why this priority**: Clear failure messaging prevents confusion and preserves clipboard contents when no valid videos exist.

**Independent Test**: Visit a YouTube search results page, open the popup, and verify it shows a friendly notice rather than a checklist, and the copy button is disabled.

**Acceptance Scenarios**:

1. **Given** the active tab is not a channel video list, **When** the user opens the popup, **Then** the UI states that the current page is not a channel view, disables the copy action, and suggests navigating to a channel.

---

### Edge Cases

- Channels that render videos via shadow DOM or lazy load may delay the list; the UI must surface a loading indicator and allow retrying after the DOM stabilizes.
- Some thumbnails may lack titles or href attributes; the collector must skip incomplete entries and report how many videos were resumable.
- If the clipboard write fails (e.g., permission revoked), the extension must keep selected entries highlighted and show instructions for granting clipboard access.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST identify each visible video tile on the channel page and gather its title, channel name, and direct watch URL without triggering extra navigation.
- **FR-002**: System MUST present the gathered videos inside the popup as a labeled list, each row containing the title, URL, and a checkbox; entries are selected by default to avoid extra clicks when the user wants all current videos.
- **FR-003**: Users MUST be able to toggle individual checkboxes (and a "Select all" control) so they can limit which URLs participate in the copy action.
- **FR-004**: System MUST write only the currently selected URLs (newline-separated) to the clipboard when the user clicks the copy button, then report how many links were added or if the clipboard write failed.
- **FR-005**: System MUST disable or hide the copy control when no valid videos exist and provide specific guidance explaining how to return to a channel view.
- **FR-006**: System SHOULD retain the latest fetched collection while the popup stays open so re-checking the button after load-more does not re-fetch unless the channel DOM changes.

### Key Entities *(include if feature involves data)*

- **VideoEntry**: Represents a single video tile, including title (or placeholder), sanitized watch URL, channel name, and selection state.
- **SelectionSnapshot**: Captures the sequence of entries currently offered to the user plus metadata (count, last updated timestamp) for reporting success/failure and reusing after scroll/load-more.
- **ClipboardPayload**: The newline-separated text built from selected URLs, archived with count metadata that the UI can display after each action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users copying from the popup receive a clipboard payload containing only the URLs whose checkboxes were still selected at the moment of copying, measured by testing 5 scenarios with mixed selections.
- **SC-002**: At least 90% of copy attempts on valid channel pages complete within 3 seconds and report the number of URLs copied, deterring silent failures.
- **SC-003**: When a user opens the popup on a non-channel page, the copy control is disabled and a message directs them to a valid channel, verified in manual QA steps.
- **SC-004**: The UI loads and displays the video list (with titles and URLs) within 2 seconds for channels with 30 thumbnails, ensuring timely selection work.

## Assumptions

- The extension continues operating under Manifest V3 and uses the existing messaging flow to instruct the background script to write to the clipboard; no new permissions are required.
- Users are comfortable copying newline-separated URLs and do not expect additional metadata beyond title + watch URL in the selection list.
- The selection list can be rebuilt on demand when the user re-opens the popup after scrolling; state persistence across navigation is not required.
