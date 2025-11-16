# Manual Testing: Copy YouTube Channel URLs

## Setup
1. Run `bun install` to fetch the required dev dependencies.
2. Build the extension with `bun run build`, then load `dist/` and `popup/` assets via Chrome's extension developer mode (unpacked extension).
3. Grant clipboard access when Chrome prompts to allow the popup to write to the clipboard.

## Tests
1. **Copy selected channel videos (P1 flow)**
   - Open a YouTube channel page with multiple thumbnails.
   - Open the extension popup, uncheck any videos you do not want, and click **Copy selected video URLs**.
   - Verify the clipboard contains only the selected watch links (newline-separated) and the status text indicates the number copied.

2. **Refresh after loading more videos (P2 flow)**
   - Scroll further down the channel so additional thumbnails appear.
   - Re-open the popup, confirm the list includes the newly visible entries, adjust your selections, and copy again. The clipboard should reflect the union of the currently selected URLs.

3. **Handle incorrect context (P3 flow)**
   - Visit a non-channel YouTube page (homepage, search results, etc.).
   - Open the popup and confirm the copy button is disabled with a message explaining why selection is unavailable; clipboard contents should remain unchanged.

## Notes
- If the clipboard write fails, the UI surface suggests enabling clipboard permissions and does not misreport success.
- All copy attempts send a log message to `chrome.runtime` so additional telemetry can be added later.
