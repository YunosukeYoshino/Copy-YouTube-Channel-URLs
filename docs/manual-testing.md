# Manual Testing: Copy YouTube Channel URLs

## Setup
1. Run `npm install` to fetch the listed dev dependencies.
2. Build the extension with `npm run build`, then load `dist/` and `popup/` assets via Chrome's extension developer mode (unpacked extension).
3. Grant clipboard access when Chrome prompts to allow the popup to write to the clipboard.

## Tests
1. **Copy visible channel videos (P1 flow)**
   - Open a YouTube channel page that lists multiple videos.
   - Open the extension popup and click **Copy visible video URLs**.
   - Confirm the status shows how many videos were copied and that the clipboard contains newline-separated watch links matching the currently loaded thumbnails.

2. **Refresh after scrolling (P2 flow)**
   - Scroll down on the same channel until more videos load.
   - Click the copy button again and ensure the clipboard includes both the original and newly visible videos (the status text will mention the total count).

3. **Handle incorrect context (P3 flow)**
   - Open any non-channel YouTube page (e.g., search results or homepage).
   - Click the copy button and ensure the popup displays why no URLs were copied and no clipboard modifications occur.

## Notes
- If the clipboard write fails, the UI surface suggests enabling clipboard permissions and does not misreport success.
- All copy attempts send a log message to `chrome.runtime` so additional telemetry can be added later.
