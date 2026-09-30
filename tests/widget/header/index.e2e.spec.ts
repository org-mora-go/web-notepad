import { expect, test } from "@playwright/test";

test("탭을 마우스 휠 클릭하면 탭이 닫힌다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).click({ button: "middle" });
  await expect(tabs).toHaveCount(1);
});

test("탭은 제목 길이에 맞춰 제한 너비 내에서 늘어난다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const shortTab = page.locator(".tab-item").first();
  const shortWidth = await shortTab.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  const editor = page.locator("textarea").first();
  await editor.fill("A title long enough to expand this tab");

  const activeTab = page.locator(".tab-item.is-active");
  await expect(activeTab.locator(".tab-title")).toContainText(
    "A title long enough",
  );
  const expandedWidth = await activeTab.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  expect(expandedWidth).toBeGreaterThan(shortWidth);
  expect(expandedWidth).toBeLessThanOrEqual(301);
});

test("탭을 고정해도 기존 탭 순서를 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-label="새 탭 추가"]').click();

  const tabs = page.locator('[role="tab"]');
  const tabTitlesBeforePin = await tabs.allTextContents();
  const secondTab = page.locator(".tab-item").nth(1);
  await secondTab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();

  await expect(secondTab).toHaveClass(/is-pinned/);
  await expect.poll(() => tabs.allTextContents()).toEqual(tabTitlesBeforePin);
});

test("컨텍스트 메뉴에서 탭을 고정하면 닫기 버튼이 숨겨지고 가운데 클릭으로 닫히지 않는다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();

  await expect(tab).toHaveClass(/is-pinned/);
  await expect(tab.locator(".tab-close")).toHaveCount(0);
  await tab.locator('[role="tab"]').click({ button: "middle" });
  await expect(tab).toHaveClass(/is-pinned/);
});

test("고정된 탭은 Alt+W 단축키로 닫히지 않는다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const tabs = page.locator('[role="tab"]');
  await expect(tabs.first()).toBeVisible();
  const initialTabCount = await tabs.count();
  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();
  await page.keyboard.press("Alt+w");

  await expect(tabs).toHaveCount(initialTabCount);
  await expect(tab).toHaveClass(/is-pinned/);
});

test("컨텍스트 메뉴에서 Escape를 누르면 상태 변경 없이 메뉴만 닫힌다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});

test("28자를 넘는 제목은 정확히 28자까지만 탭 이름으로 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.locator("textarea").first().fill("A".repeat(40));
  const activeTab = page.locator(".tab-item.is-active");
  await expect(activeTab.locator(".tab-title")).toHaveText("A".repeat(28));

  const tabWidth = await activeTab.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  expect(tabWidth).toBeLessThanOrEqual(301);
});
