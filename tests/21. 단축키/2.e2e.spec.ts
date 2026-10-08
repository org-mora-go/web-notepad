import { expect, test } from "@playwright/test";

test("2. Alt+Backspace는 활성 탭을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await page.keyboard.press("Alt+Backspace");
  await expect(tabs).toHaveCount(1);
  const editor = page.locator("textarea");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });
  await editor.fill("Shortcut close confirmation");
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(editor).toHaveValue("Shortcut close confirmation");
  await page.keyboard.press("Alt+Backspace");
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(editor).toHaveValue("");
});
