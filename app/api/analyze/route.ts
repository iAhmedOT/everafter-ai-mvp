import { NextRequest, NextResponse } from "next/server";

import { ANALYSIS_MIN_STORY_LENGTH, buildAnalysisPrompt, localAnalyze } from "../../../lib/analysis";
import type { Analysis } from "../../../lib/types";

async function llmAnalyze(story: string): Promise<Analysis | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: buildAnalysisPrompt(story) }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();

  try {
    return JSON.parse(data.choices?.[0]?.message?.content || "null");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { story } = await req.json().catch(() => ({ story: "" }));

  if (!story || typeof story !== "string" || story.trim().length < ANALYSIS_MIN_STORY_LENGTH) {
    return NextResponse.json({ error: "Please share a longer story." }, { status: 400 });
  }

  const ai = await llmAnalyze(story);
  return NextResponse.json(ai || localAnalyze(story));
}
