# Install — bulletproof-prd-platform

This guide covers running the PRD platform locally and in Docker.

## Prerequisites

- **Node.js 20+** (the CI and Docker image both pin Node 20)
- **PostgreSQL** — any reachable Postgres instance; the app uses a schema named `prd_platform`
- **Claude CLI** and **Gemini CLI** on the host — required for brainstorm, research, summaries,
  and duplication scanning. Without them, those AI features return empty results but the rest of
  the app (editor, ideas board, uploads, reviews) still works.
- **Docker** (only if you run the container image)

## Environment variables

Copy the example file and edit it:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | **yes** | Postgres connection string. Include `?schema=prd_platform`. The app throws on startup if unset. |
| `CLI_PROXY_URL` | in Docker | If set, Claude/Gemini calls go to the HTTP proxy (`scripts/cli-proxy.mjs`) instead of exec-ing local CLIs. Set to `http://host.docker.internal:3199` in the container. |
| `GOVERNANCE_PLUGIN_PATH` | optional | Filesystem path to a governance plugin providing `governance.lib.llm_threat_detector`. Used by the PRD content security scan; if absent, the scan returns no findings. |
| `CLAUDE_CLI_PATH` | optional | Override the `claude` binary path (default `claude`). |
| `GEMINI_CLI_PATH` | optional | Override the `gemini` binary path (default `gemini`). |

Example `.env`:

```dotenv
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname?schema=prd_platform"
CLI_PROXY_URL="http://localhost:3199"
GOVERNANCE_PLUGIN_PATH="/path/to/governance-plugin"
```

## Running locally

```bash
npm ci
cp .env.example .env          # edit DATABASE_URL
npx prisma generate           # generate the Prisma client
npx prisma migrate deploy     # apply migrations (creates the prd_platform schema tables)
npm run dev                   # Next.js dev server on http://localhost:3000
```

The dev server listens on port **3000** by default. Open `http://localhost:3000`.

### AI features locally

Brainstorm and research exec the `claude` and `gemini` CLIs directly when `CLI_PROXY_URL`
is **not** set. Make sure both are installed and authenticated on your PATH.

## Running with Docker

The provided `Dockerfile` builds a Node 20 (alpine) image that runs `npm run dev` as a
non-root user (`nextjs`) on port **3000**.

```bash
docker build -t bulletproof-prd-platform .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/dbname?schema=prd_platform" \
  -e CLI_PROXY_URL="http://host.docker.internal:3199" \
  bulletproof-prd-platform
```

Because the container cannot exec the host's Claude/Gemini CLIs, start the CLI proxy on the
**host** first:

```bash
node scripts/cli-proxy.mjs      # listens on 0.0.0.0:3199
```

> **Note:** This repository does not ship a `docker-compose.yml`. If your environment defines a
> `prd-platform` compose service (e.g. `docker compose up -d prd-platform`), that lives in your
> host compose stack, not here. The `Dockerfile` above is self-contained.

## Database schema & migrations

- The Prisma schema (`prisma/schema.prisma`) targets PostgreSQL and maps all models into the
  `prd_platform` schema.
- The initial migration lives at `prisma/migrations/20260403183828_init/`.
- `src/lib/db.ts` configures the `@prisma/adapter-pg` driver adapter with
  `{ schema: "prd_platform" }` so the connection's `search_path` is set correctly.

Apply migrations with `npx prisma migrate deploy` (production) or `npx prisma migrate dev`
(development, generates new migrations).

## Verifying the install

```bash
npm run build       # production build — must exit 0
npm run test:run    # unit tests (Vitest)
npm run test:e2e    # Playwright end-to-end (requires the app running)
```

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [LICENSE](../LICENSE) and [NOTICE](../NOTICE).
