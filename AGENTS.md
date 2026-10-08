<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit Messages

After completing code changes, suggest a Korean commit message that matches the change. Keep one of the prefixes `test:`, `feat:`, `style:`, or `fix:`.

## E2E Test Structure

Every E2E test code file (`*.e2e.spec.ts`) must contain exactly one top-level `test(...)` declaration and register exactly one test case. Do not generate multiple tests from loops or parameterized declarations in one file. Split separate scenarios into their own numbered PRD requirements and matching E2E files. Shared resource files must not declare tests.

When writing E2E tests, create `__mock__/`, `__fixture__/`, `__util__/`, or `__constant__/` folders when shared test doubles, fixtures, helpers, or constants are needed. Put broadly reusable resources under `tests/`; put resources used only by one requirement title under that title's folder. Every such folder must include a barrel `index.ts`, and tests should import from the barrel when practical.

## Specification Synchronization

When functionality is added, removed, or improved, update `PRD.md` to match the current implementation in the same change. Treat `PRD.md` as the source of truth for the E2E test scope: when `PRD.md` changes, add, update, or remove the corresponding tests under `tests/` so they fully reflect the current requirements.

Keep the numbered structure in `PRD.md` and `tests/` in exact sync. Each `## N. Title` section must have a matching `tests/N. Title/` directory, and each numbered requirement under that section must have exactly one corresponding `N.e2e.spec.ts` file in that directory. The test file numbers and total count must match the PRD requirement numbers and count, with no missing or extra requirement tests. For example, if `## 10. 하단부 표시` has four numbered requirements, `tests/10. 하단부 표시/` must contain `1.e2e.spec.ts` through `4.e2e.spec.ts`, each covering its matching requirement. Update `tests/**` whenever a PRD requirement is added, changed, or removed, and update `PRD.md` whenever the requirement scope changes.

Do not consider the work complete until all updated E2E tests pass. Run `npm run test:e2e` and require a 100% pass rate; fix implementation, test, fixture, mock, or utility issues before reporting completion.

## Feature and Widget Module Structure

- Each feature or widget module directly under `src/feature/` or `src/widget/` must implement its main module in its own `index.tsx`.
- `src/feature/index.ts` and `src/widget/index.ts` must export the public modules for their respective directories.
- Those top-level barrels may export only each module's main implementation from `./<module>` (resolved through that module's `index.tsx`); do not export subcomponents such as `PaneDivider` from them. Apply this restriction equally to feature and widget modules.
- Export subcomponents from the submodule's `component/index.ts` or `component/index.tsx` barrel, and import and use those subcomponents from the submodule's `index.tsx`.
- `page/home` and other consumers must import feature and widget modules through the public `feature/index.ts` and `widget/index.ts` barrels.

## Entity UI Components

- Put common UI components shared by feature, widget, or page modules under `src/entity/ui/`, not under a `component/` directory.
- Structure each one exactly like a feature, widget, or page module: a `src/entity/ui/<component>/` directory with its main implementation in `index.tsx` and its main stylesheet in `index.scss`. Apply the subcomponent `component/` and `style/` rules below to these modules as well.
- The top-level class selector in a UI component's `index.scss` must match its directory name (for example, `.side-panel` in `side-panel/index.scss`). Keep shared component styles in that stylesheet instead of SCSS mixins, and load it from the page stylesheet with `@use "../../entity/ui/<component>"`.
- `src/entity/ui/index.ts` may export only each UI component's main implementation. Consumers import these components through `@/src/entity/ui` (or `@/src/entity`) and put module-specific overrides in their own stylesheet, scoped under their own top-level class.

## Feature, Widget, and Page Stylesheets

- Each feature, widget, or page module must keep its main stylesheet in `index.scss` next to its `index.tsx`. Put optional SCSS files for subcomponents under that module's `style/` directory.
- The top-level class selector in a module's `index.scss` must match the module directory name (for example, `.body` in `body/index.scss` or `.bookmark` in `bookmark/index.scss`). Apply these stylesheet rules equally to `src/feature/`, `src/widget/`, and `src/page/` modules.
- Whenever a module adds `component/<sub-comp>.tsx`, it must add the matching `style/<sub-comp>.scss` in the same change, even if the stylesheet is initially empty. Apply this pairing rule to feature, widget, and page modules.
