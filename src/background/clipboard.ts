import type { CopyLogMessage } from "../shared/messages";

export function recordCopyEvent(payload: CopyLogMessage): void {
  // Keep a short-lived log for debugging and selection counts.
  console.info("Copy event", {
    ...payload,
    selectedCount: payload.selectedUrls?.length
  });

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
