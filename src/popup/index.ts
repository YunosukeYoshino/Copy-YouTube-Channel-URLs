import type { CollectVideosResponse, CopyLogMessage } from "../shared/messages";

type StatusTone = "info" | "success" | "error";

const button = document.getElementById("copy-button") as HTMLButtonElement;
const status = document.getElementById("status");

const statusColors: Record<StatusTone, string> = {
  info: "#0f62fe",
  success: "#115d1d",
  error: "#b00020"
};

function updateStatus(text: string, tone: StatusTone = "info") {
  if (status) {
    status.textContent = text;
    status.style.color = statusColors[tone];
  }
}

function setButtonState(isWorking: boolean) {
  if (button) {
    button.disabled = isWorking;
    button.textContent = isWorking ? "Copying…" : "Copy visible video URLs";
  }
}

function queryActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function sendCopyLog(message: CopyLogMessage) {
  chrome.runtime.sendMessage(message);
}

async function copyVisibleVideos() {
  if (!button) return;

  setButtonState(true);
  updateStatus("Detecting visible videos...");

  const tab = await queryActiveTab();
  if (!tab?.id) {
    updateStatus("Unable to find the active tab.", "error");
    setButtonState(false);
    sendCopyLog({ type: "logCopy", urlCount: 0, status: "failure", reason: "No active tab" });
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "collectVideos" }, async (response: CollectVideosResponse | undefined) => {
    if (!response) {
      const reason = chrome.runtime.lastError?.message ?? "No response from content script.";
      updateStatus(reason, "error");
      sendCopyLog({ type: "logCopy", urlCount: 0, status: "failure", reason });
      setButtonState(false);
      return;
    }

    switch (response.status) {
      case "success": {
        const payload = response.urls.join("\n");
        try {
          await navigator.clipboard.writeText(payload);
          const message = `${response.urls.length} visible video${response.urls.length === 1 ? "" : "s"} copied.`;
          updateStatus(message, "success");
          sendCopyLog({ type: "logCopy", urlCount: response.urls.length, status: "success" });
        } catch (error) {
          const reason = "Clipboard write failed. Please allow clipboard access in Chrome.";
          updateStatus(reason, "error");
          sendCopyLog({ type: "logCopy", urlCount: response.urls.length, status: "failure", reason });
        }
        break;
      }
      case "noChannel":
      case "noVideos":
        updateStatus(response.reason, "info");
        sendCopyLog({ type: "logCopy", urlCount: 0, status: "warning", reason: response.reason });
        break;
      case "error":
        updateStatus(response.reason, "error");
        sendCopyLog({ type: "logCopy", urlCount: 0, status: "failure", reason: response.reason });
        break;
    }

    setButtonState(false);
  });
}

function initialize() {
  if (!button) return;
  button.addEventListener("click", copyVisibleVideos);
}

document.addEventListener("DOMContentLoaded", initialize);
