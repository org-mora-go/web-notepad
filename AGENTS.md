<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit Messages

After completing code changes, suggest a Korean commit message that matches the change. Keep one of the prefixes `test:`, `feat:`, `style:`, or `fix:`.

## E2E Test Structure

When writing E2E tests, create `__mock__/`, `__fixture__/`, or `__util__/` folders when shared test doubles, fixtures, or helpers are needed. Put broadly reusable resources under `tests/`; put resources used only by one requirement title under that title's folder. Every such folder must include a barrel `index.ts`, and tests should import from the barrel when practical.

## Specification Synchronization

When functionality is added, removed, or improved, update `tests/PRD.md` to match the current implementation in the same change. Treat `tests/PRD.md` as the source of truth for the E2E test scope: when `tests/PRD.md` changes, add, update, or remove the corresponding tests under `tests/` so they fully reflect the current requirements.

Keep the numbered structure in `tests/PRD.md` and `tests/` in exact sync. Each `## N. Title` section must have a matching `tests/N. Title/` directory, and each numbered requirement under that section must have exactly one corresponding `N.e2e.spec.ts` file in that directory. The test file numbers and total count must match the PRD requirement numbers and count, with no missing or extra requirement tests. For example, if `## 10. 하단부 표시` has four numbered requirements, `tests/10. 하단부 표시/` must contain `1.e2e.spec.ts` through `4.e2e.spec.ts`, each covering its matching requirement. Update `tests/**` whenever a PRD requirement is added, changed, or removed, and update `tests/PRD.md` whenever the requirement scope changes.

Do not consider the work complete until all updated E2E tests pass. Run `npm run test:e2e` and require a 100% pass rate; fix implementation, test, fixture, mock, or utility issues before reporting completion.
