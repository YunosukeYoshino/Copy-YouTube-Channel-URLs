import type { CollectVideosResponse, VideoEntry } from "../shared/messages";

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
  if (!style || style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }

  return true;
}

function normalizeVideoUrl(href: string): string | null {
  try {
    const url = new URL(href, location.origin);
    if (!url.pathname.includes("watch")) {
      return null;
    }
    const params = new URLSearchParams(url.search);
    if (!params.has("v")) {
      return null;
    }
    const videoId = params.get("v");
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
  } catch (error) {
    console.warn("Unable to parse video URL", href, error);
    return null;
  }
}

function extractTitle(anchor: Element): string {
  const candidates: (string | null | undefined)[] = [
    anchor.getAttribute("title"),
    anchor.getAttribute("aria-label"),
    anchor.querySelector("#video-title")?.textContent,
    anchor.querySelector("#video-title-link")?.textContent,
    anchor.closest("ytd-grid-video-renderer")?.querySelector("#video-title")?.textContent,
    anchor.closest("ytd-rich-item-renderer")?.querySelector("#video-title")?.textContent,
    anchor.textContent
  ];

  for (const candidate of candidates) {
    if (candidate) {
      const trimmed = candidate.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return "Untitled";
}

function inferChannelName(): string | undefined {
  const metaTitle = document.querySelector("meta[itemprop='name']");
  if (metaTitle instanceof HTMLMetaElement && metaTitle.content) {
    return metaTitle.content.trim();
  }

  const header = document.querySelector("ytd-channel-name");
  if (header?.textContent) {
    return header.textContent.trim();
  }

  const pageTitle = document.title;
  if (pageTitle) {
    return pageTitle.replace(" - YouTube", "").trim();
  }

  return undefined;
}

function buildResponse(
  status: CollectVideosResponse["status"],
  entries: VideoEntry[],
  totalCandidates: number,
  reason?: string
): CollectVideosResponse {
  return {
    status,
    timestamp: new Date().toISOString(),
    entries,
    totalCandidates,
    reason
  };
}

export function collectVisibleVideoUrls(): CollectVideosResponse {
  if (!looksLikeChannelPage()) {
    return buildResponse("noChannel", [], 0, "This page does not look like a YouTube channel video list.");
  }

  const channelName = inferChannelName();
  const anchors = Array.from(document.querySelectorAll("a#thumbnail")).filter((anchor) => {
    const wrapper = anchor.closest(videoSelectors.join(","));
    if (!wrapper) {
      return false;
    }
    return isElementVisible(wrapper);
  });

  const entries: VideoEntry[] = [];
  const seen = new Set<string>();
  let totalCandidates = 0;

  for (const anchor of anchors) {
    totalCandidates += 1;
    const href = (anchor as HTMLAnchorElement).href;
    const normalizedUrl = normalizeVideoUrl(href);
    if (!normalizedUrl) {
      continue;
    }
    if (seen.has(normalizedUrl)) {
      continue;
    }
    seen.add(normalizedUrl);

    entries.push({
      title: extractTitle(anchor),
      watchUrl: normalizedUrl,
      channelName: channelName,
      selected: true,
      index: entries.length
    });
  }

  if (entries.length === 0) {
    return buildResponse(
      "noVideos",
      [],
      totalCandidates,
      "No video thumbnails with watch links were visible on the channel page."
    );
  }

  return buildResponse("success", entries, totalCandidates);
}
