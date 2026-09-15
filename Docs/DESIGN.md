# PathPilot --- UI/UX Design Specification

## 1. Design Objective

The interface must solve the actual PS problem: a learner should quickly
understand **what to learn next, why, how to learn it, what to build,
and what that skill can lead toward**.

The interface should not feel like a generic AI chatbot.

## 2. Design Principles

1.  Mobile-first.
2.  Beginner-first language.
3.  One clear next action.
4.  Avoid technical jargon during intake.
5.  Show reasoning, not just recommendations.
6.  Keep pages lightweight.
7.  Make progress visible.
8.  Never imply employment guarantees.

## 3. Main Screens

### Screen 1 --- Landing

Content:

-   Problem-focused headline.
-   Short explanation.
-   CTA: "Build my learning path".

Avoid: - Large AI marketing claims. - Generic "AI-powered future"
language.

### Screen 2 --- Structured Intake

Use cards, radio buttons, chips and simple questions.

Sections:

``` text
Your goal
What you already know
How much time you have
Your device
Internet access
Preferred language
Location
```

### Screen 3 --- Skill Snapshot

Show:

``` text
You already have
✓ HTML basics
✓ CSS basics

You need next
→ JavaScript fundamentals

Later
→ React
```

### Screen 4 --- Generated Path

Primary card:

``` text
NEXT STEP
JavaScript Fundamentals

Why:
React depends on JavaScript fundamentals.

Time:
7 days @ 1 hour/day

Learn:
[Free Resource]

Build:
[Mini Project]
```

Then show future steps below.

### Screen 5 --- Project Checkpoint

Display:

-   Project objective.
-   Skills being tested.
-   Acceptance criteria.
-   Submit evidence.

Example:

``` text
Expense Tracker

□ Add expense
□ Delete expense
□ Calculate total
□ Save data
□ Filter expenses
```

### Screen 6 --- Progress

Use a simple timeline:

``` text
✓ HTML
✓ CSS
● JavaScript
○ React
○ Git
```

### Screen 7 --- Re-plan

Ask:

``` text
How is this step going?

○ Completed
○ I need more practice
○ I am stuck
○ My available time changed
```

Then explain what changed in the plan.

### Screen 8 --- Work Mapping

Use wording:

> "Work categories this path is preparing you for"

Not:

> "Jobs you will get"

Display:

``` text
Frontend Development
Required skills:
HTML, CSS, JavaScript, React, Git

Where this category may be found:
Bhopal / Indore / Remote
```

### Screen 9 --- Shareable Summary

One-page printable/mobile summary:

-   Goal.
-   Current skills.
-   Next skills.
-   Projects.
-   Progress.
-   Work categories.
-   Mentor notes.

## 4. UX Rules

### Rule 1

Never make the learner choose from 100 courses.

### Rule 2

Always surface one recommended next step.

### Rule 3

Every recommendation must answer:

> Why this now?

### Rule 4

Every major skill must connect to a project.

### Rule 5

Work mapping is informational, not a promise.

## 5. Responsive Breakpoints

Mobile-first:

``` text
< 640px   Mobile
640–1024  Tablet
> 1024px  Desktop
```

## 6. Low-Bandwidth Requirements

-   Avoid autoplay video.
-   Avoid unnecessary images.
-   Lazy-load non-critical UI.
-   Cache static metadata.
-   Use text-first resource cards.
-   Keep JavaScript bundles reasonable.
-   Do not embed external learning videos inside the app.

## 7. Component Naming

``` text
Button
Input
OptionCard
SkillChip
SkillSnapshot
PathStep
ResourceCard
ProjectCheckpoint
ProgressTimeline
WorkCategoryCard
ReplanCard
ShareablePlan
```

## 8. Visual Language

Recommended:

-   Dark/light neutral base.
-   One primary accent.
-   High contrast.
-   Minimal decorative effects.
-   Clear status indicators.
-   Consistent spacing.

Do not make the UI look like an AI chat application.
