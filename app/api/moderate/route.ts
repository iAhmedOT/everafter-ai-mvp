import { NextRequest, NextResponse } from "next/server";

const roomGuidance: Record<string, string> = {
  "Family wounds": "help the room turn family pain into boundaries, agency, and authorship without forcing forgiveness",
  "Belonging": "help the room explore belonging without self-abandonment, people-pleasing, or hiding",
  "Permission to choose": "help the room move from guilt and expectation into self-permission and a grounded next choice",
};

function fallbackReply(room: string, message: string) {
  const subject = roomGuidance[room] || "help the room move from the stuck pattern toward Home";
  const excerpt = message.slice(0, 120).replace(/[.!?…]+$/, "");
  return `AI moderator: I hear “${excerpt}${message.length > 120 ? "…" : ""}.” In this ${room} room, let’s stay with the shared pattern rather than private details. One Pin Home step could be: name what this pattern has been protecting, then choose one small action that gives you authorship today. What realization feels true enough to carry with you?`;
}

export async function POST(req: NextRequest) {
  const { room, message, history } = await req.json().catch(() => ({ room: "", message: "", history: [] }));
  if (!message || typeof message !== "string" || message.trim().length < 2) {
    return NextResponse.json({ error: "Message required." }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });

  const guidance = roomGuidance[room as string] || "guide the user from reflection toward a grounded Pin Home realization";
  const prompt = `You are the EverAfter AI moderator inside an online Reflection Room. Room subject: ${room}. Goal: ${guidance}. Keep the room safe, non-diagnostic, non-therapy, non-crisis, and focused on shared patterns rather than private details. Do not give clinical advice. Do not force forgiveness. Help the user reach the fourth stage: Pin Home, a grounded realization they can carry back into life. Keep reply under 110 words.\n\nRecent room history: ${JSON.stringify(history || []).slice(0, 2000)}\n\nUser reflection: ${message}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.65,
      }),
    });
    if (!res.ok) return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || fallbackReply(room || "Reflection", message.trim());
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });
  }
}
