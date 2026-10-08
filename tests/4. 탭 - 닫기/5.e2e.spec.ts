import { expect, test } from "@playwright/test";

test("5. 삭제 팝업에서 Alt+Backspace로 대상 탭 삭제를 확인한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const tabs = page.locator(".tab-item");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });
  await editor.fill("Target note");
  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await editor.fill("Keep the active note");
  await tabs.first().locator(".tab-close").click();
  await expect(popup).toBeVisible();
  await page.keyboard.press("Alt+Tab");
  await page.keyboard.press("Alt+ArrowUp");
  await page.keyboard.press("Alt+F12");
  await popup.dispatchEvent("keydown", { key: "Backspace", code: "Backspace", altKey: true, repeat: true });
  await expect(tabs).toHaveCount(2);
  await expect(popup).toBeVisible();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the active note");

  await editor.focus();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();
  await expect(editor).toHaveValue("Keep the active note");
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("");
});