# Security Scan Report: bulletproof-prd-platform

**Scan ID:** `aaea5293-979d-49f3-9ca8-7f785d6806bd`
**Date:** 2026-07-24T22:28:51.813Z
**Score:** 964/1000 (excellent)
**Branch:** main | **Commit:** `N/A`
**Profile:** standard

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 15 |
| Low | 644 |
| Info | 16 |
| **Total (open)** | **675** |

> **Note:** The counts above reflect _open_ findings only.
> 1 scanner(s) were skipped — see "Skipped Scanners" below.

## Scanners Executed

| Scanner | Status | Findings | Duration | Notes |
|---------|--------|----------|----------|-------|
| trivy | pass | 690 | 3.1s |  |
| gitleaks | pass | 0 | 0.5s |  |
| opengrep | pass | 2 | 8.3s |  |
| checkov | pass | 0 | 3.6s |  |
| grype | pass | 7 | 3.7s |  |
| syft | pass | 4 | 1.7s |  |
| package-validator | pass | 0 | 3.5s |  |
| oxlint | pass | 3 | 0.0s |  |
| ruff | skipped | 0 | 0.0s | _skipped: no_matching_files_ |
| actionlint | pass | 0 | 0.0s |  |
| jscpd | pass | 0 | 0.0s |  |
| typos | fail | 0 | 0.0s | _error: Cannot read properties of undefined (reading 'length')_ |
| _file_inventory | pass | 0 | 0.0s |  |

## Medium Findings (15)

### [MEDIUM] Variable 'res' is declared but never used. Unused variables should start with a '_'.

- **File:** `src/__tests__/api/reviews.test.ts`
- **Scanner:** oxlint
- **Rule:** `OXLINT-UNKNOWN`

**What's wrong:** Variable 'res' is declared but never used. Unused variables should start with a '_'.

**How to fix:** Review this finding and apply the appropriate fix based on the description: Variable 'res' is declared but never used. Unused variables should start with a '_'.

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Unexpected constant truthiness on the left-hand side of a "&&" expression

- **File:** `src/__tests__/lib/utils.test.ts`
- **Scanner:** oxlint
- **Rule:** `OXLINT-UNKNOWN`

**What's wrong:** Unexpected constant truthiness on the left-hand side of a "&&" expression

**How to fix:** Review this finding and apply the appropriate fix based on the description: Unexpected constant truthiness on the left-hand side of a "&&" expression

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Parameter 'content' is declared but never used. Unused parameters should start with a '_'.

- **File:** `src/lib/governance.ts`
- **Scanner:** oxlint
- **Rule:** `OXLINT-UNKNOWN`

**What's wrong:** Parameter 'content' is declared but never used. Unused parameters should start with a '_'.

**How to fix:** Review this finding and apply the appropriate fix based on the description: Parameter 'content' is declared but never used. Unused parameters should start with a '_'.

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `/package-lock.json`
- **Scanner:** grype
- **Rule:** `GHSA-frvp-7c67-39w9`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** Node.js Adapter for Hono: Path traversal in `serve-static` on Windows via encoded backslash (`%5C`)

**Code:**
```json
Package: @hono/node-server
Version: 1.19.11
Type: npm
Language: javascript
```

**How to fix:** Update @hono/node-server to version 2.0.5

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `/package-lock.json`
- **Scanner:** grype
- **Rule:** `CVE-2026-48988`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** markdown-it: Quadratic complexity DoS in smartquotes rule via replaceAt string operations

**Code:**
```json
Package: markdown-it
Version: 14.1.1
Type: npm
Language: javascript
```

**How to fix:** Update markdown-it to version 14.2.0

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `/package-lock.json`
- **Scanner:** grype
- **Rule:** `CVE-2026-8723`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set

**Code:**
```json
Package: qs
Version: 6.15.0
Type: npm
Language: javascript
```

**How to fix:** Update qs to version 6.15.2

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `/package-lock.json`
- **Scanner:** grype
- **Rule:** `CVE-2026-39406`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** @hono/node-server: Middleware bypass via repeated slashes in serveStatic

**Code:**
```json
Package: @hono/node-server
Version: 1.19.11
Type: npm
Language: javascript
```

**How to fix:** Update @hono/node-server to version 1.19.13

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `/package-lock.json`
- **Scanner:** grype
- **Rule:** `CVE-2026-42338`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** ip-address has XSS in Address6 HTML-emitting methods

**Code:**
```json
Package: ip-address
Version: 10.1.0
Type: npm
Language: javascript
```

**How to fix:** Update ip-address to version 10.1.1

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-github-action compromises. Pin the reference to a full 40-character commit SHA instead, e.g. \`uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608\`.

- **File:** `.github/workflows/ci.yml:16`
- **Scanner:** opengrep
- **Rule:** `yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag`
- **CWE:** [CWE-1357: Reliance on Insufficiently Trustworthy Component](https://cwe.mitre.org/data/definitions/1357.html)
- **OWASP:** A08:2021 - Software and Data Integrity Failures

**What's wrong:** GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-github-action compromises. Pin the reference to a full 40-character commit SHA instead, e.g. `uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608`.

**Code:**
```yaml
requires login
```

**How to fix:** Review this finding and apply the appropriate fix based on the description: GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-gi

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-github-action compromises. Pin the reference to a full 40-character commit SHA instead, e.g. \`uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608\`.

- **File:** `.github/workflows/ci.yml:14`
- **Scanner:** opengrep
- **Rule:** `yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag`
- **CWE:** [CWE-1357: Reliance on Insufficiently Trustworthy Component](https://cwe.mitre.org/data/definitions/1357.html)
- **OWASP:** A08:2021 - Software and Data Integrity Failures

**What's wrong:** GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-github-action compromises. Pin the reference to a full 40-character commit SHA instead, e.g. `uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608`.

**Code:**
```yaml
requires login
```

**How to fix:** Review this finding and apply the appropriate fix based on the description: GitHub Actions step uses a mutable tag or branch reference. Tags and branch names can be silently repointed by the action owner, enabling supply-chain attacks — as seen in the trivy-action and kics-gi

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `package-lock.json`
- **Scanner:** trivy
- **Rule:** `CVE-2026-8723`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** ### Summary



`qs.stringify` throws `TypeError` when called with `arrayFormat: 'comma'` and `encodeValuesOnly: true` on an array containing `null` or `undefined`. The throw is synchronous and not handled by any of qs's null-related options (`skipNulls`, `strictNullHandling`).



### Details



In the comma + `encodeValuesOnly` branch, `lib/stringify.js:145` mapped the array through the raw encoder before joining:



```js



obj = utils.maybeMap(obj, encoder);



```



`utils.encode` (`lib/utils.js:195`) reads `str.length` with no null guard, so a `null` or `undefined` element throws `TypeError`. `skipNulls` and `strictNullHandling` are both checked in the per-element loop below this line and never get a chance to run.



Same class of bug as the filter-array path fixed in 0c180a4. The vulnerable shape of the comma + `encodeValuesOnly` branch was introduced in 4c4b23d ("encode comma values more consistently", PR #463, 2023-01-19), first released in v6.11.1.



#### PoC



```js



const qs = require('qs');



qs.stringify({ a: [null, 'b'] },      { arrayFormat: 'comma', encodeValuesOnly: true });



qs.stringify({ a: [undefined, 'b'] }, { arrayFormat: 'comma', encodeValuesOnly: true });



qs.stringify({ a: [null] },           { arrayFormat: 'comma', encodeValuesOnly: true });



// TypeError: Cannot read properties of null (reading 'length')



//     at encode (lib/utils.js:195:13)



//     at Object.maybeMap (lib/utils.js:322:37)



//     at stringify (lib/stringify.js:145:25)



```



#### Fix



`lib/stringify.js:145`, applied in 21f80b3 on `main` and released as v6.15.2:



```diff



- obj = utils.maybeMap(obj, encoder);



+ obj = utils.maybeMap(obj, function (v) {



+     return v == null ? v : encoder(v);



+ });



```



`null` and `undefined` now pass through `maybeMap` unchanged and reach the `join(',')` step as-is. For `{ a: [null, 'b'] }` this produces `a=,b`, matching the non-`encodeValuesOnly` comma path (which already joins before encoding and produces `a=%2Cb` for the same input). Single-element `[null]` arrays still collapse via the existing `obj.join(',') || null` and remain subject to `skipNulls` / `strictNullHandling` in the main loop.



### Affected versions



`>=6.11.1 <6.15.2` — fixed in v6.15.2.



The vulnerable code shape was introduced in 4c4b23d and first shipped in v6.11.1. Earlier versions — including all of 6.7.x, 6.8.x, 6.9.x, 6.10.x, and 6.11.0 — implemented the comma + `encodeValuesOnly` path differently (joining before encoding) and are not affected. Empirically verified across released versions.



### Impact



Application code that calls `qs.stringify` with both `arrayFormat: 'comma'` and `encodeValuesOnly: true` (both non-default) on input that may contain a `null` or `undefined` array element will throw synchronously instead of producing a query string. In a typical Node.js HTTP framework (Express, Fastify, Koa, hapi) the sync throw is caught by the framework's error boundary and the affected request returns a 500; the worker process does not exit and subsequent requests are unaffected. The "kills the worker process" framing applies only to call sites outside a request-handler error boundary (background jobs, startup paths, stream pipelines) or to deployments with framework error handling explicitly disabled.



The vulnerable input is a `null` or `undefined` entry inside an array; this is reachable from JSON request bodies or from application code constructing arrays from user input, but not from standard HTML form submissions (which produce strings or omitted fields, not literal `null`).

**Code:**
```json
Package: qs
Installed: 6.15.0
Fixed: 6.15.2
```

**How to fix:** Update qs to version 6.15.2

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `package-lock.json`
- **Scanner:** trivy
- **Rule:** `CVE-2026-48988`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** markdown-it is a Markdown parser. Versions 14.1.1 and below contain a denial-of-service vulnerability when typographer: true is enabled, due to quadratic (O(n^2)) processing in the smartquotes rule. The issue stems from repeatedly modifying strings with replaceAt(), which performs O(n) slicing and concatenation per quote character. This can cause excessive CPU consumption when parsing quote-heavy, user-supplied markdown and may let attackers degrade or disrupt service availability. Although typographer is disabled by default, many production apps enable it for smart typography, making the issue relevant. This issue has been fixed in version 14.2.0.

**Code:**
```json
Package: markdown-it
Installed: 14.1.1
Fixed: 14.2.0
```

**How to fix:** Update markdown-it to version 14.2.0

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `package-lock.json`
- **Scanner:** trivy
- **Rule:** `CVE-2026-42338`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** ip-address is a library for parsing and manipulating IPv4 and IPv6 addresses in JavaScript. Prior to 10.1.1, Address6.group() and Address6.link() do not HTML-escape attacker-controlled content before embedding it in the HTML strings they return, and AddressError.parseMessage (emitted by the Address6 constructor for invalid input) can contain unescaped attacker-controlled content in one branch. An application that (1) passes untrusted input to Address6 and (2) renders the output of these methods, or the thrown error's parseMessage, as HTML (e.g. via innerHTML) is vulnerable to cross-site scripting. This vulnerability is fixed in 10.1.1.

**Code:**
```json
Package: ip-address
Installed: 10.1.0
Fixed: 10.1.1
```

**How to fix:** Update ip-address to version 10.1.1

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `package-lock.json`
- **Scanner:** trivy
- **Rule:** `GHSA-frvp-7c67-39w9`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** The same as the `hono` core [Path traversal in `serve-static` on Windows via encoded backslash (`%5C`)](https://github.com/honojs/hono/security/advisories/GHSA-wwfh-h76j-fc44).

### Summary

On Windows hosts, an encoded backslash (`%5C`) in the request path decodes to `\`, which the Windows path resolver treats as a separator. `serve-static` then resolves a single URL segment such as `admin\secret.txt` into a nested file under the root and serves it, letting an attacker read static files meant to be protected behind prefix-mounted middleware. Directory escape (`..`) remains blocked.

### Details

The router splits paths only on `/`, so `/admin%5Csecret.txt` is one segment and middleware on `/admin/*` does not run. The `serve-static` guard rejects `.`/`..` and consecutive separators but lets a lone `\` through; on Windows the file resolver re-splits it into the protected subtree.

This affects Windows hosts serving static files via the Node, Bun, or Deno adapters that guard a static subtree with prefix-mounted middleware.

### Impact

An unauthenticated attacker can read static files under a middleware-guarded prefix on Windows hosts. The read stays within the configured root; escape outside the root is not possible.

**Code:**
```json
Package: @hono/node-server
Installed: 1.19.11
Fixed: 2.0.5
```

**How to fix:** Update @hono/node-server to version 2.0.5

**Action:** Plan to fix this issue in your next sprint or release.

---

### [MEDIUM] Using outdated libraries with known security issues.

- **File:** `package-lock.json`
- **Scanner:** trivy
- **Rule:** `CVE-2026-39406`
- **OWASP:** A06:2021-Vulnerable and Outdated Components

**What's wrong:** @hono/node-server allows running the Hono application on Node.js. Prior to 1.19.13, a path handling inconsistency in serveStatic allows protected static files to be accessed by using repeated slashes (//) in the request path. When route-based middleware (e.g., /admin/*) is used for authorization, the router may not match paths containing repeated slashes, while serveStatic resolves them as normalized paths. This can lead to a middleware bypass. This vulnerability is fixed in 1.19.13.

**Code:**
```json
Package: @hono/node-server
Installed: 1.19.11
Fixed: 1.19.13
```

**How to fix:** Update @hono/node-server to version 1.19.13

**Action:** Plan to fix this issue in your next sprint or release.

---

## Low Findings (644)

- **SBOM-LICENSE-UNKNOWN**: Unknown License: seq-queue@0.0.5 (`/package-lock.json`)
- **SBOM-LICENSE-UNKNOWN**: Unknown License: prd-platform@0.1.0 (`/package-lock.json`)
- **SBOM-LICENSE-UNKNOWN**: Unknown License: actions/setup-node@v4 (`/.github/workflows/ci.yml`)
- **SBOM-LICENSE-UNKNOWN**: Unknown License: actions/checkout@v4 (`/.github/workflows/ci.yml`)
- **CVE-2026-49356**: CVE-2026-49356: Vulnerability in @babel/core@7.29.0 (`/package-lock.json`)
- **CVE-2026-12590**: CVE-2026-12590: Vulnerability in body-parser@2.2.2 (`/package-lock.json`)
- **LICENSE-Apache-2.0**: License Compliance: Apache-2.0 in  (`LICENSE`)
- **LICENSE-MIT**: License Compliance: MIT in zwitch (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in zod-to-json-schema (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in zod (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in zeptomatch (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in yoctocolors-cjs (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in yoctocolors (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in yargs-parser (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in yargs (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in yallist (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in y18n (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in xtend (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in wsl-utils (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in wrappy (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in wrap-ansi (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in which (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in web-streams-polyfill (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in w3c-keyname (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in vfile-message (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in vfile (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in vary (`package-lock.json`)
- **LICENSE-ISC**: License Compliance: ISC in validate-npm-package-name (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in valibot (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in util-deprecate (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in use-sync-external-store (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in update-browserslist-db (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in until-async (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unpipe (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in universalify (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unist-util-visit-parents (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unist-util-visit (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unist-util-stringify-position (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unist-util-position (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unist-util-is (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in unicorn-magic (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in undici-types (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in uc.micro (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in type-is (`package-lock.json`)
- **LICENSE-(MIT OR CC0-1.0)**: License Compliance: (MIT OR CC0-1.0) in type-fest (`package-lock.json`)
- **LICENSE-0BSD**: License Compliance: 0BSD in tslib (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in tsconfig-paths (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in ts-morph (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in trough (`package-lock.json`)
- **LICENSE-MIT**: License Compliance: MIT in trim-lines (`package-lock.json`)

> ... and 594 more low findings

## Skipped Scanners (1)

Scanners that did not run on this scan, with the reason why and how to enable them.

| Scanner | Reason | How to enable |
|---------|--------|---------------|
| `ruff` | no_matching_files | No .py files found — Ruff requires a Python project |

## Recommendations

1. Update 650 vulnerable dependency/dependencies -- run `npm audit fix` or equivalent

---
*Generated by Code Hardener v0.1.0 | 2026-07-24T22:29:09.640Z*