import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("5. 닫은 탭 삭제 팝업은 Cancel에 포커스를 두고 모든 취소 경로에서 항목과 패널을 유지한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "keep me");
  await closedCommand(page).click();
  const deleteButton = page.locator(".closed-item .remove-closed");
  const popup = page.getByRole("alertdialog", { name: "Delete closed tab" });
  const cancelPaths = [
    () => popup.getByRole("button", { name: "Cancel", exact: true }).click(),
    () => popup.getByRole("button", { name: "삭제 확인 닫기" }).click(),
    () => page.keyboard.press("Escape"),
    () => page.mouse.click(4, 4),
  ];

  for (const cancel of cancelPaths) {
    await deleteButton.click();
    await expect(popup.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
    await cancel();
    await expect(popup).toHaveCount(0);
    await expect(page.locator(".closed-item .closed-content")).toHaveText("keep me");
    await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
  }
});
