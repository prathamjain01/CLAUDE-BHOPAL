# PathPilot --- Software Requirements Specification (SRS)

## 1. System Scope

PathPilot is a web application with a mobile-first interface. It accepts
a structured learner profile, analyses current skills and constraints,
selects an ordered learning pathway from curated data, uses an LLM for
contextual reasoning/explanation, tracks project evidence and progress,
and maps skills to work categories.

## 2. Actors

### Learner

-   Completes intake.
-   Views pathway.
-   Opens resources.
-   Completes projects.
-   Reports progress/difficulty.
-   Saves/shares plan.

### Mentor

-   Reviews shared plan.
-   Annotates or gives feedback.
-   Does not directly control learner data unless explicitly supported
    by the future mentor workflow.

### System Administrator / Dataset Maintainer

-   Maintains skill graph.
-   Curates resources.
-   Maintains work-category dataset.

## 3. Functional Requirements

### Module A --- Learner Intake

Inputs:

-   Goal.
-   Prior exposure.
-   Current skills.
-   Device.
-   Available time.
-   Internet quality.
-   Preferred language.
-   City.
-   Optional prior learning resources.

Output:

`LearnerProfile`

Validation: - Required goal. - Valid time range. - Supported device
values. - Supported language values.

### Module B --- Skill Engine

Responsibilities:

-   Store skill catalogue.
-   Store prerequisite relationships.
-   Estimate skill gaps from learner inputs.
-   Identify prerequisites required before target skills.

Example:

``` text
React
  └── JavaScript
       └── HTML/CSS basics
```

The skill engine is deterministic. The LLM may explain or personalize
but should not be the source of truth for prerequisite relationships.

### Module C --- Resource Engine

Resource metadata:

-   Title.
-   URL.
-   Provider.
-   Skill.
-   Level.
-   Duration.
-   Language.
-   Cost.
-   Mobile friendliness.
-   Prerequisites.
-   Last reviewed date.

Filtering:

``` text
free
+ learner level
+ language
+ prerequisite readiness
+ time constraint
+ device compatibility
```

### Module D --- Pathway Engine

Inputs:

`LearnerProfile + SkillGap + SkillGraph + ResourceCatalogue + ProjectCatalogue`

Output:

``` json
{
  "goal": "frontend development",
  "steps": [
    {
      "skill": "javascript fundamentals",
      "reason": "...",
      "estimatedDays": 7,
      "resourceIds": [],
      "projectId": "",
      "acceptanceCriteria": []
    }
  ]
}
```

### Module E --- AI Reasoning

LLM is responsible for:

-   Understanding natural-language learner descriptions.
-   Explaining recommendations.
-   Personalizing the presentation.
-   Producing beginner-friendly explanations.
-   Suggesting re-planning rationale.

LLM must NOT:

-   Invent resource URLs.
-   Invent work opportunities.
-   Override hard prerequisites.
-   Make employment guarantees.
-   Persist data independently.

### Module F --- Project Checkpoints

Each project has:

-   Objective.
-   Skills demonstrated.
-   Difficulty.
-   Acceptance criteria.
-   Evidence types.

Evidence may include:

-   GitHub URL.
-   Deployed URL.
-   Screenshot.
-   Text explanation.

### Module G --- Progress and Re-planning

Progress states:

``` text
NOT_STARTED
IN_PROGRESS
COMPLETED
BLOCKED
```

Re-planning triggers:

-   Step completed.
-   Learner reports difficulty.
-   Learner's available time changes.
-   Goal changes.

### Module H --- Work Mapping

Work categories contain:

-   Category name.
-   Location type.
-   Required skills.
-   Optional skills.
-   Source/date.

Location types:

``` text
Bhopal
Indore
Remote
```

The system describes categories of work and required skills. It does not
guarantee employment.

### Module I --- Shareable Summary

Summary contains:

-   Learner goal.
-   Current skill snapshot.
-   Ordered pathway.
-   Current progress.
-   Projects.
-   Next recommended step.

## 4. Non-Functional Requirements

### Performance

-   Initial usable screen should load quickly on normal mobile networks.
-   API responses should generally remain below 2 seconds excluding
    external LLM latency.
-   AI generation should show a clear loading state.

### Availability

-   Graceful fallback if AI provider is unavailable.
-   Curated/static pathway templates can serve as fallback for common
    goals.

### Security

-   Password hashing with bcrypt/Argon2.
-   JWT or secure session mechanism.
-   Input validation with Zod.
-   Rate limiting.
-   CORS configuration.
-   Helmet/security headers.
-   Secrets only in environment variables.

### Privacy

-   Session-only learner data by default.
-   Explicit save action required for persistence.
-   Do not send unnecessary personal information to the LLM.

### Accessibility

-   Keyboard navigation.
-   Readable typography.
-   Strong semantic structure.
-   Avoid color-only status indicators.

## 5. Error Handling

### Invalid learner input

Return validation errors.

### AI timeout

Use retry with bounded attempts, then fallback to deterministic pathway
generation.

### Invalid AI JSON

Validate using Zod. Reject invalid output; do not save it directly.

### Resource unavailable

Mark resource as unavailable and choose another curated resource.

### Missing work data

Show that mapping is unavailable rather than inventing a category.

## 6. Acceptance Criteria

A feature is complete only when:

-   API contract is documented.
-   Input validation exists.
-   Happy path works.
-   Error path works.
-   At least one test exists for critical logic.
-   No feature violates PS constraints.
