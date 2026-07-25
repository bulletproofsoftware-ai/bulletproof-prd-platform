# PRD Platform

A full-stack application for brainstorming, researching, creating, editing, and reviewing Product Requirements Documents.

![bulletproof-prd-platform — overview](docs/media/infographic.png)

> 📚 Full documentation in [`docs/`](docs/) · 🔒 security scan in [`docs/scan/scan-report.md`](docs/scan/scan-report.md) · 🎬 System overview: [briefing](media/system-overview.md) · [deck](media/bulletproof-prd-platform-deck.pdf) · [video](media/system-overview.mp4).

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

- Node.js 20+
- PostgreSQL (any reachable instance; the app uses a schema named `prd_platform`)
- Docker (only if you run the container image)

### Running with Docker

```bash
docker build -t bulletproof-prd-platform .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/dbname?schema=prd_platform" \
  -e CLI_PROXY_URL="http://host.docker.internal:3199" \
  bulletproof-prd-platform
```

Accessible at `http://localhost:3000`. See [docs/INSTALL.md](docs/INSTALL.md) for details.

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
node scripts/cli-proxy.mjs   # binds 127.0.0.1:3199 by default (no auth — see SECURITY.md)
```

Set `CLI_PROXY_URL=http://host.docker.internal:3199` in the container environment.
On Docker Desktop (macOS/Windows) `host.docker.internal` reaches the loopback-bound
proxy directly; on Linux, set `CLI_PROXY_HOST` to a trusted bridge interface and
firewall the port (see [SECURITY.md](SECURITY.md)).

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

## License

Apache-2.0 — see [LICENSE](LICENSE).
