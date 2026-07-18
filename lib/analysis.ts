import type { Analysis } from "./types";

export const ANALYSIS_MIN_STORY_LENGTH = 20;

const themeMap: Record<string, string[]> = {
  family: ["family wounds", "belonging", "inherited expectations"],
  parent: ["parent relationship", "unmet emotional needs", "repair without forced forgiveness"],
  hate: ["resentment", "blame", "pain asking for boundaries"],
  guilt: ["guilt", "self-abandonment", "permission to choose"],
  lonely: ["loneliness", "longing for connection", "being unseen"],
  love: ["love patterns", "attachment", "emotional safety"],
  work: ["achievement pressure", "identity and success", "burnout"],
  body: ["body signals", "stress", "returning to safety"],
  shame: ["shame", "hidden identity", "self-acceptance"],
  fear: ["fear", "protection", "agency"],
};

function unique(items: string[]) {
  return [...new Set(items)].slice(0, 8);
}

export function localAnalyze(story: string): Analysis {
  const lower = story.toLowerCase();
  const themes = Object.entries(themeMap).flatMap(([keyword, mappedThemes]) =>
    lower.includes(keyword) ? mappedThemes : []
  );
  const safeThemes = unique(
    themes.length
      ? themes
      : ["identity shift", "emotional pattern", "longing for a truer future", "meaning-making"]
  );
  const blockers = unique([
    lower.includes("hate") || lower.includes("angry")
      ? "resentment becoming the author"
      : "old meaning shaping the ending",
    lower.includes("guilt") ? "guilt blocking self-permission" : "survival story repeating itself",
    lower.includes("parent") || lower.includes("family")
      ? "family pain defining identity"
      : "fear-based choice path",
    lower.includes("should") || lower.includes("expected")
      ? "living inside expectations"
      : "waiting for external rescue",
  ]);
  const primary = safeThemes[0] || "identity shift";

  return {
    summary:
      "EverAfter found a shared pattern inside the private story: the old wound is still trying to decide the future. In the real product, this pattern becomes the bridge into a community Reflection Room where others choose the same subject without seeing this user's private details.",
    pillars: {
      innovate:
        "The story is asking for a new perspective: pain can become a pattern to understand, not a permanent identity.",
      investigate: `The emotional center appears connected to ${safeThemes.slice(0, 3).join(", ")}. These become room subjects, not exposed story details.`,
      choose: "The user chooses a focused room around the pattern instead of staying alone with the story.",
      pinHome:
        "The AI moderator helps the room reach a specific realization that can be carried back into life.",
    },
    blockers,
    trajectory: [
      "If the pattern keeps leading the story, it can turn reflection into repeating blame.",
      "It can pull the user away from agency and toward the belief that the past is still writing the ending.",
      "The room redirects the pattern toward meaning, boundaries, and a usable next choice.",
    ],
    themes: safeThemes,
    room: {
      title: `Community Reflection Room: ${primary[0].toUpperCase()}${primary.slice(1)}`,
      prompt:
        "Stay with this one subject: what does this pattern protect, and what would help it move toward Home?",
      voices: [
        "Community member: I chose this room because I know what it feels like when blame becomes the only language for pain.",
        "Community member: I want to talk about this pattern without sharing all the details. I need a way to turn it into a boundary and not a cage.",
        "AI moderator: Let’s bring this back to the room’s point. What realization would help someone carry this story differently after today?",
      ],
    },
    pinHome: "I can honor the truth of what shaped me without surrendering the authorship of what comes next.",
    safetyNote: "EverAfter is a reflection tool, not therapy or crisis care.",
  };
}

export function buildAnalysisPrompt(story: string): string {
  return `You are EverAfter AI, a safe community-led story-intelligence system. Analyze the user's private story through Innovate, Investigate, Choose, Pin Home. Identify the pattern, where it is currently leading, and the anonymized room subjects. The final step is a community Reflection Room: real users later, demo voices now. AI moderates to keep people on this exact subject, prevent advice/diagnosis/private-detail sharing, and guide toward Pin Home. Do not diagnose. Do not force forgiveness. Return ONLY valid JSON matching: {"summary":string,"pillars":{"innovate":string,"investigate":string,"choose":string,"pinHome":string},"blockers":string[],"trajectory":string[],"themes":string[],"room":{"title":string,"prompt":string,"voices":string[]},"pinHome":string,"safetyNote":string}. Story: ${story}`;
}
