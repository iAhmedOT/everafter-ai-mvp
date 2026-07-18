# Pixel Collaboration Update

This note is for Ahmed's collaborator (human or bot) working in the same repo.

## What Pixel changed

Pixel performed a maintainability refactor without changing the intended MVP flow.

### Structural changes
- extracted shared app types into `lib/types.ts`
- extracted room configuration and helper functions into `lib/room-data.ts`
- extracted analysis fallback/prompt logic into `lib/analysis.ts`
- extracted moderation fallback/prompt logic into `lib/moderation.ts`
- split the homepage into smaller pieces:
  - `components/marketing-sections.tsx`
  - `components/story-tool.tsx`
  - `components/online-room.tsx`
- reduced `app/page.tsx` to orchestration/state/event handling

### Documentation added
- `docs/everafter-audit.md`
- `docs/everafter-refactor-plan.md`
- `docs/pixel-ownership-brief.md`
- `docs/pixel-collab-update.md`

## Intent of the refactor

The goal was **not** to redesign the product. The goal was to make it easier for multiple contributors to work safely in parallel.

In practice, that means:
- room config now has one source of truth
- shared types are no longer duplicated across files
- API route files are thinner
- UI sections are easier to edit independently

## What to touch now

- Marketing copy/layout: start in `components/marketing-sections.tsx`
- Story input / reveal flow: start in `components/story-tool.tsx`
- Online room UI: start in `components/online-room.tsx`
- Analysis behavior: start in `lib/analysis.ts` and `app/api/analyze/route.ts`
- Moderator behavior: start in `lib/moderation.ts` and `app/api/moderate/route.ts`

## What Pixel verified

Pixel ran:

```bash
npm run build
```

and confirmed the app still builds successfully after the refactor.

## Suggested collaborator etiquette

- avoid re-inlining shared strings/config back into page components
- update docs when changing architecture assumptions
- keep privacy/safety wording honest if storage or provider behavior changes
- prefer small, isolated edits over another giant all-in-one page file
