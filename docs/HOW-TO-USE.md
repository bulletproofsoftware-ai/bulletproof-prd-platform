# How to Use — bulletproof-prd-platform

A walkthrough of the PRD workflow from the user's perspective. Open the app at
`http://localhost:3000` and use the left sidebar to move between the six areas:
**Dashboard · Brainstorm · Ideas · Research · PRDs · Reviews**.

## 1. Brainstorm an idea

1. Go to **Brainstorm** and start a new session.
2. Chat with the assistant to explore a concept. Each assistant reply may surface
   **extracted themes** in the side panel.
3. When you have something worth keeping, **Promote** the session to one of:
   - **Idea** — a concise title + description added to the Ideas Board.
   - **Research** — a distilled research prompt, pre-filled on the Research page.
   - **PRD** — a full draft PRD generated from the whole conversation.

## 2. Manage ideas

- On the **Ideas** board, create ideas directly, add **tags**, and edit or delete them.
- **Promote** any idea to a draft PRD when you are ready to formalise it.

## 3. Run research

1. On the **Research** page, enter a prompt (or arrive pre-filled from a brainstorm).
2. The platform fans your prompt out into **seven parallel Gemini queries** covering
   best practices, competitors, standards, common pitfalls, security, UX, and integration.
3. Progress streams live as each query completes.
4. When the run finishes, review the collected results and **Generate PRD** to synthesise a
   structured draft (Overview, Problem Statement, Goals, Requirements, Architecture, Security
   Considerations, Success Criteria, Open Questions).

## 4. Create or upload a PRD

- **From brainstorm / idea / research** — use the promote/generate actions above.
- **Manually** — create a blank PRD on the **PRDs** page.
- **Upload** — on the PRD upload page, drop a `.md` file. The title is taken from the first
  `# heading` (or the filename); the PRD lands in `editing` status.

## 5. Edit in the WYSIWYG editor

- Open a PRD to launch the **Tiptap editor**: headings, lists, tables, code blocks with syntax
  highlighting, links, and images.
- Content **auto-saves**; each saved change with new content creates a numbered entry in
  **version history**, which you can browse from the editor.

## 6. Review and approve

1. Send a PRD to review (**stage** it). The platform automatically:
   - writes an **AI executive summary**,
   - runs a **content security scan** on the PRD text,
   - runs a **duplication scan** comparing it against other active/approved PRDs.
2. On the **Reviews** page, read the summary and scan results, and thread **comments**
   (optionally anchored to a section).
3. Set the outcome:
   - **Approve** → PRD marked approved **and exported** as `prds/<title>.md`.
   - **Reject** → PRD marked rejected.
   - **Request changes** → PRD returns to `editing`.

## PRD lifecycle

```
draft ──▶ research ──▶ editing ──▶ review ──▶ approved ──▶ (exported to prds/*.md)
                                       └────▶ rejected
                                       └────▶ (changes requested) ──▶ editing
```

## Tips

- **AI features need the CLIs.** Brainstorm replies, research, summaries, and duplication scans
  call the Claude/Gemini CLIs (directly or via the proxy). If they are unavailable, those steps
  return empty results but the editor, ideas board, uploads, and manual review still work.
- **Everything is stored in Postgres.** Deleting a PRD cascades to its versions; deleting a
  review cascades to its comments.
- **Exports are markdown.** Approved PRDs are plain `.md` files you can commit, publish, or feed
  into other tooling.

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [LICENSE](../LICENSE) and [NOTICE](../NOTICE).
