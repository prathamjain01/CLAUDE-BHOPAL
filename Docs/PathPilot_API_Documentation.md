# PathPilot API Documentation

**Version:** 1.0.0-MVP  
**Base URL:** `http://localhost:5001/api`  
**Tagline:** *Don't follow a roadmap. Follow your next move.*

---

## Overview

PathPilot is a Skill GPS that helps self-directed learners determine their **next best learning move** instead of overwhelming them with generic roadmaps.

### Core Features
1. **Skill GPS** - Calculates the next best skill to learn
2. **Learn → Build → Prove → Adapt** - Proof-based progression system
3. **AI-Powered Personalization** - Gemini explains WHY and helps when stuck

---

## API Endpoints

### 1. Health Check

Check if the API is running and AI is available.

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "PathPilot API",
  "version": "1.0.0-mvp",
  "aiAvailable": true,
  "features": {
    "skillGPS": true,
    "learnBuildProveAdapt": true,
    "proofBasedNextMove": true
  }
}
```

---

### 2. Get Available Goals

List all learning goals supported by PathPilot.

```
GET /api/goals
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer"
  ]
}
```

---

### 3. Get Skills for a Goal

Get the skills required for a specific learning goal.

```
GET /api/goals/:goal/skills
```

**Example:**
```
GET /api/goals/frontend-developer/skills
```

**Response:**
```json
{
  "success": true,
  "data": {
    "goal": "frontend-developer",
    "skills": [
      { "id": "html-basics", "name": "HTML Basics" },
      { "id": "css-basics", "name": "CSS Basics" },
      { "id": "javascript-fundamentals", "name": "JavaScript Fundamentals" },
      { "id": "git-github", "name": "Git & GitHub" },
      { "id": "responsive-design", "name": "Responsive Web Design" },
      { "id": "react-basics", "name": "React Basics" }
    ],
    "totalSkills": 6
  }
}
```

---

### 4. Get Next Best Move (Core Feature 1)

Calculate the next best skill to learn based on learner profile.

```
POST /api/next-move
Content-Type: application/json
```

**Request Body:**
```json
{
  "goal": "Frontend Developer",
  "currentSkills": ["html", "css"],
  "dailyMinutes": 60,
  "device": "laptop",
  "name": "Rahul"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| goal | string | Yes | Learning goal (e.g., "Frontend Developer") |
| currentSkills | string[] | No | Skills the learner already knows |
| dailyMinutes | number | No | Minutes available per day (default: 60) |
| device | string | No | "mobile", "laptop", or "both" (default: "laptop") |
| name | string | No | Learner's name for personalization |

**Response:**
```json
{
  "success": true,
  "data": {
    "learner": {
      "goal": "Frontend Developer",
      "knownSkills": ["HTML Basics", "CSS Basics"],
      "device": "laptop",
      "dailyMinutes": 60
    },
    "skillGap": {
      "totalRequired": 6,
      "alreadyKnow": 2,
      "stillNeed": 4,
      "progressPercent": 33
    },
    "nextMove": {
      "skill": {
        "id": "javascript-fundamentals",
        "name": "JavaScript Fundamentals",
        "description": "Add interactivity with variables, functions, loops, and DOM manipulation",
        "estimatedHours": 25,
        "estimatedDays": 25
      },
      "whyThisSkill": "JavaScript is your next step because it builds on HTML/CSS...",
      "learningTip": "Practice for 60 minutes daily. Consistency beats intensity!"
    },
    "resource": {
      "id": "res-js-fcc",
      "title": "JavaScript Algorithms and Data Structures",
      "provider": "freeCodeCamp",
      "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      "type": "course",
      "durationMinutes": 600
    },
    "project": {
      "id": "proj-js-calculator",
      "title": "Simple Calculator",
      "description": "Build a calculator that performs basic math operations",
      "estimatedHours": 4,
      "acceptanceCriteria": [
        "Calculator can add, subtract, multiply, and divide",
        "Has a clear/reset button",
        "Displays the current input and result",
        "Handles decimal numbers",
        "Shows error message for division by zero"
      ],
      "starterHint": "Create functions for each operation..."
    },
    "isComplete": false,
    "aiPowered": true
  }
}
```

---

### 5. Start Learning Session (Core Feature 2)

Initialize a new learning session and get the first checkpoint.

```
POST /api/learner/start
Content-Type: application/json
```

**Request Body:** (Same as /api/next-move)
```json
{
  "goal": "Frontend Developer",
  "currentSkills": ["html", "css"],
  "dailyMinutes": 60,
  "device": "laptop",
  "name": "Priya"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Learning session started! Here's your first move.",
  "data": {
    "learnerId": "f6ae5932-7fb1-4288-b69b-106e538d6f88",
    "learnerState": {
      "learnerId": "f6ae5932-7fb1-4288-b69b-106e538d6f88",
      "goal": "Frontend Developer",
      "currentSkills": ["html", "css"],
      "dailyMinutes": 60,
      "device": "laptop",
      "name": "Priya",
      "currentCheckpoint": {
        "skillId": "javascript-fundamentals",
        "status": "NOT_STARTED",
        "startedAt": "2026-09-15T09:01:41.942Z"
      },
      "completedSkills": [...]
    },
    "nextMove": { ... }
  }
}
```

**Important:** Save the `learnerId` for subsequent API calls.

---

### 6. Get Learner State

Retrieve the current state of a learner.

```
GET /api/learner/:id
```

**Example:**
```
GET /api/learner/f6ae5932-7fb1-4288-b69b-106e538d6f88
```

**Response:**
```json
{
  "success": true,
  "data": {
    "learnerId": "f6ae5932-7fb1-4288-b69b-106e538d6f88",
    "goal": "Frontend Developer",
    "currentSkills": ["html", "css"],
    "currentCheckpoint": {
      "skillId": "javascript-fundamentals",
      "status": "LEARNING"
    },
    "completedSkills": [...]
  }
}
```

---

### 7. Update Checkpoint (Learn → Build → Prove → Adapt)

Update the learner's progress through the checkpoint stages.

```
POST /api/learner/:id/checkpoint
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "LEARNING",
  "stuckReason": "Optional - required only when status is STUCK"
}
```

| Status | Description |
|--------|-------------|
| `LEARNING` | Started learning from the resource |
| `BUILDING` | Started building the mini project |
| `STUCK` | Needs help (include `stuckReason`) |
| `COMPLETED` | Finished and proved the skill |

#### Example: Start Learning

```json
POST /api/learner/f6ae5932.../checkpoint
{
  "status": "LEARNING"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Great! You're now learning JavaScript Fundamentals. Take your time with the resource.",
  "data": {
    "learnerState": { ... }
  }
}
```

#### Example: Start Building

```json
POST /api/learner/f6ae5932.../checkpoint
{
  "status": "BUILDING"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Awesome! Time to build \"Simple Calculator\". Remember to check all acceptance criteria.",
  "data": {
    "learnerState": { ... }
  }
}
```

#### Example: Stuck (Get AI Help)

```json
POST /api/learner/f6ae5932.../checkpoint
{
  "status": "STUCK",
  "stuckReason": "I don't understand how to add event listeners to buttons"
}
```

**Response:**
```json
{
  "success": true,
  "message": "It's okay to be stuck. Let me help you get unstuck.",
  "data": {
    "learnerState": { ... },
    "stuckHelp": {
      "explanation": "Getting stuck is part of learning. Let's break this down.",
      "simplifiedSteps": [
        "Take a 5-minute break and come back fresh",
        "Re-read the resource section on event listeners",
        "Try adding just one button click handler first"
      ],
      "encouragement": "Every developer gets stuck. The ones who succeed keep trying!"
    }
  }
}
```

#### Example: Completed (Prove & Move Forward)

```json
POST /api/learner/f6ae5932.../checkpoint
{
  "status": "COMPLETED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Great work completing JavaScript Fundamentals! Ready for Git & GitHub?",
  "data": {
    "learnerState": { ... },
    "nextMove": {
      "skill": {
        "id": "git-github",
        "name": "Git & GitHub",
        ...
      },
      ...
    }
  }
}
```

---

### 8. Get Progress Summary

Get a summary of the learner's progress.

```
GET /api/learner/:id/progress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSkills": 6,
    "completedSkills": 3,
    "progressPercent": 50,
    "currentSkill": "Git & GitHub",
    "currentStatus": "NOT_STARTED",
    "completedList": [
      { "name": "HTML Basics", "completedAt": "2026-09-15T09:01:41.942Z" },
      { "name": "CSS Basics", "completedAt": "2026-09-15T09:01:41.942Z" },
      { "name": "JavaScript Fundamentals", "completedAt": "2026-09-15T09:03:35.107Z" }
    ]
  }
}
```

---

### 9. Re-plan (Change Constraints)

Update learning constraints and get adjusted recommendations.

```
POST /api/learner/:id/replan
Content-Type: application/json
```

**Request Body:**
```json
{
  "newDailyMinutes": 30,
  "newDevice": "mobile"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Plan updated based on your new constraints.",
  "data": {
    "learnerState": { ... },
    "nextMove": { ... }
  }
}
```

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Check API health
curl http://localhost:5001/api/health

# 2. Get available goals
curl http://localhost:5001/api/goals

# 3. Get next move (without session)
curl -X POST http://localhost:5001/api/next-move \
  -H "Content-Type: application/json" \
  -d '{"goal":"Frontend Developer","currentSkills":["html","css"],"dailyMinutes":60}'

# 4. Start a learning session
curl -X POST http://localhost:5001/api/learner/start \
  -H "Content-Type: application/json" \
  -d '{"goal":"Frontend Developer","currentSkills":["html","css"],"dailyMinutes":60,"name":"Test User"}'

# Save the learnerId from response, then:

# 5. Start learning
curl -X POST http://localhost:5001/api/learner/YOUR_LEARNER_ID/checkpoint \
  -H "Content-Type: application/json" \
  -d '{"status":"LEARNING"}'

# 6. Start building
curl -X POST http://localhost:5001/api/learner/YOUR_LEARNER_ID/checkpoint \
  -H "Content-Type: application/json" \
  -d '{"status":"BUILDING"}'

# 7. Get stuck (optional)
curl -X POST http://localhost:5001/api/learner/YOUR_LEARNER_ID/checkpoint \
  -H "Content-Type: application/json" \
  -d '{"status":"STUCK","stuckReason":"Cannot understand loops"}'

# 8. Mark completed
curl -X POST http://localhost:5001/api/learner/YOUR_LEARNER_ID/checkpoint \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'

# 9. Check progress
curl http://localhost:5001/api/learner/YOUR_LEARNER_ID/progress
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Learner ID not found |
| 500 | Server Error |

---

## Notes

- **AI Powered**: When `aiAvailable: true`, explanations and help are generated by Gemini AI
- **Fallback Mode**: If AI is unavailable, deterministic responses are provided
- **In-Memory Storage**: MVP uses in-memory storage (data resets on server restart)
- **Port**: Default port is 5001 (configurable via PORT env variable)

---

*PathPilot - Don't follow a roadmap. Follow your next move.*
