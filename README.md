# Community Hero

AI-powered Community Intelligence Platform for mapping, analyzing, and improving local communities.

## Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js, TypeScript, Tailwind, Shadcn UI |
| Backend    | FastAPI (Python)                    |
| Database   | Supabase (PostgreSQL + Auth + Storage) |
| AI         | Google Gemini (Google AI Studio)    |
| Maps       | Leaflet + OpenStreetMap             |
| Deployment | Vercel (frontend) + Render (backend) |

## Project structure

```
community-hero/
├── backend/     # FastAPI REST API
├── frontend/    # Next.js web app
├── docs/        # Architecture & API documentation
├── diagrams/    # System diagrams
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or pnpm

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App: http://localhost:3000

## Development phases

1. **Phase 1–2** — Planning & design
2. **Phase 3** — Project initialization (current)
3. **Phase 4+** — Features (auth, maps, AI agents, etc.)

## License

Hackathon project — see team for usage terms.
