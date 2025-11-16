import { collectVisibleVideoUrls } from "../../src/content/videoCollector";

describe("videoCollector", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns structured entries for visible videos and skips duplicates", () => {
    window.history.pushState({}, "", "/channel/UC123/videos");
    document.body.innerHTML = `
      <ytd-grid-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="/watch?v=abc123&feature=share" title="First Video"></a>
        </ytd-grid-video-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="https://www.youtube.com/watch?v=abc123" title="First Video"></a>
        </ytd-grid-video-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="https://www.youtube.com/watch?v=def456" title="Second Video"></a>
        </ytd-grid-video-renderer>
      </ytd-grid-renderer>
    `;

    const result = collectVisibleVideoUrls();

    expect(result.status).toBe("success");
    expect(result.timestamp).toBeTruthy();
    expect(result.totalCandidates).toBe(3);
    expect(result.entries).toHaveLength(2);
    expect(result.entries.map((entry) => entry.watchUrl)).toEqual([
      "https://www.youtube.com/watch?v=abc123",
      "https://www.youtube.com/watch?v=def456"
    ]);
    expect(result.entries[0].title).toBe("First Video");
    expect(result.entries[1].index).toBe(1);
  });

  it("signals noChannel when the page lacks channel cues", () => {
    window.history.pushState({}, "", "/watch");
    document.body.innerHTML = `<div></div>`;

    const result = collectVisibleVideoUrls();

    expect(result.status).toBe("noChannel");
    expect(result.entries).toHaveLength(0);
  });
});
