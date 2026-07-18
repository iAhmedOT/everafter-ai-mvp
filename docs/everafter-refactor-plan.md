# EverAfter AI Refactor Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make the EverAfter MVP easier to own collaboratively without changing the core user flow.

**Architecture:** Separate static marketing sections from interactive story tooling, centralize room configuration and shared types in `lib/`, and keep API prompts/fallback logic out of route files where possible.

**Tech Stack:** Next.js App Router, React, TypeScript, Vercel Analytics

---

### Task 1: Extract shared domain types

**Objective:** Move shared `Analysis`, `RoomSubject`, and `ChatMessage` types into a reusable module.

**Files:**
- Create: `lib/types.ts`
- Modify: `app/page.tsx`
- Modify: `app/api/analyze/route.ts`

**Verification:** `npm run build`

### Task 2: Centralize room configuration

**Objective:** Create one source of truth for room subjects, prompts, seeded reflections, and helper functions.

**Files:**
- Create: `lib/room-data.ts`
- Modify: `app/page.tsx`
- Modify: `app/api/moderate/route.ts`

**Verification:** room subject cards still render and room entry still works.

### Task 3: Extract analysis helpers

**Objective:** Move local analysis logic and prompt construction into `lib/analysis.ts` so the route is thinner and easier to test.

**Files:**
- Create: `lib/analysis.ts`
- Modify: `app/api/analyze/route.ts`

**Verification:** `/api/analyze` still works with and without `OPENAI_API_KEY`.

### Task 4: Extract moderation helpers

**Objective:** Move fallback reply and moderator prompt building into `lib/moderation.ts`.

**Files:**
- Create: `lib/moderation.ts`
- Modify: `app/api/moderate/route.ts`

**Verification:** room moderation still returns a valid reply when the key is missing.

### Task 5: Break the page into components

**Objective:** Split the homepage into smaller components so collaborators can edit sections without fighting one monolithic file.

**Files:**
- Create: `components/marketing-sections.tsx`
- Create: `components/story-tool.tsx`
- Create: `components/online-room.tsx`
- Modify: `app/page.tsx`

**Verification:** `npm run build` and smoke-test the homepage locally.

### Task 6: Add project documentation

**Objective:** Leave clear docs for collaborators so future edits are intentional rather than guesswork.

**Files:**
- Create: `docs/everafter-audit.md`
- Create: `docs/everafter-refactor-plan.md`
- Create: `docs/pixel-ownership-brief.md`
- Create: `docs/pixel-collab-update.md`

**Verification:** docs accurately describe the updated structure and workflow.
