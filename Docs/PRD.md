# PathPilot --- Product Requirements Document (PRD)

## 1. Product Definition

**Product name:** PathPilot\
**Theme:** Skills and digital literacy in a Tier-2 city\
**Primary user:** A student or working learner acquiring technology
skills outside a formal institution\
**Secondary users:** Mentors, community learning spaces, libraries

### One-line product definition

PathPilot is a mobile-first guidance tool that helps a self-directed
learner determine **what to learn next, in what order, and toward what
realistic outcome**, using the learner's current knowledge, goal,
circumstances, device, available time, prior exposure, and progress.

## 2. Problem Statement

A self-directed learner in Bhopal cannot reliably determine what to
learn next, in what order, or toward what realistic outcome. Content is
abundant, but sequencing, feedback, and local relevance are absent.

The result is high drop-off, wasted spending on generic courses, and
skills that do not map to work within the learner's reach.

## 3. Product Goal

Turn a learner's current situation into a short, ordered, actionable
learning path assembled from free resources, with:

1.  A clear next skill.
2.  A suitable free learning resource.
3.  A small verifiable project at each step.
4.  A clear explanation of what the skill can lead to.
5.  Local/remote work-category mapping without promising employment.
6.  Progress-based re-planning.
7.  Beginner-friendly explanations of tooling basics.
8.  A shareable one-page plan for mentor review.

## 4. Non-Goals

PathPilot is NOT:

-   A generic AI chatbot.
-   A course marketplace.
-   A job-placement guarantee platform.
-   A replacement for teachers/mentors.
-   A platform that claims a learner will get a particular job.
-   A live job-board scraper as an MVP.
-   A social-media/community network as an MVP.

## 5. Core User Journey

``` text
Structured Intake
      ↓
Current Skill Understanding
      ↓
Goal + Constraints
      ↓
Skill Gap / Prerequisite Analysis
      ↓
Ordered Learning Path
      ↓
Free Resource + Project per Step
      ↓
Evidence / Progress
      ↓
Work-Category Mapping
      ↓
Re-planning
      ↓
Shareable Plan
```

## 6. MVP Scope

### P0 --- Must Have

#### A. Structured Intake

Capture without assuming technical vocabulary:

-   Current skills/prior exposure.
-   Goal.
-   Available device.
-   Daily/weekly time.
-   Internet constraints.
-   Preferred language.
-   Current learning context.
-   Location at city level.

#### B. Pathway Generation

Generate an ordered path from a curated resource catalogue using:

-   Skill prerequisites.
-   Learner's current level.
-   Goal.
-   Available time.
-   Device constraints.
-   Free-resource requirement.

#### C. Project Checkpoints

Every major learning step contains:

-   Small project.
-   Skill being demonstrated.
-   Acceptance criteria.
-   Evidence/submission mechanism.

#### D. Work Mapping

Map the path to:

-   Work categories.
-   Required skills.
-   Where that category may be found: Bhopal, Indore, or remote.

No employer-level promises in the MVP.

#### E. Progress + Re-planning

Learner can report completion/difficulty and receive an adjusted path.

#### F. Beginner Support

Explain tooling basics such as:

-   Files/folders.
-   Accounts.
-   Git/GitHub basics.
-   Browser/dev tools.
-   Basic terminology.

#### G. Shareable Summary

Generate a one-page learning plan suitable for mentor review and
annotation.

### P1 --- Should Have

-   Hindi/Hinglish beginner explanations.
-   PWA/installable mobile experience.
-   Cached metadata for low-bandwidth usage.
-   Mentor review mode.
-   More detailed evidence validation.

### P2 --- Future

-   Community learning-space integration.
-   Library/cohort workflows.
-   Automated resource freshness checks.
-   More cities.
-   Live job-data ingestion with strong source validation.

## 7. Key Functional Requirements

### FR-01: Intake

System shall collect learner context without requiring prior technical
vocabulary.

### FR-02: Skill Representation

System shall represent skills and prerequisite relationships.

### FR-03: Resource Catalogue

System shall store curated free resources with structured metadata.

### FR-04: Path Generation

System shall produce ordered steps and explain why each step is present.

### FR-05: Project Evidence

System shall attach a concrete project and acceptance criteria to
learning steps.

### FR-06: Work Mapping

System shall map skills to work categories and location types.

### FR-07: Progress

System shall record progress for a saved plan.

### FR-08: Re-planning

System shall adjust future steps when the learner reports progress or
difficulty.

### FR-09: Beginner Support

System shall provide plain-language explanations for basic tooling.

### FR-10: Shareable Plan

System shall produce a one-page summary.

## 8. Constraints

-   No employment guarantees.
-   Only resources whose terms permit linking/reuse should be included.
-   No learner data retained beyond the session unless the learner
    explicitly saves a plan.
-   Mobile-first.
-   Usable on low-bandwidth connections.
-   Free resources are the default.
-   Local relevance must not be invented; work-category data must be
    based on a documented dataset.

## 9. Success Criteria

1.  Time from intake to usable plan: under 5 minutes.
2.  Every path step has a resource and concrete project.
3.  Mentors judge the path appropriate for the learner profile in a
    clear majority of test cases.
4.  A learning space/mentor network indicates the tool could be used
    with a cohort.
5.  Re-planning produces a meaningful change when learner
    progress/difficulty changes.
6.  No unsupported employment claim appears in the product.

## 10. Demo Acceptance Scenario

Input:

-   Beginner learner in Bhopal.
-   Laptop.
-   1 hour/day.
-   Wants to learn frontend development.
-   Knows basic HTML but little/no JavaScript.
-   Wants free resources.

Expected output:

1.  System does not restart HTML unnecessarily.
2.  JavaScript is identified as a prerequisite.
3.  A short ordered path is generated.
4.  Each step contains a free resource and small project.
5.  The learner can mark progress.
6.  The path can be re-planned.
7.  The resulting skills map to work categories without guaranteeing
    employment.

## 11. Product Principle

**Focus on the learner's actual next decision, not on generating more
content.**
