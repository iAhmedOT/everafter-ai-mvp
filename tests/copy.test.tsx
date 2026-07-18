import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DataSection } from "../components/marketing-sections";
import { StoryToolSection } from "../components/story-tool";
import { localAnalyze } from "../lib/analysis";
import { roomSubjects } from "../lib/room-data";

describe("privacy and consent copy", () => {
  it("explains that stories are not stored by the MVP and may be processed by a configured AI provider", () => {
    const html = renderToStaticMarkup(<DataSection />);

    expect(html).toContain("not stored by this MVP");
    expect(html).toContain("configured AI provider");
  });

  it("tells the user that only the room reflection is shared, not their full story", () => {
    const analysis = localAnalyze(
      "My family expectations still shape my choices, and I want to stop letting guilt make my decisions."
    );

    const html = renderToStaticMarkup(
      <StoryToolSection
        story="A long enough story for the demo to render results."
        loading={false}
        analysis={analysis}
        selectedRoom="Family wounds"
        currentRoom={roomSubjects["Family wounds"]}
        consentSharedReflection={true}
        roomInput="I want more agency."
        resultsRef={{ current: null }}
        onStoryChange={async () => {}}
        onAnalyze={async () => {}}
        onUseSample={async () => {}}
        onSelectRoom={async () => {}}
        onConsentChange={async () => {}}
        onRoomInputChange={async () => {}}
        onEnterRoom={async () => {}}
      />
    );

    expect(html).toContain("does not permanently store private stories or room chats");
    expect(html).toContain("Only this reflection is shared into the room");
  });
});
