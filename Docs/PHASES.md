# PathPilot --- Development Phases

## Phase 0 --- Alignment

Duration: 2--3 hours

Deliver:

-   Final PRD.
-   SRS.
-   Architecture.
-   API contracts.
-   Folder ownership.
-   Git branches.
-   MongoDB schema draft.
-   3--5 demo learner profiles.

**Gate:** Nobody starts feature coding until API/data contracts are
agreed.

## Phase 1 --- Foundation

Duration: Day 1

### Developer 1

-   Next.js project.
-   Tailwind.
-   Layout.
-   Routing.
-   Design system.

### Developer 2

-   Express server.
-   TypeScript.
-   MongoDB connection.
-   Mongoose setup.
-   Base error handling.

### Developer 3

-   AI adapter interface.
-   Claude integration skeleton.
-   Prompt/response schema.

### Developer 4

-   Seed data structure.
-   Skills.
-   Dependencies.
-   Resources.
-   Projects.
-   Work categories.

**Gate:** All four can run their part locally.

## Phase 2 --- Core Intake + Data

Duration: Days 2--3

### Developer 1

Build onboarding UI.

### Developer 2

Build learner profile APIs.

### Developer 3

Build AI learner-intent parser and validation.

### Developer 4

Create curated resource/project/work datasets.

**Gate:** Learner intake can produce a valid structured profile.

## Phase 3 --- Path Generation

Duration: Days 4--5

### Developer 1

Build pathway UI using mock API.

### Developer 2

Build skill-gap and prerequisite APIs.

### Developer 3

Build pathway AI orchestration.

### Developer 4

Connect resources/projects to skills.

**Gate:** One learner can receive a complete ordered pathway.

## Phase 4 --- Project + Progress

Duration: Days 6--7

Build:

-   Project checkpoints.
-   Acceptance criteria.
-   Evidence submission.
-   Progress states.

**Gate:** Learner can go from learning step → project → evidence →
progress.

## Phase 5 --- Re-planning

Duration: Days 8--9

Scenarios:

1.  Learner completed a step.
2.  Learner is stuck.
3.  Learner has less time.
4.  Learner changes goal.

**Gate:** Future pathway changes meaningfully and safely.

## Phase 6 --- Work Mapping + Share

Duration: Days 9--10

Build:

-   Work category mapping.
-   Skill gap display.
-   Bhopal/Indore/remote labels.
-   Shareable one-page plan.

**Gate:** No employment guarantee language.

## Phase 7 --- UX + Low Bandwidth

Duration: Day 11

-   Mobile testing.
-   Network throttling.
-   Loading states.
-   Empty states.
-   Accessibility.
-   Error states.

## Phase 8 --- Integration

Duration: Day 12

Full journey:

``` text
Landing
→ Intake
→ Skill Snapshot
→ Path
→ Resource
→ Project
→ Progress
→ Re-plan
→ Work Mapping
→ Share
```

No major new features after this point.

## Phase 9 --- Testing + Demo

Duration: Days 13--14

Test 5 learner profiles:

1.  Complete beginner.
2.  Some HTML/CSS.
3.  Limited internet.
4.  Only mobile.
5.  Learner who changes goal/time.

Prepare:

-   Demo script.
-   Architecture explanation.
-   AI explanation.
-   Constraint explanation.
-   Failure handling.
-   2-minute and 5-minute demo versions.

## Final Freeze

After freeze:

-   Only bug fixes.
-   No new features.
-   Backup deployment.
-   Backup demo data.
-   Record demo video.
