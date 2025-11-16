import { collectVisibleVideoUrls } from "../../src/content/videoCollector";

describe("videoCollector", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns normalized, deduplicated watch URLs", () => {
    window.history.pushState({}, "", "/channel/UC123/videos");
    document.body.innerHTML = `
      <ytd-grid-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="/watch?v=abc123&feature=share"></a>
        </ytd-grid-video-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="https://www.youtube.com/watch?v=abc123"></a>
        </ytd-grid-video-renderer>
        <ytd-grid-video-renderer>
          <a id="thumbnail" href="https://www.youtube.com/watch?v=def456"></a>
        </ytd-grid-video-renderer>
      </ytd-grid-renderer>
    `;

    const result = collectVisibleVideoUrls();

    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.urls).toHaveLength(2);
      expect(result.urls).toEqual([
        "https://www.youtube.com/watch?v=abc123",
        "https://www.youtube.com/watch?v=def456"
      ]);
      expect(result.deduplicated).toBe(1);
    }
  });

  it("signals noChannel when the page lacks channel cues", () => {
    window.history.pushState({}, "", "/watch");
    document.body.innerHTML = `<div></div>`;

    const result = collectVisibleVideoUrls();

    expect(result.status).toBe("noChannel");
  });
});
