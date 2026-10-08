import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../__util__";

test("5. 탭 삭제 팝업은 Cancel에 기본 포커스를 두고 포커스를 팝업 안에 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const popup = deleteTabPopup(page);
  const cancelButton = popup.getByRole("button", { name: "Cancel", exact: true });
  const deleteButton = popup.getByRole("button", { name: "Delete", exact: true });
  const closeButton = popup.getByRole("button", { name: "Close deletion confirmation" });
  const focusedInPopup = popup.locator(":focus");
  await editor.fill("Do not delete this note");

  await editor.focus();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();
  await expect(cancelButton).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(deleteButton).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(focusedInPopup).toHaveCount(1);
  await page.keyboard.press("Shift+Tab");
  await expect(focusedInPopup).toHaveCount(1);
  await cancelButton.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(focusedInPopup).toHaveCount(1);
  await expect(editor).not.toBeFocused();
});
