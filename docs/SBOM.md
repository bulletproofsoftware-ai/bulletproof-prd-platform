# Software Bill of Materials — bulletproof-prd-platform

A machine-readable SBOM in **CycloneDX 1.5** format is committed alongside this document:

- [`prd-platform.cyclonedx.json`](prd-platform.cyclonedx.json)

It was generated from the resolved production dependency tree with:

```bash
npm install
npm sbom --sbom-format cyclonedx --omit dev > docs/prd-platform.cyclonedx.json
```

`--omit dev` excludes devDependencies (test/build tooling such as Vitest, Playwright, ESLint,
TypeScript, Tailwind build plugins), so the SBOM reflects what actually ships at runtime.

## Summary

| Metric | Value |
|--------|-------|
| Format | CycloneDX 1.5 (JSON) |
| Components (production) | **490** |
| Root package | `prd-platform@0.1.0` |
| Generator | `npm sbom` |

## License distribution

| License | Components |
|---------|-----------:|
| MIT | 428 |
| Apache-2.0 | 27 |
| ISC | 16 |
| BSD-3-Clause | 7 |
| BSD-2-Clause | 7 |
| BlueOak-1.0.0 | 2 |
| LGPL-3.0-or-later | 1 |
| Unlicense | 1 |
| Undeclared in registry metadata | 1 (`seq-queue@0.0.5`) |

All licenses are permissive and compatible with this project's Apache-2.0 license. The single
component without a declared license (`seq-queue`, a transitive dependency of the `pg` Postgres
driver stack) is historically published under a permissive/BSD-style license; the field is
simply absent from its registry metadata.

## Notable direct dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.2.11 | Web framework (App Router) |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `prisma` / `@prisma/client` | 7.6.0 | ORM |
| `@prisma/adapter-pg` | 7.6.0 | Prisma pg driver adapter |
| `pg` | 8.20.0 | PostgreSQL client |
| `@tiptap/react` | 3.22.1 | WYSIWYG editor |
| `unified` | 11.0.5 | Markdown ⇄ HTML pipeline |
| `tailwind-merge` | 3.5.0 | Tailwind class merging |

## Dependency security remediation

Several transitive and direct dependencies were upgraded to clear known CVEs surfaced by the
Code Hardener scan (see [scan/scan-report.md](scan/scan-report.md)). The most significant:
`next 16.2.11`, `sharp ^0.35.0`, `postcss ^8.5.12`, `fast-uri ^3.1.4`, `hono ^4.12.25`,
`linkify-it ^5.0.2`, `js-yaml ^4.3.0`, and `brace-expansion ^1.1.16 / ^5.0.7` (the last four
pinned via `overrides` in `package.json`). After remediation the scan reports **0 critical /
0 high** dependency findings.

## Base image

The application `Dockerfile` builds from **`node:20-alpine`** and runs as a non-root user
(`nextjs`, uid 1001). Scan the base image separately in your own pipeline for OS-level CVEs.

## Regenerating

```bash
npm install
npm sbom --sbom-format cyclonedx --omit dev > docs/prd-platform.cyclonedx.json
```

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [LICENSE](../LICENSE) and [NOTICE](../NOTICE).
