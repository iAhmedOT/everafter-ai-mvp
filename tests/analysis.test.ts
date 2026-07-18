import { describe, expect, it } from "vitest";

import { ANALYSIS_MIN_STORY_LENGTH, localAnalyze } from "../lib/analysis";
import { pickRoom, startRoomMessages } from "../lib/room-data";

describe("localAnalyze", () => {
  it("returns a structured analysis for a valid story", () => {
    const analysis = localAnalyze(
      "My family expectations still shape my choices, and guilt keeps me from building a different life."
    );

    expect(analysis.summary).toContain("shared pattern");
    expect(analysis.blockers.length).toBeGreaterThan(0);
    expect(analysis.themes).toContain("family wounds");
    expect(analysis.pinHome).toContain("authorship");
  });

  it("uses a consistent minimum story length constant", () => {
    expect(ANALYSIS_MIN_STORY_LENGTH).toBe(20);
  });
});

describe("room helpers", () => {
  it("routes belonging-centered analysis to the Belonging room", () => {
    const analysis = {
      room: { title: "Community Reflection Room: Belonging", prompt: "", voices: [] },
      themes: ["belonging", "self-abandonment"],
    } as ReturnType<typeof localAnalyze>;

    expect(pickRoom(analysis)).toBe("Belonging");
  });

  it("starts room messages with AI guidance, seeded reflections, and the user reflection", () => {
    const messages = startRoomMessages("Permission to choose", "I want to stop asking guilt for permission.");

    expect(messages[0].role).toBe("ai");
    expect(messages[0].text).toContain("Permission to choose");
    expect(messages[1].role).toBe("community");
    expect(messages.at(-1)?.text).toContain("You shared:");
  });
});
