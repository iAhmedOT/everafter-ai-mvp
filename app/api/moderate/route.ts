import { NextRequest, NextResponse } from "next/server";

import { buildModeratorPrompt, fallbackReply } from "../../../lib/moderation";

export async function POST(req: NextRequest) {
  const { room, message, history } = await req.json().catch(() => ({
    room: "",
    message: "",
    history: [],
  }));

  if (!message || typeof message !== "string" || message.trim().length < 2) {
    return NextResponse.json({ error: "Message required." }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: buildModeratorPrompt(room, message, history) }],
        temperature: 0.65,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      fallbackReply(room || "Reflection", message.trim());

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: fallbackReply(room || "Reflection", message.trim()) });
  }
}
