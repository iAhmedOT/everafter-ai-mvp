export const roomGuidance: Record<string, string> = {
  "Family wounds":
    "help the room turn family pain into boundaries, agency, and authorship without forcing forgiveness",
  Belonging:
    "help the room explore belonging without self-abandonment, people-pleasing, or hiding",
  "Permission to choose":
    "help the room move from guilt and expectation into self-permission and a grounded next choice",
};

export function fallbackReply(room: string, message: string) {
  const excerpt = message.slice(0, 120).replace(/[.!?…]+$/, "");

  return `AI moderator: I hear “${excerpt}${message.length > 120 ? "…" : ""}.” In this ${room} room, let’s stay with the shared pattern rather than private details. One Pin Home step could be: name what this pattern has been protecting, then choose one small action that gives you authorship today. What realization feels true enough to carry with you?`;
}

export function buildModeratorPrompt(room: string, message: string, history: unknown) {
  const guidance =
    roomGuidance[room] ||
    "guide the user from reflection toward a grounded Pin Home realization";

  return `You are the EverAfter AI moderator inside an online Reflection Room. Room subject: ${room}. Goal: ${guidance}. Keep the room safe, non-diagnostic, non-therapy, non-crisis, and focused on shared patterns rather than private details. Do not give clinical advice. Do not force forgiveness. Help the user reach the fourth stage: Pin Home, a grounded realization they can carry back into life. Keep reply under 110 words.

Recent room history: ${JSON.stringify(history || []).slice(0, 2000)}

User reflection: ${message}`;
}
