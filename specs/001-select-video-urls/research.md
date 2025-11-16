# Research: Select Channel Videos to Copy

## Decision: Share a structured `VideoEntry` snapshot across the content script and popup
**Rationale:** The UI now needs metadata (title, URL, checkbox state) rather than just raw anchors, so the content script bundles each tile into a predictable payload; the snapshot includes selection-friendly defaults and deduped URLs so the popup can render and copy without further DOM access.
**Alternatives considered:** Keep only URLs in the message payload (rejected because the popup would still need to rebuild titles from DOM) and remote background parsing (rejected because it violates Manifest V3 messaging simplicity).

## Decision: Keep bundling with `esbuild` to produce single IIFE artifacts for Manifest V3
**Rationale:** Chrome requires service workers and content scripts without module `export` statements; `esbuild` already used for the project and can bundle `src/background/index.ts`, `src/contentScript.ts`, and `src/popup/index.ts` into standalone files consumed by the manifest. This avoids runtime module issues and keeps bundler configuration minimal.
**Alternatives considered:** Relying solely on `tsc` output (rejected because it emits ES modules unless extra config is added) or switching to a heavier toolchain like webpack (unnecessary for this small extension).

## Decision: User-initiated clipboard writes remain from the popup
**Rationale:** The user experience already demonstrates clipboard writes from the popup button; continuing that pattern minimizes permission changes and keeps the background service worker only focused on logging copy events.
**Alternatives considered:** Moving clipboard writes into the background service worker (would require extra messaging and might violate user gesture requirements).
