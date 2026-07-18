export type Analysis = {
  summary: string;
  pillars: {
    innovate: string;
    investigate: string;
    choose: string;
    pinHome: string;
  };
  blockers: string[];
  trajectory?: string[];
  themes: string[];
  room: {
    title: string;
    prompt: string;
    voices: string[];
  };
  pinHome: string;
  safetyNote?: string;
};

export type RoomSubject = "Family wounds" | "Belonging" | "Permission to choose";

export type ChatMessage = {
  role: "user" | "ai" | "community";
  text: string;
};
