# Administrator Guide — bulletproof-prd-platform

Operational reference for running the PRD platform: configuration, the CLI proxy, the API
surface, data storage, and maintenance.

## Runtime topology

```
┌────────────┐      HTTP       ┌──────────────────────┐     SQL      ┌────────────┐
│  Browser   │ ──────────────▶ │  Next.js (port 3000) │ ───────────▶ │ PostgreSQL │
└────────────┘                 │  App Router + API    │              │ prd_platform
                               └───────────┬──────────┘              └────────────┘
                                           │ HTTP (only when CLI_PROXY_URL set)
                                           ▼
                               ┌──────────────────────┐   exec   ┌──────────────┐
                               │ cli-proxy.mjs (3199) │ ───────▶ │ claude/gemini │
                               └──────────────────────┘          └──────────────┘
```

## Configuration

All configuration is via environment variables (see [INSTALL.md](INSTALL.md) for the full table).
The three that matter operationally:

- `DATABASE_URL` — the app **throws on startup** if this is unset. Must point at a Postgres
  instance where migrations have been applied and include `?schema=prd_platform`.
- `CLI_PROXY_URL` — when set, all Claude/Gemini calls are routed to the HTTP proxy. Leave unset
  to exec CLIs directly (only viable when the app process can see the CLIs on its PATH).
- `GOVERNANCE_PLUGIN_PATH` — path to a Python governance plugin exposing
  `governance.lib.llm_threat_detector.LLMThreatDetector`. Used by the review-time PRD content
  security scan. If missing or erroring, the scan degrades gracefully to zero findings.

## The CLI proxy (`scripts/cli-proxy.mjs`)

A minimal stdlib-only HTTP server (Node `http`) that accepts `POST` requests with a JSON body
`{ "cli": "claude" | "gemini", "prompt": "..." }` and returns `{ "result": "..." }`. It:

- Listens on `0.0.0.0:3199`.
- Rejects non-`POST` requests (405) and missing/unknown `cli` values (400).
- Execs `claude -p <prompt> --output-format text` or
  `gemini -p "search: <prompt>" --output-format text` with a 10 MB output buffer.
- Times out Claude calls at 120 s and Gemini calls at 60 s.
- Honours `CLAUDE_CLI_PATH` / `GEMINI_CLI_PATH` overrides.

Run it on the host so the container can reach it via `host.docker.internal:3199`. It has no
authentication and should only be exposed to trusted local containers — do not bind it to a
public interface.

## HTTP API surface

All routes live under `src/app/api/`. Handlers are Next.js route handlers returning JSON
(the research create route returns a Server-Sent Events stream).

| Method(s) | Path | Purpose |
|-----------|------|---------|
| GET, POST | `/api/prds` | List PRDs (optional `?status=`); create a PRD |
| GET, PUT, DELETE | `/api/prds/[id]` | Fetch, update (snapshots a new version when `contentMd` changes), delete a PRD |
| POST | `/api/prds/[id]/stage` | Advance a PRD into review — creates a Review with AI summary + security + duplication scans |
| GET | `/api/prds/[id]/versions` | List version snapshots for a PRD |
| POST | `/api/prds/upload` | Upload a `.md` file as a new PRD (title from first `# heading`) |
| GET, POST | `/api/ideas` | List / create ideas |
| GET, PUT, DELETE | `/api/ideas/[id]` | Fetch / update / delete an idea |
| POST | `/api/ideas/[id]/promote` | Promote an idea to a draft PRD |
| GET, POST | `/api/research` | List research sessions; start a research run (SSE stream of progress) |
| GET, DELETE | `/api/research/[id]` | Fetch / delete a research session |
| POST | `/api/research/[id]/generate` | Generate a PRD from a completed research session |
| GET, POST | `/api/brainstorm` | List / create brainstorm sessions |
| GET, DELETE | `/api/brainstorm/[id]` | Fetch / delete a brainstorm session |
| POST | `/api/brainstorm/[id]/messages` | Post a message; get the assistant reply + extracted themes |
| POST | `/api/brainstorm/[id]/promote` | Promote a brainstorm to an idea, research prompt, or PRD |
| GET, PUT | `/api/reviews/[id]` | Fetch a review; set status (approve exports markdown to `prds/`) |
| GET, POST | `/api/reviews/[id]/comments` | List / add review comments |

### Review state transitions

Setting a review's status via `PUT /api/reviews/[id]` cascades to the PRD:

- `approved` → PRD `approved`, **and** the PRD markdown is written to
  `prds/<slugified-title>.md`.
- `rejected` → PRD `rejected`.
- `changes_requested` → PRD `editing`.

## Data storage & retention

- **Postgres** holds everything: PRDs, versions, ideas, research sessions, brainstorm threads,
  reviews, and comments — all under the `prd_platform` schema.
- **Filesystem** — approved PRDs are exported to the `prds/` directory (created on demand).
  The container `Dockerfile` pre-creates `prds/` owned by the `nextjs` user; mount a volume
  here if you need exports to survive container restarts.
- **Versions** — every `PUT /api/prds/[id]` that includes `contentMd` writes a new numbered
  snapshot into `prd_versions`, so history grows with edits. Prune old versions directly in
  SQL if needed.

## Backups

Back up the Postgres `prd_platform` schema (`pg_dump --schema=prd_platform`). The exported
markdown in `prds/` is derived data and can be regenerated by re-approving, but back it up too
if it is your delivery artifact.

## Security posture

- No application-level authentication is built in — the app assumes a trusted single-tenant
  deployment (author defaults to `"local"`). Put it behind your own auth proxy for shared use.
- The CLI proxy is unauthenticated; keep it on a private network.
- Dependency vulnerabilities are tracked and remediated — see
  [scan/scan-report.md](scan/scan-report.md) (latest scan: **0 critical / 0 high**).
- Secrets scanning (gitleaks) passes with zero findings.

## Upgrades

1. `git pull`
2. `npm ci`
3. `npx prisma migrate deploy` (apply any new migrations)
4. `npm run build && npm run test:run`
5. Restart the service.

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [LICENSE](../LICENSE) and [NOTICE](../NOTICE).
