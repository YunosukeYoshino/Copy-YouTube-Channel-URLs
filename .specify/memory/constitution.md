# Copy YouTube Channel URLs Constitution
<!--
Sync Impact Report
Version change: 0.0.0 → 1.0.0
Modified principles: None previously defined → Value-First Delivery; Spec-First Planning; Test-First Assurance; Chrome Manifest Discipline; Observability & Maintainability.
Added sections: Operational Guardrails; Development Workflow & Quality Gates.
Removed sections: None.
Templates requiring updates: ✅ .specify/templates/plan-template.md (guidance already generic); ✅ .specify/templates/spec-template.md (no constitution references); ✅ .specify/templates/tasks-template.md (framework agnostic); ⚠ README.md (updated to highlight esbuild bundling and Bun commands).
Follow-up TODOs: None.
-->

## Core Principles

### Value-First Delivery
Every initiative must tie to a measurable user outcome (copying visible YouTube channel video URLs in minutes, reducing manual clicks, or clarifying failure states). Value-First Delivery boundaries: features that cannot show clear clipboard/UX payoff remain deferred, and every change request describes the user pain, desired outcome, and how success will be observed.

### Spec-First Planning
Before any code is written, the team crafts or updates the specification (`specs/[###-feature-name]/spec.md`) describing user scenarios, acceptance criteria, and assumptions. Specifications become the contract for testing and implementation; deviations must be documented, reviewed with the product owner, and added back to the spec before code merges.

### Test-First Assurance
Every story begins with at least one automated test (unit, DOM parsing, or contract) that fails under the new behavior, followed by implementation and then verification. Regression tests must cover the clipboard copy workflow and any guardrails (non-channel pages, missing thumbnails) before merging; manual testing notes (documentation in `docs/manual-testing.md`) complete the validation cycle.

### Chrome Manifest Discipline
Chrome/V3 constraints are treated as non-negotiable requirements: bundles must be produced as single Service Worker and content script files (no stray `export` statements), permissions must be scoped to needed YouTube hosts, and the manifest/content script declarations must always match the files emitted by the bundler. Build scripts (currently esbuild tasks) always run before packaging or manual testing.

### Observability & Maintainability
Every clipboard copy event, permission failure, or non-channel context generates lightweight logs accessible via `chrome.runtime` messaging; these logs inform future improvements without depending on third-party telemetry. Code stays within the TypeScript/Bun toolchain, README/manual tests capture developer steps, and addition of new tooling or dependencies first passes through this constitution to ensure maintainability.

## Operational Guardrails
Bundles always originate from the `src/` hierarchy and are emitted via `bun run build` (esbuild bundling). The project ignores `dist/`, local keys, or packaged archives and keeps dependencies limited to Chrome APIs, TypeScript, Bun, and supporting test tooling. Any new permission request is justified in the spec, and security/performance impacts are outlined before the manifest changes.

## Development Workflow & Quality Gates
Work proceeds from specification → plan → tasks → implementation. Documentation updates (`docs/manual-testing.md`, README) accompany new flows. Tasks follow the existing phase structure (Setup → Foundation → User Stories → Polish) with explicit checklists; build and lint scripts run before releases, and packaging adheres to Manifest V3 via bundled, module-free artifacts. PR reviewers verify compliance with this constitution, confirm required tests exist, and signal blockers for imagery, permissions, or observability gaps.

## Governance
This constitution supersedes other project guidance when conflicts arise. Amendments require an updated document, a rationale recorded in the Sync Impact Report, and confirmation from at least one peer reviewer before merging. Changes are tracked via semantic versioning; the constitution is reviewed quarterly or whenever Chrome platform requirements shift, and all PRs must reference the current version.

**Version**: 1.0.0 | **Ratified**: 2025-11-16 | **Last Amended**: 2025-11-16
