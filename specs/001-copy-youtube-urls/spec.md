# Feature Specification: Copy YouTube Channel URLs

**Feature Branch**: `001-copy-youtube-urls`  
**Created**: November 16, 2025  
**Status**: Draft  
**Input**: User description: "chrom 拡張をtypescript で作りたい 今開いているYoutubeチェンネルの動画URLをリスト形式でクリップボードにコピーする機能がほしい"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy visible channel video URLs (Priority: P1)

While reviewing any YouTube channel page, the user wants to capture the URLs of every video currently shown so that they can share or process them without copying each link manually.

**Why this priority**: Capturing a full list of videos is the core value of the request; users save time versus copying one link at a time.

**Independent Test**: Visit a YouTube channel (e.g., a channel with multiple published videos), open the extension UI, trigger the copy action, and confirm the clipboard holds newline-separated URLs matching the visible thumbnails.

**Acceptance Scenarios**:

1. **Given** the user is on a YouTube channel that displays a grid or list of videos, **When** they invoke the copy action from the extension, **Then** every video tile currently rendered on the page produces its direct YouTube watch URL and the extension writes them to the clipboard.
2. **Given** the copy completes successfully, **When** the clipboard is inspected, **Then** it contains only unique, fully qualified watch URLs (no duplicates, correct `https://www.youtube.com/watch?v=...` form) and the UI communicates success.

---

### User Story 2 - Refresh list after scrolling loads more videos (Priority: P2)

When a channel has more videos than initially rendered, the user can scroll to load additional tiles and then re-run the copy action to capture the expanded visible set.

**Why this priority**: Ensures the feature remains useful across infinite-scroll channels and encourages systematic workflows.

**Independent Test**: Scroll down a channel page until new videos load, trigger the copy action, and compare the clipboard list against the newly visible set (including previously loaded entries) while confirming older entries remain present.

**Acceptance Scenarios**:

1. **Given** the user scrolls to load additional video tiles on the channel page, **When** they rerun the copy action, **Then** both the original and newly visible videos appear in the contiguous clipboard list without missing entries.

---

### User Story 3 - Handle non-channel pages gracefully (Priority: P3)

Users may accidentally activate the feature outside of a valid channel context (e.g., homepage, search results). The extension must explain why no list can be produced and what to do next.

**Why this priority**: Avoids confusing feedback loops and prevents clipboard pollution with irrelevant URLs.

**Independent Test**: Visit a non-channel YouTube page, trigger the copy action, and confirm the extension warns the user that no channel video list exists while leaving the clipboard unchanged.

**Acceptance Scenarios**:

1. **Given** the user is not on a YouTube channel page or there are no video tiles in the DOM, **When** they request the copy action, **Then** the extension indicates that it cannot collect channel videos and suggests navigating to a channel before trying again.

---

### Edge Cases

- A channel switches between `videos` and `playlists` views while the user interacts; the feature should only read URLs from the video tiles that are visible at the time of copying.
- YouTube throttles DOM access or lazy-loads thumbnails; the feature must handle missing href attributes by skipping incomplete entries and reporting how many URLs were gathered.
- Clipboard write permissions or browser policies block the action; the UI must surface a clear retry path or mention operating system restrictions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST detect whether the currently active tab is a YouTube channel-style page and identify the set of video tiles that are visible to the end user.
- **FR-002**: System MUST provide a single, discoverable action that collects the direct watch URLs (`https://www.youtube.com/watch?v=...`) for each visible video tile, deduplicating any repeated links.
- **FR-003**: Users MUST be able to invoke the copy action from the Chrome extension UI (e.g., toolbar popup or contextual command) and receive the resulting list on their clipboard.
- **FR-004**: System MUST provide clear feedback (success or reason for failure) immediately after the user triggers the copy action so they understand whether the clipboard was updated.
- **FR-005**: System MUST gracefully handle states with zero video tiles (empty channel, playlist view, or non-channel page) by indicating why no URLs were copied and how to reach a valid channel view.
- **FR-006**: System SHOULD allow repeating the copy action after scrolling to include newly loaded video tiles without needing to reload the tab.

### Key Entities *(include if feature involves data)*

- **ChannelVideoList**: Represents the collection of video entries currently rendered on the channel page, including their titles (when available) and destination watch URLs.
- **VideoEntry**: The trimmed metadata for a single tile, principally the watch URL and any unique identifier used to deduplicate.
- **ClipboardPayload**: The sequential text output produced when the user executes the copy action; includes newline separators and status details for the user feedback state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can request the list of currently visible channel videos and receive a clipboard payload within 3 seconds of invoking the copy action on a standard broadband connection.
- **SC-002**: At least 90% of copy attempts on valid channel pages result in a reported success state in the extension UI.
- **SC-003**: The clipboard payload contains only unique, fully qualified YouTube watch URLs separated by newline characters, matching the set of video tiles that were visible when the action was triggered.
- **SC-004**: When users trigger the action outside of a valid channel view, the extension surfaces a clear reason why no URLs were copied and references navigating back to a channel.

## Assumptions

- The new capability plugs into the existing Chrome extension rather than a standalone tool, so it can reuse the current browser permissions and UI shell.
- The user prefers the list of links to include whatever videos are currently rendered in the DOM (not the channel's entire catalog) and is comfortable re-running the action after scrolling to load more videos.
- Clipboard write permission is granted by Chrome, and the UI can surface fallback instructions if the browser blocks the write.
