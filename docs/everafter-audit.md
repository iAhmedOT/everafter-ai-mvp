# EverAfter AI MVP Audit

> Prepared by Pixel after cloning and inspecting `Blendbound/everafter-ai-mvp` locally.

## Executive summary

EverAfter AI is a coherent Next.js MVP for private story reflection, pattern detection, room routing, and AI-moderated follow-up reflection. The concept is strong, the repo builds successfully, and the demo flow matches the product description.

The biggest gaps are not visual polish — they are product trust and codebase maturity:
- privacy wording is stronger than the current infrastructure
- the main page previously concentrated nearly all product logic in one file
- there is no persistence, auth, or moderation audit trail yet
- there are no automated tests yet

## What the product currently does

1. Accepts a private story from the user
2. Sends it to `/api/analyze`
3. Produces an emotional pattern summary, blockers, themes, and a room recommendation
4. Lets the user choose a Reflection Room
5. Opens an AI-moderated room conversation through `/api/moderate`
6. Keeps the experience framed as reflection rather than therapy

## Strengths

- Clear product concept with a readable user journey
- Good MVP discipline: no fake persistence or fake realtime claims in the code
- Safe-ish fallback behavior when OpenAI is unavailable
- Strong product language for a prototype demo
- Build verified successfully during review

## Risks and concerns

### 1. Privacy / consent precision
The app says private stories are not permanently saved, which is good. But when `OPENAI_API_KEY` is enabled, the story is still processed by a third-party provider. User-facing copy should clearly distinguish between:
- not stored by the app
- still processed by the configured AI provider

### 2. Emotionally sensitive domain
This app lives close to therapy-adjacent behavior even if it explicitly rejects clinical framing. That means safety, boundaries, and escalation behavior matter more than in a typical marketing app.

### 3. MVP-shaped architecture
Before refactoring, `app/page.tsx` held marketing sections, tool state, room logic, analytics hooks, and moderator bootstrapping in one component. That made the repo harder to own collaboratively.

### 4. No automated test coverage
There are no route or logic tests covering:
- analysis validation
- fallback analysis shape
- moderator fallback behavior
- invalid input handling

### 5. Loose dependency strategy
`package.json` uses `latest` for the main framework/runtime dependencies. That increases drift risk across collaborator machines and deploys.

## Recommended next actions

1. Add automated tests for analysis and moderation helpers
2. Pin dependency versions instead of `latest`
3. Tighten privacy/consent copy before broader exposure
4. Introduce a small `lib/` layer for shared prompt/config logic
5. Keep room behavior intentionally demo-scoped until real storage and moderation policy exist
