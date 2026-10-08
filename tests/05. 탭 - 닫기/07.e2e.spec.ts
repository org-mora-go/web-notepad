import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../__util__";
import { requestInactiveTabDelete } from "./__util__";

test("7. Alt+Backspace로 빈 활성 탭은 바로 닫고 내용이 있는 탭은 확인 후 삭제한다", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  const popup = deleteTabPopup(page);
  await expect(tabs).toHaveCount(1);

  await editor.fill("Keep the first note");
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the first note");

  await addTabButton(page).click();
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

  await requestInactiveTabDelete(page);
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the active note");
});
