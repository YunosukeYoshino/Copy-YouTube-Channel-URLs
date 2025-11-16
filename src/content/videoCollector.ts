import type { CollectVideosResponse } from "../shared/messages";

const channelPathRegex = /^\/(channel|c|user)\//;
const videoSelectors = [
  "ytd-grid-video-renderer",
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-rich-grid-media"
];

function looksLikeChannelPage(): boolean {
  if (channelPathRegex.test(location.pathname)) {
    return true;
  }

  return videoSelectors.some((selector) => Boolean(document.querySelector(selector)));
}

function isElementVisible(element: Element): boolean {
  const target = element as HTMLElement | null;
  if (!target) {
    return false;
  }

  const style = window.getComputedStyle(target);
  if (!style || style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  return target.offsetWidth > 0 || target.offsetHeight > 0 || target.hidden === false;
}

function normalizeVideoUrl(href: string): string | null {
  try {
    const baseOrigin = location.origin.includes("youtube.com")
      ? location.origin
      : "https://www.youtube.com";
    const url = new URL(href, baseOrigin);
    if (!url.pathname.includes("watch")) {
      return null;
    }
    const params = new URLSearchParams(url.search);
    if (!params.has("v")) {
      return null;
    }
    url.search = `?v=${params.get("v")}`;
    url.hash = "";
    return url.toString();
  } catch (error) {
    console.warn("Unable to parse video URL", href, error);
    return null;
  }
}

export function collectVisibleVideoUrls(): CollectVideosResponse {
  if (!looksLikeChannelPage()) {
    return {
      status: "noChannel",
      reason: "This page does not look like a YouTube channel video list."
    };
  }

  const hrefs = Array.from(document.querySelectorAll("a#thumbnail"))
    .filter((anchor) => {
      const wrapper = anchor.closest(videoSelectors.join(","));
      if (!wrapper) {
        return false;
      }
      return isElementVisible(wrapper);
    })
    .map((anchor) => anchor.getAttribute("href"))
    .filter((href): href is string => Boolean(href));

  const normalized: string[] = [];
  let totalCandidates = 0;

  for (const href of hrefs) {
    totalCandidates += 1;
    const normalizedUrl = normalizeVideoUrl(href);
    if (!normalizedUrl) {
      continue;
    }
    normalized.push(normalizedUrl);
  }

  const uniqueUrls = Array.from(new Set(normalized));

  if (uniqueUrls.length === 0) {
    return {
      status: "noVideos",
      reason: "No video thumbnails with watch links were visible on the channel page."
    };
  }

  return {
    status: "success",
    urls: uniqueUrls,
    deduplicated: normalized.length - uniqueUrls.length
  };
}
