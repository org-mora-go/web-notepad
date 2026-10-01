import { expect, test } from "@playwright/test";

test("a. Next.js 앱 화면과 React 노트 편집기가 표시된다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/Notepad/);
  await expect(page.locator("textarea").first()).toBeVisible();
  await expect(page.locator('[role="tab"]').first()).toBeVisible();
});
