# KeyForge

KeyForge is a full-stack typing practice platform for developers and professionals. Train across coding languages, English, Hindi, and specialized formats while tracking WPM, accuracy, and long-term performance trends.

## Features

- **Multiple typing modes** — Coding, English, Hindi, Hinglish, blind mode, placement prep, resume, and government exam formats
- **IDE-style code editor** — VS Code–inspired themes with syntax-aware whitespace handling
- **Live stats** — Real-time WPM, accuracy, error count, and elapsed time during each test
- **Analytics dashboard** — Trend charts, mode breakdowns, and linear-regression performance forecasts
- **Leaderboards** — Daily, weekly, monthly, and all-time rankings
- **User accounts** — JWT authentication with persistent test history and profiles
- **Coaching feedback** — Personalized tips after each completed test
- **Content library** — Curated and dynamically generated practice material

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query, shadcn/ui, Framer Motion |
| Backend | Node.js, Express, TypeScript, Zod validation |
| Database | PostgreSQL, Drizzle ORM |
| Auth | JWT, bcrypt |

## Project Structure

```
keyforge/
├── frontend/          # React SPA (Vite)
│   └── src/
│       ├── pages/     # Route pages (home, type, analytics, …)
│       ├── components/
│       ├── hooks/
│       └── lib/       # API client and utilities
├── backend/           # Express REST API
│   └── src/
│       ├── routes/    # API endpoints
│       ├── db/        # Drizzle schema and connection
│       ├── services/  # Business logic (predictions, regression)
│       └── validation/
└── package.json       # npm workspaces root
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Neon)
- pnpm or npm

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/keyforge
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key   # optional — enables dynamic content generation
```

### Install & Run

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push -w backend

# (Optional) Seed content library
npm run seed -w backend

# Start frontend + backend in dev mode
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend.

### Production Build

```bash
npm run build
npm run start -w backend
```

Serve the `frontend/dist` directory with any static file host (Nginx, etc.).

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Sign in |
| `GET /api/typing-tests` | List user's test history |
| `POST /api/typing-tests` | Save a completed test |
| `POST /api/ai/generate-content` | Generate practice text |
| `POST /api/ai/generate-feedback` | Get coaching feedback |
| `GET /api/stats/summary` | Performance summary |
| `GET /api/stats/trends` | WPM/accuracy trends |
| `GET /api/leaderboard` | Rankings by period |
| `GET /api/predictions/*` | Performance forecasts |

## Typing Modes

| Mode | Description |
|------|-------------|
| Coding | 15+ languages with IDE-style editor |
| English | Classic prose and vocabulary |
| Hindi | Devanagari script practice |
| Hinglish | Mixed Hindi-English challenges |
| Blind | Memorize text, then type from memory |
| Placement | Interview-style coding questions |
| Resume | Professional terminology |
| Government | Official document formats |

## License

Private project — all rights reserved.

## Author

Built by **Prakhar Kumar** — Computer Science & Engineering student at Sathyabama Institute of Science and Technology, Chennai.
