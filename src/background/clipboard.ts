import type { CopyLogMessage } from "../shared/messages";

export function recordCopyEvent(payload: CopyLogMessage): void {
  // Keeping a short-lived log for debugging; no persistence is required for the MVP.
  console.info("Copy event", payload);

  if (chrome?.storage?.local) {
    chrome.storage.local.set({ lastCopyEvent: { ...payload, timestamp: Date.now() } }, () => {
      if (chrome.runtime.lastError) {
        console.warn("Unable to persist copy event", chrome.runtime.lastError);
      }
    });
  }
}

export function createCopyListener(): void {
  chrome.runtime.onMessage.addListener((message: CopyLogMessage, _sender, sendResponse) => {
    if (message?.type === "logCopy") {
      recordCopyEvent(message);
      sendResponse({ recorded: true });
      return true;
    }
    return false;
  });
}
