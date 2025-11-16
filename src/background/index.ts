import { createCopyListener } from "./clipboard";

createCopyListener();

chrome.runtime.onInstalled.addListener(() => {
  console.info("Copy YouTube Channel URLs extension installed or updated.");
});
