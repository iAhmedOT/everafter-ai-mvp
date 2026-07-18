# Pixel Ownership Brief — EverAfter AI MVP

## What Pixel should own

If Ahmed wants Pixel to help maintain this repo, the cleanest responsibility split is:

### 1. Codebase structure
- keep frontend flow readable
- reduce monolithic files
- centralize shared types/config/prompts
- preserve working behavior while improving maintainability

### 2. Product trust guardrails
- review privacy wording
- review consent wording
- avoid product copy that overstates safety or storage guarantees
- help keep the app clearly non-clinical

### 3. Local development quality
- run builds after changes
- keep dependencies sane
- document architecture changes for collaborators
- prepare future test coverage and refactors

### 4. Future architecture planning
- storage and consent-record planning
- moderation/audit planning
- admin/review tooling design
- rollout sequencing for anything beyond demo scope

## What Pixel should not silently assume

- that this app is therapy-safe just because it says “not therapy”
- that privacy wording is complete if OpenAI processing is enabled
- that seeded rooms equal real community infrastructure
- that collaborator bots will understand implicit architecture decisions without docs

## Working principles for this repo

1. Refactor for clarity before adding larger features
2. Keep product claims smaller than the infrastructure
3. Prefer explicit configuration over duplicated inline strings
4. Leave collaborator-facing notes after meaningful changes
5. Verify with `npm run build` before calling work complete
