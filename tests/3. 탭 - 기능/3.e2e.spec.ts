import { expect, test } from "@playwright/test";

test("3. 드래그로 탭 순서를 바꿀 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await editor.fill("second");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await editor.fill("third");

  const tabs = page.locator(".tab-item");
  await expect(tabs.locator(".tab-title")).toHaveText([
    "first",
    "second",
    "third",
  ]);
  await tabs.nth(0).dragTo(tabs.nth(2));
  await expect(tabs.locator(".tab-title")).toHaveText([
    "second",
    "third",
    "first",
  ]);
});
