# PathPilot

A mobile-first guidance tool that helps self-directed learners determine **what to learn next, in what order, and toward what realistic outcome**.

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS (TypeScript)
- **Backend:** Node.js + Express (TypeScript)
- **Database:** MongoDB Atlas
- **AI:** Claude API (Anthropic)

## Repository Structure

```
pathpilot/
├── frontend/          # Next.js application
├── backend/           # Node.js + Express API
├── data/              # Seed data (skills, resources, projects, work categories)
├── Docs/              # Project documentation
├── scripts/           # Utility scripts (seeder, etc.)
├── .github/           # CI/PR templates
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Claude API key

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your environment variables
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [PRD](Docs/PRD.md)
- [SRS](Docs/SRS.md)
- [Architecture](Docs/ARCHITECTURE.md)
- [Design](Docs/DESIGN.md)
- [Development Guide](Docs/DEVELOPMENT.md)
- [Developer Ownership](Docs/DEVELOPERS.md)
- [Phases](Docs/PHASES.md)

## Team

See [DEVELOPERS.md](DEVELOPERS.md) for ownership boundaries and workflow.
