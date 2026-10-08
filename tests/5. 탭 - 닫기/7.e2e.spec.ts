import { expect, test } from "@playwright/test";

test("7. Alt+Backspace로 빈 활성 탭은 바로 닫고 내용이 있는 탭은 확인 후 삭제한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });
  await expect(tabs).toHaveCount(1);

  await editor.fill("Keep the first note");
  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the first note");

  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await editor.fill("Shortcut close confirmation");
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(editor).toHaveValue("Shortcut close confirmation");

  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the first note");

  await editor.fill("Target note");
  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await editor.fill("Keep the active note");
  await tabs.first().locator(".tab-close").click();
  await expect(popup).toBeVisible();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the active note");
});
