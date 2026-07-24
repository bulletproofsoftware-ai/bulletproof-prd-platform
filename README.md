# PRD Platform

A full-stack application for brainstorming, researching, creating, editing, and reviewing Product Requirements Documents.

## Features

- **Brainstorm** — Chat with Claude to explore ideas, extract themes, promote to ideas/research/PRDs
- **Ideas Board** — Create, tag, and promote ideas to PRDs
- **Research Engine** — Run parallel Gemini searches, view results, generate PRDs from research
- **PRD Editor** — Tiptap WYSIWYG editor with auto-save, version history, and PDF export
- **Review Workflow** — AI summary, security scan, duplication scan, comments, approve/reject
- **Markdown Export** — Approved PRDs exported as markdown files

## Tech Stack

- Next.js 16 / React 19
- Prisma 7 with PostgreSQL (driver adapter pattern)
- Tiptap v3 WYSIWYG editor
- Tailwind v4 / shadcn/ui
- Claude CLI (brainstorm, summaries, duplication scanning)
- Gemini CLI (research queries)

## Setup

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- PostgreSQL (or use the `claude-postgres` container)

### Running with Docker Compose

```bash
# From your project directory
docker compose up -d prd-platform
```

Accessible at `http://localhost:3003`.

### Running Locally

```bash
npm ci
cp .env.example .env  # Edit DATABASE_URL if needed
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### CLI Proxy (for Docker)

The brainstorm and research features call Claude/Gemini CLIs. Inside Docker, these are accessed via a host-side proxy:

```bash
node scripts/cli-proxy.mjs
```

Set `CLI_PROXY_URL=http://host.docker.internal:3199` in the container environment.

## Testing

```bash
npm test        # Watch mode
npm run test:run # Single run
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (editor, layout, ui)
├── lib/           # Shared utilities (db, claude, gemini, markdown)
└── __tests__/     # Vitest tests
prisma/            # Schema and migrations
scripts/           # CLI proxy server
```
