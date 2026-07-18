import { describe, expect, it } from "vitest";

import { buildModeratorPrompt, fallbackReply } from "../lib/moderation";

describe("fallbackReply", () => {
  it("keeps the reply focused on the selected room and Pin Home guidance", () => {
    const reply = fallbackReply("Belonging", "I keep editing myself to fit in.");

    expect(reply).toContain("Belonging room");
    expect(reply).toContain("Pin Home");
    expect(reply).toContain("shared pattern");
  });

  it("trims trailing punctuation from the quoted user excerpt", () => {
    const reply = fallbackReply("Reflection", "I keep editing myself to fit in...");

    expect(reply).toContain("I hear “I keep editing myself to fit in.”");
    expect(reply).not.toContain("....");
  });
});

describe("buildModeratorPrompt", () => {
  it("includes room context, safety framing, and recent history", () => {
    const prompt = buildModeratorPrompt("Family wounds", "I want more agency.", [
      { role: "user", text: "Earlier reflection" },
    ]);

    expect(prompt).toContain("Room subject: Family wounds");
    expect(prompt).toContain("Do not give clinical advice");
    expect(prompt).toContain("Earlier reflection");
    expect(prompt).toContain("I want more agency.");
  });
});
