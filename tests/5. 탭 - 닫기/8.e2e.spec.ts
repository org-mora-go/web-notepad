import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../__util__";
import { requestInactiveTabDelete } from "./__util__";

test("8. 탭 삭제 팝업이 열린 동안 다른 탭 단축키와 키 자동 반복 입력을 무시한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const tabs = page.locator(".tab-item");
  const popup = deleteTabPopup(page);
  await requestInactiveTabDelete(page);

  await page.keyboard.press("Alt+Tab");
  await page.keyboard.press("Alt+ArrowUp");
  await page.keyboard.press("Alt+F12");
  await popup.dispatchEvent("keydown", { key: "Backspace", code: "Backspace", altKey: true, repeat: true });
  await expect(popup).toBeVisible();
  await expect(tabs).toHaveCount(2);
  await expect(page.locator(".tab-item.is-active")).toHaveCount(1);
  await expect(tabs.last()).toHaveClass(/is-active/);
  await expect(tabs.first().locator(".tab-title")).toHaveText("Target note");
  await expect(tabs.last().locator(".tab-title")).toHaveText("Keep the active note");

  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(2);
  await expect(editor).toHaveValue("Keep the active note");
});
