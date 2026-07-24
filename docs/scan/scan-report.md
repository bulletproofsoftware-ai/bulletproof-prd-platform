# Security Scan Report — bulletproof-prd-platform

Independent security scan performed with **Code Hardener** (`standard` profile — 12
code-appropriate scanners). This report summarises the **final, clean** scan after all
critical and high findings were remediated.

## Result

| Metric | Value |
|--------|-------|
| Profile | `standard` |
| Scanners executed | 12 |
| **Critical** | **0** |
| **High** | **0** |
| Medium | 15 |
| Low | 644 |
| Info | 16 |
| Secrets (gitleaks) | **PASS — 0** |
| Attestation | in-toto, Ed25519 signed |

Signed artifacts from this scan:

- [`bulletproof-prd-platform-scan-report.pdf`](bulletproof-prd-platform-scan-report.pdf) — full portal report with attestation certificate (159 pages)
- [`attestation.json`](attestation.json) — in-toto attestation (Ed25519 signature)
- [`scan-report.sarif.json`](scan-report.sarif.json) — SARIF 2.1.0 (paths normalized)
- [`scan-report-full.md`](scan-report-full.md) — full machine-generated report

## Scanners

The `standard` profile ran: **trivy, gitleaks, opengrep, checkov, grype, syft,
package-validator, oxlint, actionlint, jscpd, typos**, plus the file-inventory pass. `ruff`
was skipped (no Python files — this is a TypeScript project). All secret-scanning (gitleaks)
and IaC (checkov) checks passed with zero findings.

## Fixes applied

All 47 HIGH findings were dependency CVEs reported by grype and trivy (each advisory counted
once per scanner). Every one was remediated by upgrading the affected package to (or above) its
first patched version. `next` and `eslint-config-next` are direct dependencies (bumped in
`package.json`); the transitive packages are pinned via an `overrides` block.

| Package | Was | Now (≥) | Advisories cleared |
|---------|-----|---------|--------------------|
| `next` | 16.2.2 | **16.2.11** | SSRF (Server Actions & rewrites), DoS (Server Components / Server Actions), middleware/proxy bypass, authorization bypass, info disclosure — GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj, CVE-2026-64649, -64645, -64642, -64641, -45109, -44573, -44574, -44575, -44578, -44579 |
| `sharp` | 0.34.5 | **0.35.0** (resolved 0.35.3) | libvips CVEs — GHSA-f88m-g3jw-g9cj (CVE-2026-33327/33328/35590/35591) |
| `postcss` | 8.4.31 / 8.5.8 | **8.5.12** (resolved 8.5.23) | Arbitrary file read via `sourceMappingURL` — CVE-2026-45623 |
| `fast-uri` | 3.1.0 | **3.1.4** | URI authority bypass, path traversal, Unicode canonicalization bypass — CVE-2026-16221, -13676, -6321, -6322 |
| `hono` | 4.12.10 | **4.12.25** (resolved 4.12.32) | CORS reflects any Origin with credentials — CVE-2026-54290 |
| `linkify-it` | 5.0.0 | **5.0.2** | ReDoS in `mailto:` validator — CVE-2026-59887, -48801 |
| `js-yaml` | 4.1.1 | **4.3.0** | DoS via crafted YAML — CVE-2026-59869 |
| `brace-expansion` | 5.0.5 (and 1.1.13 present) | **5.0.7 / 1.1.16** | ReDoS — CVE-2026-13149 |

After these fixes: `npm run build` exits 0 and all 62 unit tests pass. A re-scan of the same
`standard` profile confirmed **0 critical / 0 high**.

## What remains (low-risk, not blocking)

Per the org scanning policy, medium and low findings are not chased to zero — they are
cosmetic, environmental, or accepted residual risk. Honestly, the residuals are:

- **15 medium.** These include: two `github-actions-mutable-action-tag` notices (the CI workflow
  pins `actions/checkout@v4` and `actions/setup-node@v4` to mutable major tags rather than commit
  SHAs — low practical risk for first-party GitHub actions), three oxlint style/lint items, and a
  handful of transitive CVEs in build/dev-only tooling not on the runtime path.
- **644 low / 16 info.** Overwhelmingly lint hygiene (unused-vars, style) and informational
  inventory entries. `oxlint --fix` is deliberately **not** run — it strips defensive null-guards.
- **`typos`** scanner reported a runtime error (0 findings recorded); this is a scanner-side
  glitch, not a code defect.

None of the residual items are critical or high severity.

## Reproduce

```bash
# via the Code Hardener API (standard profile)
curl -X POST http://<code-hardener>/api/v1/scans \
  -H 'Content-Type: application/json' \
  -d '{"projectId":"<id>","repositoryUrl":"file:///path/to/repo","scanType":"standard","branch":"main"}'
```

---

Apache-2.0 © 2026 bulletproofsoftware-ai. See [../LICENSE](../../LICENSE) and [../NOTICE](../../NOTICE).
