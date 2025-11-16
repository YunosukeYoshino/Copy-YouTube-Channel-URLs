import type { CollectVideosMessage } from "./shared/messages";
import { collectVisibleVideoUrls } from "./content/videoCollector";

chrome.runtime.onMessage.addListener((message: CollectVideosMessage, _sender, sendResponse) => {
  if (message?.type === "collectVideos") {
    sendResponse(collectVisibleVideoUrls());
    return true;
  }
});
