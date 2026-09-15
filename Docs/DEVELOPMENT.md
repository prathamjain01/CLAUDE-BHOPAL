# PathPilot --- Development Guide

## 1. Repository Structure

``` text
pathpilot/
├── frontend/
├── backend/
├── data/
├── docs/
├── scripts/
├── .github/
├── docker-compose.yml
├── README.md
└── DEVELOPERS.md
```

## 2. Branch Strategy

Protected:

``` text
main
```

Integration:

``` text
develop
```

Developer branches:

``` text
feat/frontend-onboarding
feat/backend-learner
feat/ai-path-engine
feat/data-work-mapping
```

No developer pushes directly to `main`.

## 3. Merge-Conflict Strategy

The repository is divided by ownership.

### Developer 1

Owns:

``` text
frontend/app/
frontend/components/onboarding/
frontend/components/learner/
```

### Developer 2

Owns:

``` text
backend/src/modules/learner/
backend/src/modules/skills/
backend/src/modules/resources/
```

### Developer 3

Owns:

``` text
backend/src/ai/
backend/src/modules/pathways/
backend/src/modules/progress/
frontend/components/pathway/
frontend/components/progress/
```

### Developer 4

Owns:

``` text
data/
backend/src/modules/projects/
backend/src/modules/work-mapping/
frontend/components/projects/
frontend/components/work-map/
frontend/components/share/
```

Shared files such as:

``` text
package.json
app.ts
routes/index.ts
globals.css
```

should only be changed after agreement in the team channel.

## 4. API-First Coordination

Before implementation, agree on JSON contracts.

Example:

``` json
{
  "goal": "frontend development",
  "steps": [
    {
      "skill": "javascript",
      "resource": {
        "title": "Resource title",
        "url": "https://..."
      },
      "project": {
        "title": "Expense Tracker",
        "criteria": [
          "Add expense",
          "Delete expense"
        ]
      },
      "status": "not_started"
    }
  ]
}
```

Frontend can develop against mock JSON while backend is being built.

## 5. Git Rules

Branch:

``` bash
git checkout -b feat/feature-name
```

Commit format:

``` text
feat: add learner intake
fix: validate pathway response
docs: update API contract
refactor: separate skill service
test: add pathway validation tests
```

Before PR:

``` bash
git pull --rebase origin develop
npm test
npm run lint
npm run build
```

## 6. Pull Request Rules

Every PR must contain:

-   What changed.
-   Why it changed.
-   Screenshots for UI.
-   API example for backend.
-   Test status.
-   Known limitations.

Keep PRs small.

## 7. Environment Variables

Never commit `.env`.

Example:

``` env
MONGODB_URI=
JWT_SECRET=
CLAUDE_API_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_API_URL=
```

Commit:

``` text
.env.example
```

## 8. Testing Strategy

### Frontend

-   Component tests for critical components.
-   Form validation tests.
-   Basic end-to-end happy path.

### Backend

-   Unit tests for skill/path logic.
-   API tests.
-   Validation tests.

### AI

Test fixed learner profiles against expected constraints.

Example:

``` text
Input:
Beginner + 1 hour/day + free resources

Expected:
No paid resource
No advanced prerequisite jump
Path duration fits available time
```

## 9. Definition of Done

A feature is done only when:

-   It works locally.
-   It is responsive.
-   API contract is respected.
-   Errors are handled.
-   No secrets are committed.
-   Critical logic has tests.
-   It follows PS constraints.
-   It can be merged without modifying another team's owned area
    unnecessarily.
