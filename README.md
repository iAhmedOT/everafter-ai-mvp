# EverAfter AI MVP

Approved v0.2: landing website + private story tool + pattern detection + "where this is leading now" + community-led Reflection Room demo with AI moderator. Real multi-user chat is intentionally deferred until there are users, consent, storage, and moderation infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## AI behavior

- Works with a local heuristic fallback by default.
- If `OPENAI_API_KEY` is set, `/api/analyze` uses OpenAI and returns the same structured JSON shape.
- No stories are saved in v0.1.
- Real user group chat is intentionally excluded from v0.1 for safety.

## Safety

EverAfter is not therapy. The MVP avoids diagnosis, forced forgiveness, and sharing private details. Shared room content is theme-based and anonymized.
