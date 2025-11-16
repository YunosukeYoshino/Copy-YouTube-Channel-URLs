import type { CopyLogMessage, VideoEntry, SelectionSnapshot } from "../shared/messages";

type StatusTone = "info" | "success" | "error";

const button = document.getElementById("copy-button") as HTMLButtonElement;
const status = document.getElementById("status");
const videoList = document.getElementById("video-list");
const selectAll = document.getElementById("select-all") as HTMLInputElement;
const timestampEl = document.getElementById("snapshot-timestamp");

const statusColors: Record<StatusTone, string> = {
  info: "#0f62fe",
  success: "#115d1d",
  error: "#b00020"
};

let entriesState: VideoEntry[] = [];
let currentStatus: SelectionSnapshot["status"] | null = null;

function updateStatus(text: string, tone: StatusTone = "info") {
  if (status) {
    status.textContent = text;
    status.style.color = statusColors[tone];
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

function setCopyButtonWorking(isWorking: boolean) {
  if (!button) return;
  if (isWorking) {
    button.disabled = true;
    button.textContent = "Copying…";
  } else {
    refreshCopyButtonState();
  }
}

function refreshCopyButtonState() {
  if (!button) return;
  if (currentStatus !== "success") {
    button.disabled = true;
    button.textContent = "Copy selected video URLs";
    return;
  }

  const selectedCount = entriesState.filter((entry) => entry.selected).length;
  button.disabled = selectedCount === 0;
  button.textContent = selectedCount === 0 ? "選択された動画がありません" : "Copy selected video URLs";
}

function updateSelectAllState() {
  if (!selectAll) return;
  if (entriesState.length === 0) {
    selectAll.checked = false;
    selectAll.disabled = true;
    selectAll.indeterminate = false;
    return;
  }

  const selectedCount = entriesState.filter((entry) => entry.selected).length;
  selectAll.disabled = false;
  selectAll.checked = selectedCount === entriesState.length;
  selectAll.indeterminate = selectedCount > 0 && selectedCount < entriesState.length;
}

function renderEntries(entries: VideoEntry[]) {
  entriesState = entries.map((entry) => ({ ...entry }));
  if (!videoList) return;

  videoList.innerHTML = "";

  entriesState.forEach((entry) => {
    const row = document.createElement("label");
    row.className = "video-entry";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "entry-checkbox";
    checkbox.dataset.url = entry.watchUrl;
    checkbox.checked = entry.selected;

    const meta = document.createElement("div");
    meta.className = "entry-meta";

    const title = document.createElement("span");
    title.className = "entry-title";
    title.textContent = entry.title;

    const url = document.createElement("span");
    url.className = "entry-url";
    url.textContent = entry.watchUrl;

    meta.appendChild(title);
    meta.appendChild(url);
    row.appendChild(checkbox);
    row.appendChild(meta);
    videoList.appendChild(row);
  });
}

function toggleSelectionAll(checked: boolean) {
  entriesState = entriesState.map((entry) => ({ ...entry, selected: checked }));
  if (!videoList) return;
  videoList.querySelectorAll<HTMLInputElement>(".entry-checkbox").forEach((checkbox) => {
    checkbox.checked = checked;
  });
  refreshCopyButtonState();
}

function handleEntrySelection(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.classList.contains("entry-checkbox")) {
    return;
  }
  const url = target.dataset.url;
  if (!url) return;
  entriesState = entriesState.map((entry) =>
    entry.watchUrl === url ? { ...entry, selected: target.checked } : entry
  );
  updateSelectAllState();
  refreshCopyButtonState();
}

function updateTimestamp(snapshot: SelectionSnapshot) {
  if (!timestampEl) return;
  const parsed = new Date(snapshot.timestamp);
  timestampEl.textContent =
    snapshot.status === "success"
      ? `最終更新: ${parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "";
}

function clearEntries(reason?: string) {
  if (videoList) {
    videoList.innerHTML = "";
  }
  entriesState = [];
  currentStatus = null;
  updateSelectAllState();
  refreshCopyButtonState();
  if (reason) {
    updateStatus(reason, "info");
  }
}

async function refreshSnapshot() {
  if (!button) return;
  updateStatus("Detecting visible videos...");
  setCopyButtonWorking(true);
  if (videoList) {
    videoList.classList.add("loading");
  }
  const tab = await queryActiveTab();
  if (!tab?.id) {
    updateStatus("Unable to find the active tab.", "error");
    setCopyButtonWorking(false);
    sendCopyLog({ type: "logCopy", urlCount: 0, status: "failure", reason: "No active tab" });
    if (videoList) videoList.classList.remove("loading");
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "collectVideos" }, (response: SelectionSnapshot | undefined) => {
    if (videoList) {
      videoList.classList.remove("loading");
    }
    if (!response) {
      const reason = chrome.runtime.lastError?.message ?? "No response from content script.";
      updateStatus(reason, "error");
      sendCopyLog({ type: "logCopy", urlCount: 0, status: "failure", reason });
      setCopyButtonWorking(false);
      clearEntries();
      return;
    }

    currentStatus = response.status;
    updateTimestamp(response);

    switch (response.status) {
      case "success":
        renderEntries(response.entries);
        updateSelectAllState();
        refreshCopyButtonState();
        updateStatus(`${response.entries.length} 件の動画を検出しました。`, "success");
        setCopyButtonWorking(false);
        break;
      case "noChannel":
      case "noVideos":
        clearEntries(response.reason);
        setCopyButtonWorking(false);
        break;
      case "error":
        clearEntries(response.reason);
        updateStatus(response.reason || "Unknown error", "error");
        setCopyButtonWorking(false);
        break;
    }
  });
}

async function copySelectedVideos() {
  if (!button) return;
  if (currentStatus !== "success") {
    return;
  }

  const selectedUrls = entriesState.filter((entry) => entry.selected).map((entry) => entry.watchUrl);
  if (selectedUrls.length === 0) {
    updateStatus("少なくとも一つの動画を選択してください。", "info");
    refreshCopyButtonState();
    return;
  }

  setCopyButtonWorking(true);
  try {
    await navigator.clipboard.writeText(selectedUrls.join("\n"));
    updateStatus(`${selectedUrls.length} 件の動画のURLをコピーしました。`, "success");
    sendCopyLog({ type: "logCopy", urlCount: selectedUrls.length, status: "success", selectedUrls });
  } catch (error) {
    const reason = "Clipboard write failed. Please allow clipboard access in Chrome.";
    updateStatus(reason, "error");
    sendCopyLog({ type: "logCopy", urlCount: selectedUrls.length, status: "failure", reason, selectedUrls });
  } finally {
    setCopyButtonWorking(false);
  }
}

function initialize() {
  if (!button) return;
  button.addEventListener("click", copySelectedVideos);
  selectAll?.addEventListener("change", () => {
    toggleSelectionAll(selectAll.checked);
  });
  videoList?.addEventListener("change", handleEntrySelection);
  refreshSnapshot();
}

initialize();
