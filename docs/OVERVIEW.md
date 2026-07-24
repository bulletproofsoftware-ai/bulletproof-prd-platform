# Overview — bulletproof-prd-platform

`bulletproof-prd-platform` is a full-stack web application for the entire lifecycle of a
Product Requirements Document (PRD): **brainstorm → research → create → edit → review → approve → export**.
It pairs a Next.js App Router front end with a Prisma/PostgreSQL data layer and drives its
AI features through the local Claude and Gemini command-line tools.

## What it does

| Stage | Capability |
|-------|------------|
| **Brainstorm** | Chat with Claude to explore an idea. The assistant extracts themes from the conversation, which can be promoted to an idea, a research session, or a full PRD. |
| **Ideas Board** | Capture, tag, and triage ideas. Any idea can be promoted into a draft PRD. |
| **Research** | Fan out a single prompt into seven parallel Gemini research queries (best practices, competitors, standards, pitfalls, security, UX, integration). Results stream back over Server-Sent Events and can be synthesised into a PRD. |
| **PRD Editor** | A Tiptap WYSIWYG editor with markdown round-tripping, auto-save, and version history. |
| **Review** | Generate an AI executive summary, run a content security scan and a duplication scan against existing PRDs, thread comments, and approve / reject / request-changes. |
| **Export** | Approved PRDs are written out as markdown files to the `prds/` directory. |

## Architecture at a glance

```
Browser (React 19 / Tailwind v4 / shadcn-ui)
        │
        ▼
Next.js 16 App Router  ── pages under src/app/*, API routes under src/app/api/*
        │
        ├── src/lib/db.ts          Prisma client (pg driver adapter, schema "prd_platform")
        ├── src/lib/claude.ts      Claude CLI wrapper  (brainstorm, summaries, PRD generation)
        ├── src/lib/gemini.ts      Gemini CLI wrapper  (parallel research)
        ├── src/lib/governance.ts  content security scan + duplication scan + summary
        └── src/lib/markdown.ts    markdown ⇄ HTML (unified / remark / rehype / turndown)
        │
        ▼
PostgreSQL  (schema: prd_platform — 8 tables via Prisma migrations)
```

When the app runs inside Docker it cannot exec host CLIs directly, so `scripts/cli-proxy.mjs`
runs on the host and exposes the Claude and Gemini CLIs over HTTP on port `3199`. The container
reaches it via `CLI_PROXY_URL=http://host.docker.internal:3199`. Run outside Docker and the
libraries exec the CLIs directly instead.

## Data model

Eight Prisma models map to the `prd_platform` schema:

- **Prd** — the document (title, `content_md`, status, source, author, version links).
- **Idea** — captured idea with tags; can link to a promoted PRD.
- **ResearchSession** — a research run: prompt, queries (JSON), results (JSON), status.
- **BrainstormSession** / **BrainstormMessage** — a chat thread and its messages (with extracted themes).
- **Review** — an AI summary plus security-scan and duplication-scan JSON for a PRD.
- **ReviewComment** — threaded comments on a review, optionally anchored to a section.
- **PrdVersion** — a point-in-time snapshot of a PRD's markdown content.

Status is modelled with enums (`PrdStatus`, `ReviewStatus`, etc.); a PRD moves
`draft → research → editing → review → approved | rejected`.

## Tech stack

- **Next.js 16** / **React 19** (App Router, server components, route handlers)
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter, PostgreSQL
- **Tiptap v3** WYSIWYG editor (`lowlight` code highlighting, tables, images, links)
- **Tailwind CSS v4** + **shadcn/ui** components
- **unified / remark / rehype / turndown** for markdown conversion
- **Claude CLI** and **Gemini CLI** for AI generation and research
- **Vitest** (unit) and **Playwright** (e2e) for tests

## Not included in this repo

This is the application source. It does **not** bundle a database server, the Claude/Gemini
CLIs, or a `docker-compose.yml` — those are expected in the host environment. See
[INSTALL.md](INSTALL.md) for prerequisites.

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [LICENSE](../LICENSE) and [NOTICE](../NOTICE).
