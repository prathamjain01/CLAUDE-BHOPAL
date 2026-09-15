# PathPilot --- Developer Ownership & Team Workflow

## 1. Core Rule

The team is split by **ownership boundaries**, not just by features.

The objective is to allow four developers to work in parallel without
repeatedly editing the same files.

### Golden rule

> If a file belongs to another developer's ownership area, do not modify
> it directly unless the team agrees first.

## 2. Developer 1 --- Frontend / UX Owner

### Responsibilities

-   Next.js application.
-   Tailwind CSS.
-   Routing.
-   Onboarding.
-   Learner profile screens.
-   Shared UI primitives.
-   Responsive/mobile-first implementation.
-   Loading/error/empty states.

### Owns

``` text
frontend/app/
frontend/components/ui/
frontend/components/onboarding/
frontend/components/learner/
frontend/hooks/
frontend/lib/api-client/
```

### Does NOT own

``` text
backend/
data/
AI prompts
MongoDB schemas
pathway business logic
```

### Deliverables

-   Landing page.
-   Structured intake.
-   Skill snapshot.
-   Responsive shell.
-   API integration layer.

------------------------------------------------------------------------

## 3. Developer 2 --- Backend / Database Owner

### Responsibilities

-   Node.js + Express.
-   MongoDB Atlas.
-   Mongoose.
-   Authentication.
-   Learner APIs.
-   Skill APIs.
-   Resource APIs.
-   Validation.
-   Error handling.

### Owns

``` text
backend/src/modules/auth/
backend/src/modules/learner/
backend/src/modules/skills/
backend/src/modules/resources/
backend/src/config/
backend/src/middleware/
backend/src/utils/
```

### Does NOT own

``` text
frontend UI
AI prompt logic
work-mapping dataset
project UI
```

### Deliverables

-   MongoDB connection.
-   Mongoose models.
-   REST endpoints.
-   Validation.
-   Authentication.
-   API documentation.

------------------------------------------------------------------------

## 4. Developer 3 --- AI + Adaptive Path Owner

### Responsibilities

-   Claude API.
-   Prompt engineering.
-   AI response schemas.
-   Pathway generation.
-   Re-planning.
-   Progress logic.
-   Pathway API.

### Owns

``` text
backend/src/ai/
backend/src/modules/pathways/
backend/src/modules/progress/
frontend/components/pathway/
frontend/components/progress/
```

### Important boundary

Developer 3 does NOT create the source-of-truth skill graph or invent
resource URLs.

AI receives trusted data from Developer 2/4.

### Deliverables

-   AI adapter.
-   Structured Claude output.
-   Path generation.
-   Re-planning.
-   Progress updates.
-   Pathway UI.

------------------------------------------------------------------------

## 5. Developer 4 --- Content / Project / Work Mapping Owner

### Responsibilities

-   Curated learning resource catalogue.
-   Skill-to-resource mapping.
-   Projects.
-   Acceptance criteria.
-   Work-category dataset.
-   Location classification.
-   Project and work-mapping UI.
-   Shareable plan.

### Owns

``` text
data/
backend/src/modules/projects/
backend/src/modules/work-mapping/
frontend/components/projects/
frontend/components/work-map/
frontend/components/share/
```

### Deliverables

-   High-quality free resources.
-   Skill metadata.
-   Mini-project catalogue.
-   Acceptance criteria.
-   Bhopal/Indore/remote work-category dataset.
-   Shareable summary.

------------------------------------------------------------------------

## 6. Shared File Policy

These files are conflict-prone:

``` text
package.json
package-lock.json
backend/src/app.ts
backend/src/server.ts
frontend/app/layout.tsx
frontend/app/globals.css
README.md
docker-compose.yml
```

### Rule

One person changes these at a time.

Suggested owners:

``` text
package.json / frontend config → Developer 1
backend config → Developer 2
AI environment/config → Developer 3
data scripts → Developer 4
```

If a dependency is required, request it rather than independently
changing package files.

------------------------------------------------------------------------

## 7. API Contract Ownership

Developer 2 owns the canonical API contract.

Developer 3 owns AI-specific request/response schemas.

Developer 1 consumes APIs.

Developer 4 provides data structures.

Nobody should silently change a shared response shape.

Example:

``` json
{
  "steps": [
    {
      "id": "step_01",
      "skill": "javascript",
      "reason": "Prerequisite for React",
      "resource": {
        "title": "JavaScript Fundamentals",
        "url": "https://example.com"
      },
      "project": {
        "title": "Expense Tracker",
        "criteria": []
      },
      "status": "not_started"
    }
  ]
}
```

Changes require team agreement.

------------------------------------------------------------------------

## 8. Git Workflow

Branches:

``` text
main
develop

feat/frontend-onboarding
feat/backend-api
feat/ai-pathway
feat/data-workmapping
```

Flow:

``` text
Developer branch
      ↓
Pull Request
      ↓
develop
      ↓
Integration testing
      ↓
main
```

No direct pushes to `main`.

## 9. Commit Convention

``` text
feat: add learner onboarding
feat: add pathway generation
fix: handle invalid learner profile
fix: handle AI timeout
docs: update architecture
test: add skill dependency tests
refactor: separate resource service
```

## 10. Daily Integration

At the end of every work session:

1.  Push branch.
2.  Open/update PR.
3.  Tell team what changed.
4.  Mention any API/schema change.
5.  Mention files that another developer may need.
6.  Do not merge half-working code into `main`.

## 11. Mock-First Development

Frontend should not wait for backend.

Create mock data matching the API contract:

``` text
frontend/mocks/
```

Developer 1 builds UI using mock JSON.

When Developer 2 finishes the API, only the API client changes.

This dramatically reduces blocking and merge conflicts.

## 12. AI Development Rule

Never build the product as:

``` text
User → Claude → Everything
```

Build:

``` text
User
 ↓
Backend validation
 ↓
Skill/resource/project data
 ↓
Rules
 ↓
Claude
 ↓
Zod validation
 ↓
Business validation
 ↓
Response
```

## 13. Source-of-Truth Rule

### Database is source of truth for:

-   Skills.
-   Prerequisites.
-   Resources.
-   Projects.
-   Work categories.

### Code/rules are source of truth for:

-   Hard constraints.
-   Progress state.
-   Access control.
-   Validation.

### Claude is source of truth for NONE of the above.

Claude is the reasoning/personalization layer.

## 14. What Must Not Be Added Without Team Approval

Do not independently add:

-   Another frontend framework.
-   Python backend.
-   Microservices.
-   Kubernetes.
-   Neo4j.
-   Redis.
-   Vector database.
-   Complex recommendation ML.
-   Live job scraping.

These can consume hackathon time without solving the PS better.

## 15. Final Team Ownership Matrix

  Area                       D1          D2          D3                  D4
  ----------------- ----------- ----------- ----------- -------------------
  Next.js             **Owner**                         
  UI/UX               **Owner**                                     Support
  MongoDB                         **Owner**             
  Node/Express                    **Owner**     Support 
  Skill graph                         Owner     Support      **Data owner**
  Resources                             API                       **Owner**
  Claude                                      **Owner** 
  Path generation                       API   **Owner**                Data
  Re-planning                                 **Owner** 
  Projects                              API                       **Owner**
  Progress                              API   **Owner** 
  Work mapping                          API                       **Owner**
  Shareable plan             UI         API       Logic   **Content owner**
  Testing                    UI     Backend    AI/logic                Data
  Deployment           Frontend     Backend          AI                Data

## 16. Definition of Team Success

The project is successful when a real learner can:

``` text
1. Enter their situation
2. Understand their current position
3. See what to learn next
4. Learn from a free resource
5. Build a small project
6. Show evidence
7. Report progress/difficulty
8. Receive an adjusted path
9. Understand what category of work the skills relate to
10. Share the plan with a mentor
```

The product should always stay focused on this flow.
