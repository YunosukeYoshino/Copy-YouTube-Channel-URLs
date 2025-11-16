# Data Model: Select Channel Videos to Copy

## Entity: VideoEntry
- **Description:** Represents a single video tile scraped from the active channel view.
- **Fields:**
  - `title` (string, defaults to "Untitled" when missing)
  - `watchUrl` (string, normalized `https://www.youtube.com/watch?v=...`)
  - `channelName` (string, optional fallback for context)
  - `selected` (boolean, default `true`)
  - `index` (number, ordering in the currently rendered list)
- **Relationships:** Used by `SelectionSnapshot` to populate checkbox rows; has no persistent storage.
- **Validation:** `watchUrl` must include a `v` parameter; rows missing titles or URLs are filtered out with telemetry logged.

## Entity: SelectionSnapshot
- **Description:** Captures the state delivered to the popup each time the user opens the extension.
- **Fields:**
  - `entries` (array of `VideoEntry`)
  - `timestamp` (ISO string when the snapshot was taken)
  - `isChannelView` (boolean, false when the current tab is not a channel list)
  - `hasVideos` (boolean, false when no valid entries exist)
  - `totalCandidates` (number of anchors considered, even if filtered)
- **Validation:** `timestamp` updates whenever the DOM changes significantly; `entries` length drives the enablement of the copy button.

## Entity: ClipboardPayload
- **Description:** The newline-separated result sent to the system clipboard after the user clicks copy.
- **Fields:**
  - `selectedUrls` (array of strings)
  - `count` (number of selected URLs)
  - `status` ("success" | "failure" | "noSelection")
  - `reason` (optional string for failure cases)
- **State Transitions:** `status` starts as `noSelection`, becomes `success` after clipboard write, or `failure` if permission is blocked; failures retain `selectedUrls` for retry.
