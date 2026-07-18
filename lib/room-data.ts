import type { Analysis, ChatMessage, RoomSubject } from "./types";

export const SAMPLE_STORY = `I keep feeling like my family story decides who I am allowed to become. I want freedom, but I also feel guilty for wanting a life that looks different from what people expected of me.`;

export const roomSubjects: Record<RoomSubject, { prompt: string; seed: string[]; pinHome: string }> = {
  "Family wounds": {
    prompt: "What did this pattern protect, and what boundary would let the past stop authoring the future?",
    seed: [
      "Community member: I chose this room because I know what it feels like when old family pain becomes the whole language for identity.",
      "Community member: I want to name what happened without letting it become the ending of my story.",
    ],
    pinHome: "I can honor the truth of what shaped me without surrendering the authorship of what comes next.",
  },
  Belonging: {
    prompt: "Where did belonging become self-abandonment, and what would belonging without hiding look like?",
    seed: [
      "Community member: I am here because I keep confusing being accepted with disappearing parts of myself.",
      "Community member: I want to belong somewhere without performing a smaller version of who I am.",
    ],
    pinHome: "I do not have to abandon myself to be worthy of connection.",
  },
  "Permission to choose": {
    prompt: "What expectation is asking for release, and what choice would restore agency today?",
    seed: [
      "Community member: I joined because guilt keeps making my choices feel like betrayal.",
      "Community member: I want to practice choosing a future without asking the old story for permission first.",
    ],
    pinHome: "Choosing my life is not a rejection of love; it is a return to authorship.",
  },
};

export const roomNames = Object.keys(roomSubjects) as RoomSubject[];

export function pickRoom(analysis: Analysis | null): RoomSubject {
  const text = `${analysis?.room.title || ""} ${(analysis?.themes || []).join(" ")}`.toLowerCase();
  if (text.includes("belong")) return "Belonging";
  if (text.includes("guilt") || text.includes("permission") || text.includes("expect")) {
    return "Permission to choose";
  }
  return "Family wounds";
}

export function startRoomMessages(room: RoomSubject, firstReflection: string): ChatMessage[] {
  const seed = roomSubjects[room].seed.map((text) => ({ role: "community" as const, text }));

  return [
    {
      role: "ai",
      text: `AI moderator: Welcome to the ${room} room. Keep private story details private. Speak from your reflection, avoid advice or diagnosis, and help the room reach Pin Home.`,
    },
    ...seed,
    { role: "user", text: `You shared: ${firstReflection}` },
  ];
}
