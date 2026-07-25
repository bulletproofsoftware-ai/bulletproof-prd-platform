# Technical Briefing: bulletproof-prd-platform

## 1. System Overview and Core Mission
The **bulletproof-prd-platform** is a specialized full-stack web application architected to manage the end-to-end Product Requirements Document (PRD) lifecycle. By integrating AI-driven insights with structured document management, the platform transforms high-level concepts into technical specifications.

The system is partitioned into six primary functional modules:
*   **Dashboard:** High-level status tracking and platform entry point.
*   **Brainstorm:** Conversational AI interface for concept exploration and theme extraction.
*   **Ideas:** A triage board for capturing, tagging, and promoting concepts.
*   **Research:** A parallelized analysis engine for competitive and technical deep-dives.
*   **PRDs:** A central repository for document creation, file uploads, and editing.
*   **Reviews:** A dedicated workflow for automated security/duplication scanning and manual approval.

In addition to its core Markdown-based workflow, the platform supports high-fidelity PDF export for external distribution and reporting.

## 2. Technical Stack and Architecture
The platform is built on a modern, type-safe stack designed for reliability and rapid iteration:
*   **Next.js 16 / React 19:** Utilizing the App Router for server-side rendering and efficient route handling.
*   **Prisma 7:** Employing the `@prisma/adapter-pg` driver adapter for PostgreSQL integration.
*   **Tailwind CSS v4 & shadcn/ui:** Providing a modular, utility-first design system.
*   **Tiptap v3:** A headless WYSIWYG editor configured for Markdown round-tripping and syntax highlighting.

### AI Integration Strategy
The platform leverages external Large Language Models (LLMs) via the **Claude CLI** and **Gemini CLI**. To ensure "bulletproof" operational stability, the system is designed with **graceful degradation**: if the underlying CLIs or proxy services are unavailable, AI-dependent features (like summaries or research) return empty results while core functions—such as the editor, ideas board, and manual review workflows—remain fully operational.

### Runtime Topology and CLI Proxy
A core architectural challenge is the containerized deployment of AI features. Because application containers cannot easily access host-side binaries or securely inherit host-side authentication (e.g., CLI credentials), the system utilizes a **CLI Proxy** (`scripts/cli-proxy.mjs`). 
*   **Local Execution:** The application invokes CLIs directly via the system `PATH`.
*   **Docker Execution:** The application communicates with the host-side CLI Proxy over HTTP. This design allows the container to leverage the host's authenticated environment without exposing sensitive credentials inside the image.

## 3. Data Model and Storage Schema
All application data is encapsulated within the `prd_platform` schema in PostgreSQL. The system uses the `@prisma/adapter-pg` driver adapter in `src/lib/db.ts` to ensure the connection's `search_path` is correctly scoped to this schema at the session level.

| Model Name | Description | Status Management |
| :--- | :--- | :--- |
| **Prd** | Core document (Markdown content, source, author). | `PrdStatus` Enum |
| **Idea** | Captured concepts with tags; can be promoted to a PRD. | Active/Promoted |
| **ResearchSession** | Tracks parallel query execution and result sets. | Pending/Complete |
| **BrainstormSession** | Represents a distinct chat thread. | Active |
| **BrainstormMessage** | Individual messages and extracted themes. | N/A |
| **Review** | Aggregates AI summaries and scan results. | `ReviewStatus` Enum |
| **ReviewComment** | Threaded comments, optionally anchored to sections. | Resolved/Open |
| **PrdVersion** | Point-in-time content snapshots for history. | Sequential Versioning |

### Data Retention and Persistence
*   **Database:** Serves as the primary source of truth for all metadata and version history.
*   **Filesystem:** Approved PRDs are written as the primary delivery artifact to the `prds/` directory.
*   **Version Control:** Every `PUT` request to a PRD that modifies the `contentMd` field triggers an automatic snapshot in the `prd_versions` table, enabling granular document history.

## 4. The CLI Proxy (scripts/cli-proxy.mjs)
The CLI Proxy is a minimal, standard-library-only Node.js HTTP server. It functions as a secure bridge between the containerized application and the host's AI tools.

**Operational Specifications:**
*   **Interface:** Listens on port `3199` (bound to `0.0.0.0`).
*   **Request Handling:** 
    *   Accepts `POST` requests with a JSON body: `{ "cli": "claude" | "gemini", "prompt": "..." }`.
    *   Rejects non-POST requests with a **405 Method Not Allowed**.
    *   Rejects missing or unknown CLI values with a **400 Bad Request**.
*   **Execution Logic:**
    *   **Claude:** Executes `claude -p <prompt> --output-format text` (120s timeout).
    *   **Gemini:** Executes `gemini -p "search: <prompt>" --output-format text` (60s timeout).
*   **Output:** Utilizes a 10 MB output buffer for CLI results.

**Security Constraint:** The proxy is unauthenticated by design. It must **only** be bound to trusted local interfaces (e.g., `127.0.0.1` or a private Docker network) and never exposed to public traffic.

## 5. Configuration and Environment Variables
The application enforces strict configuration management. If the primary database variable is missing, the application will **throw an exception on startup**.

| Variable | Required | Functional Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Postgres connection string. Must include `?schema=prd_platform`. **Throws on startup if unset.** |
| `CLI_PROXY_URL` | In Docker | HTTP address for the host proxy (e.g., `http://host.docker.internal:3199`). |
| `GOVERNANCE_PLUGIN_PATH` | Optional | Path to Python plugin for security scans. If missing, scan returns zero findings. |
| `CLAUDE_CLI_PATH` | Optional | Override for the `claude` binary location. |
| `GEMINI_CLI_PATH` | Optional | Override for the `gemini` binary location. |

## 6. Functional Workflow: The PRD Lifecycle
### Inception and Research Fan-out
The Research engine utilizes a "fan-out" pattern to ensure comprehensive requirements gathering. A single prompt triggers seven parallel Gemini queries covering Competitors, Security, UX, Integration, Best Practices, Standards, and Common Pitfalls. Progress and results are streamed back to the client in real-time via **Server-Sent Events (SSE)**.

### Review and Automation
When a PRD is "staged" for review, the system triggers three automated tasks:
1.  **AI Executive Summary:** Distills the document into a high-level briefing.
2.  **Content Security Scan:** Checks for LLM-related threats using the governance plugin (gracefully skips if the plugin is unconfigured).
3.  **Duplication Scan:** Performs a similarity check against all existing active or approved PRDs.

### State Transitions and Export
Setting a review status results in a state cascade to the PRD:
*   **Approved:** PRD enters "Approved" status, and the content is automatically exported to the filesystem using the naming convention `prds/<slugified-title>.md`.
*   **Rejected:** PRD marked "Rejected."
*   **Changes Requested:** PRD status reverts to "Editing" for further refinement.

## 7. Operational Maintenance and Security
### Upgrade Protocol
To ensure system integrity, updates must follow this five-step sequence:
1.  `git pull`: Fetch latest source.
2.  `npm ci`: Clean installation of dependencies.
3.  `npx prisma migrate deploy`: Apply schema changes to the `prd_platform` schema.
4.  `npm run build && npm run test:run`: Perform **compilation and verification** to ensure the build is stable.
5.  Restart the application service.

### Security Posture and Deployment Constraints
The platform is built on a **single-tenant assumption**, which is reflected in the default "local" author attribution. As a result, the application does not include built-in user authentication. It is a mandatory deployment constraint that the system be placed behind an organizational authentication proxy (e.g., OIDC or Authelia) for any multi-user environment. 

Current security audits show:
*   **Vulnerability Scanning:** 0 critical / 0 high vulnerabilities in the dependency tree.
*   **Secrets Management:** Gitleaks verified 0 findings for hardcoded secrets.

### Backup Strategy
Administrators should perform periodic backups of the `prd_platform` schema using `pg_dump`. While the exported Markdown files in the `prds/` directory are technically derived data that can be regenerated by re-approving a PRD, they should be included in standard backup rotations if they serve as the primary delivery artifacts.