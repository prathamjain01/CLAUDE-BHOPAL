# PathPilot --- System Architecture

## 1. Architecture Style

Use a **modular monolith** for the hackathon.

Do NOT split the backend into microservices.

``` text
Next.js Frontend
       |
       | REST/JSON
       v
Node.js + Express API
       |
       +--------------------+
       |                    |
       v                    v
Core Domain Modules      AI Adapter
       |                    |
       v                    v
MongoDB Atlas             Claude API
```

## 2. Frontend Architecture

``` text
frontend/
├── app/
│   ├── onboarding/
│   ├── assessment/
│   ├── pathway/
│   ├── progress/
│   ├── work-map/
│   └── share/
├── components/
├── lib/
│   ├── api/
│   ├── validation/
│   └── utils/
├── hooks/
├── types/
└── public/
```

Rule: - Each developer owns specific top-level folders. - Shared
components require coordination. - Avoid editing another developer's
owned folder.

## 3. Backend Architecture

``` text
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── learner/
│   │   ├── skills/
│   │   ├── resources/
│   │   ├── pathways/
│   │   ├── projects/
│   │   ├── progress/
│   │   └── work-mapping/
│   ├── ai/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── routes/
│   └── app.ts
├── tests/
└── server.ts
```

Each backend module should contain:

``` text
module/
├── model.ts
├── schema.ts
├── controller.ts
├── service.ts
├── routes.ts
└── tests/
```

## 4. Core Data Model

MongoDB collections:

``` text
users
learnerProfiles
skills
skillDependencies
resources
projects
learningPaths
progress
workCategories
workSkills
```

### Why MongoDB?

The application has nested pathway steps, resource metadata, project
acceptance criteria, and learner context. MongoDB allows flexible
documents while still supporting references for reusable entities.

Do not put the entire skill graph into every learner document. Keep
reusable skills and dependencies separate.

## 5. AI Boundary

``` text
Client
  ↓
Backend
  ↓
Retrieve trusted context
  ↓
Claude
  ↓
Structured JSON
  ↓
Zod validation
  ↓
Business-rule validation
  ↓
MongoDB
```

Never:

``` text
Client → Claude directly
```

Never:

``` text
Claude → MongoDB directly
```

## 6. Pathway Generation Logic

``` text
1. Read learner profile.
2. Identify target goal.
3. Resolve target skills.
4. Calculate missing prerequisites.
5. Retrieve eligible free resources.
6. Retrieve suitable projects.
7. Apply time/device/language constraints.
8. Generate candidate ordered pathway.
9. Ask Claude to personalize/explain the pathway.
10. Validate response.
11. Save pathway.
12. Return pathway to frontend.
```

## 7. Deterministic vs AI Responsibilities

### Deterministic

-   Skill dependencies.
-   Resource URLs.
-   Resource metadata.
-   Work-category data.
-   Hard constraints.
-   Acceptance criteria.
-   Progress state.

### AI

-   Natural-language understanding.
-   Explanations.
-   Personalization.
-   Beginner-friendly wording.
-   Re-planning rationale.

## 8. API Contract

``` text
POST /api/auth/register
POST /api/auth/login

POST /api/learner/profile
GET  /api/learner/profile

GET  /api/skills
POST /api/assessment

GET  /api/resources

POST /api/pathways/generate
GET  /api/pathways/:id
POST /api/pathways/:id/replan

POST /api/projects/:id/submit

PATCH /api/progress/:stepId

GET /api/work-mapping
GET /api/pathways/:id/share
```

## 9. Security Boundary

Frontend: - Never stores API secrets. - Sends authenticated requests.

Backend: - Validates every request. - Owns AI API keys. - Owns database
access. - Applies authorization.

## 10. Deployment

``` text
Next.js → Vercel
Node/Express → Render
MongoDB → MongoDB Atlas
```

Dockerfile should exist for backend reproducibility.

## 11. Future Architecture

If scale requires it later:

``` text
API Gateway
   |
   +-- Learner Service
   +-- Pathway Service
   +-- Resource Service
   +-- Work Mapping Service
   +-- AI Service
```

Do not build this architecture for the hackathon.
