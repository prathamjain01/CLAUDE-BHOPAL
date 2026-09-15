# PathPilot

## Don't follow a roadmap. Follow your next move.

---

# The Problem

### Traditional Learning Roadmaps Are Broken

- **Overwhelming**: 50+ skills listed with no clear starting point
- **Generic**: One-size-fits-all approach ignores individual backgrounds
- **No Accountability**: Easy to skip skills or get stuck without guidance
- **Resource Overload**: Learners waste hours finding quality free resources
- **No Proof**: Completing a roadmap doesn't prove you actually learned

### The Result?
> 73% of self-learners abandon their learning journey within 3 months

---

# Our Solution

## PathPilot - Your Personal Learning GPS

Instead of showing the entire map, we tell you:
1. **What to learn next** (just ONE skill at a time)
2. **Why this skill** (personalized AI explanation)
3. **Where to learn** (curated FREE resources)
4. **How to prove it** (mini project with acceptance criteria)
5. **Quiz verification** (ensure you actually learned)

---

# Core Features

## 1. Skill GPS - Next Best Action

| Input | Output |
|-------|--------|
| Your goal | Next skill to learn |
| Current skills | Why THIS skill is next |
| Daily time available | Estimated completion time |
| Device preference | Optimized resources |

**No more decision fatigue. Just your next move.**

---

## 2. Learn → Build → Prove → Adapt

### The Checkpoint System

```
LEARN          BUILD           PROVE           ADAPT
  │               │               │               │
  ▼               ▼               ▼               ▼
Free           Mini            Quiz           Next
Resource      Project       Verification      Skill
```

- **Learn**: Curated free resources (YouTube, freeCodeCamp, MDN)
- **Build**: Hands-on project with clear acceptance criteria
- **Prove**: 5-question quiz to verify understanding
- **Adapt**: AI helps if you're stuck, then moves you forward

---

## 3. Quiz Verification System

### Ensure Real Learning, Not Just Completion

- 5 multiple-choice questions per skill
- 60% passing score required
- Instant feedback with explanations
- Can't skip to next skill without passing

**Quizzes available for:**
HTML, CSS, JavaScript, React, Node.js, Git, Python, SQL + auto-generated for custom skills

---

## 4. Mentor Review System

### Industry Professionals Validate Your Path

- **7 Expert Mentors** across different tech domains
- **Personalized Feedback** on your learning roadmap
- **Rating & Encouragement** from real industry professionals
- **Locations**: Bhopal, Indore, Remote

### Mentor Specializations:
Frontend | Backend | Full Stack | Data Analyst | DevOps | Mobile | AI/ML

---

## 5. Work Opportunities Mapping

### From Learning to Earning

| Location | Opportunities |
|----------|---------------|
| Bhopal | Local IT companies, Government projects |
| Indore | Growing tech hub, Startups |
| Remote | Freelance, Global startups |

**14 curated opportunities** with:
- Required skills mapping
- Salary ranges (₹3-25 LPA)
- Job types: Full-time, Part-time, Freelance, Internship

---

## 6. Custom Goal Support

### AI-Generated Personalized Roadmaps

Not just preset paths! Users can type ANY career goal:
- Game Developer
- Blockchain Developer
- UI/UX Designer
- DevOps Engineer
- And more...

**Gemini AI creates a complete custom learning path** with skills, resources, and projects.

---

## 7. Claude AI Tutor Integration

### Personal AI Tutor for Every Skill

Each skill comes with a ready-to-use prompt for Claude AI:
- Step-by-step explanations
- Hands-on exercises
- Concept clarification
- Personalized tutoring

**Just copy the prompt and paste to Claude!**

---

# User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  HOME PAGE                                                  │
│  ├─ Select Goal (7 preset + custom option)                 │
│  └─ "Start My Journey" →                                   │
├─────────────────────────────────────────────────────────────┤
│  ONBOARDING                                                 │
│  ├─ Step 1: Confirm/customize goal                         │
│  ├─ Step 2: Select known skills (+ add custom)             │
│  └─ Step 3: Daily time + device preference                 │
├─────────────────────────────────────────────────────────────┤
│  PATHWAY (Main Dashboard)                                   │
│  ├─ Progress bar (X/Y skills completed)                    │
│  ├─ Current skill card with AI explanation                 │
│  ├─ Multiple learning resources                            │
│  ├─ Claude AI tutor prompt                                 │
│  ├─ Mini project with acceptance criteria                  │
│  ├─ Quiz verification (5 questions)                        │
│  ├─ Mentor review request                                  │
│  └─ Work opportunities explorer                            │
└─────────────────────────────────────────────────────────────┘
```

---

# Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| CSS Variables | Light/Dark theme |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | API framework |
| TypeScript | Type safety |
| In-memory DB | MVP storage (MongoDB-ready) |

### AI
| Technology | Purpose |
|------------|---------|
| Google Gemini | Custom path generation |
| Claude Prompts | AI tutoring integration |

---

# Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│                    (Next.js 16)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Home   │  │Onboard  │  │ Pathway │  │ Modals  │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │
└───────┼────────────┼────────────┼────────────┼──────────┘
        │            │            │            │
        └────────────┴─────┬──────┴────────────┘
                           │ REST API
┌──────────────────────────┼───────────────────────────────┐
│                      BACKEND                             │
│                    (Express.js)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │Skill Engine │  │ Checkpoint  │  │Quiz System  │      │
│  │(Deterministic)│  │  Service   │  │             │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
│  ┌──────┴────────────────┴────────────────┴──────┐      │
│  │              AI Client (Gemini)               │      │
│  └───────────────────────────────────────────────┘      │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │Mentor Review│  │    Work     │                       │
│  │   System    │  │Opportunities│                       │
│  └─────────────┘  └─────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

---

# API Endpoints

### Core Endpoints
```
GET  /api/health              - Health check
GET  /api/goals               - Available learning goals
POST /api/next-move           - Get next best action
POST /api/learner/start       - Start learning session
POST /api/learner/:id/checkpoint - Update progress
```

### Quiz Endpoints
```
GET  /api/quiz/:skillId       - Get quiz questions
POST /api/quiz/:skillId/submit - Submit answers
```

### Mentor & Opportunities
```
GET  /api/mentors             - List mentors
POST /api/review/submit       - Request mentor review
GET  /api/opportunities       - Work opportunities
```

---

# Key Differentiators

| Traditional Roadmaps | PathPilot |
|---------------------|-----------|
| Shows everything at once | One skill at a time |
| Generic for everyone | AI-personalized |
| No verification | Quiz + Project proof |
| Find your own resources | Curated free resources |
| Self-guided | Mentor-validated |
| Learning only | Learning + Job mapping |

---

# Target Users

### Primary: Self-Directed Learners in Tier 2/3 Cities

- **Students** looking to build tech careers
- **Career Switchers** entering tech from other fields
- **Working Professionals** upskilling in spare time

### Why Tier 2/3 Focus?
- Limited access to quality mentorship
- Need for structured, free learning paths
- Local job opportunity mapping (Bhopal, Indore)
- Remote work opportunities for global reach

---

# Demo Flow

### 1. Home Page
- Show 7 career goal options
- Click "+ Custom" and type "Game Developer"
- Click "Start as Game Developer →"

### 2. Onboarding
- Add known skills
- Set daily time commitment
- Choose device preference

### 3. Pathway Dashboard
- View current skill and progress
- Explore multiple learning resources
- Copy Claude AI tutor prompt
- Start the mini project

### 4. Quiz Verification
- Answer 5 questions
- View results with explanations
- Pass to unlock next skill

### 5. Mentor Review
- Request industry expert review
- View mentor feedback and rating

### 6. Work Opportunities
- Browse local and remote jobs
- See required skills and salary ranges

---

# Future Roadmap

### Phase 2
- [ ] MongoDB integration for persistence
- [ ] User authentication (OAuth)
- [ ] Progress sharing on social media
- [ ] Mobile app (React Native)

### Phase 3
- [ ] Community features (peer learning)
- [ ] Live mentor sessions
- [ ] Company partnerships for hiring
- [ ] Certificate generation

### Phase 4
- [ ] Multiple languages support
- [ ] Offline mode
- [ ] AR/VR learning experiences

---

# Metrics & Success

### Key Performance Indicators

| Metric | Target |
|--------|--------|
| User Retention (30-day) | > 40% |
| Skill Completion Rate | > 60% |
| Quiz Pass Rate | > 70% |
| Mentor Review Satisfaction | > 4.5/5 |

### Current Status
- **MVP Complete**
- **7 Career Paths** supported
- **8 Skills** with full quiz coverage
- **14 Work Opportunities** mapped

---

# Team

### Built for Smart India Hackathon

**Problem Statement**: PS-2 (Custom)
- Skill GPS for self-directed learners
- Mentor validation system
- Local work opportunity mapping

---

# Thank You!

## PathPilot

**Don't follow a roadmap. Follow your next move.**

---

### Links

- **Live Demo**: http://localhost:3000
- **GitHub**: https://github.com/prathamjain01/CLAUDE-BHOPAL
- **Backend API**: http://localhost:5001/api/health

---

### Contact

Questions? Let's connect!

---

*Built with Next.js, Express, TypeScript, and Gemini AI*
