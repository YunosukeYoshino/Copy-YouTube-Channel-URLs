# Quickstart: Select Channel Videos to Copy

1. Run `bun install` to ensure dependencies (`esbuild`, `TypeScript`, `Vitest`, etc.) are available.  
2. Execute `bun run build` to bundle the service worker, content script, and popup into `dist/` so Manifest V3 can load them.  
3. Load the unpacked extension from your project root in Chrome (`chrome://extensions`).  
4. Visit any YouTube channel page and click the extension icon.
5. Confirm that the popup lists each visible video (title + URL) with checkboxes and the copy button states how many URLs will be copied.
6. Toggle selections and press the copy button; verify the clipboard contains only the checked watch URLs (newline-separated).  
7. Scroll down for more videos, re-open the popup, and ensure the new entries appear with the previous selections preserved.  
8. Open a non-channel tab (e.g., YouTube homepage) and see that the popup disables the copy control with a message explaining the constraint.
