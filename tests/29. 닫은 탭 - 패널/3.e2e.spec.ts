import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedCommand, readStoredState } from "../__util__";

test("3. 닫은 탭 삭제 시 영구 삭제 확인 팝업을 표시하고 Delete를 선택한 경우에만 삭제한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "remove me");
  await closedCommand(page).click();

  let nativeDialogOpened = false;
  page.on("dialog", async (dialog) => {
    nativeDialogOpened = true;
    await dialog.dismiss();
  });
  await page.locator(".closed-item .remove-closed").click();
  const popup = page.getByRole("alertdialog", { name: "Delete closed tab" });
  await expect(popup).toBeVisible();
  await expect(popup).toContainText(
    "This closed tab will be permanently deleted and cannot be restored. Do you want to delete it?",
  );
  await expect(page.locator(".closed-item")).toHaveCount(1);
  expect(nativeDialogOpened).toBe(false);

  await popup.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(page.locator(".closed-item")).toHaveCount(0);
  await expect(page.locator(".closed-empty")).toHaveText("Empty Closed");
  const state = (await readStoredState(page)) as unknown as { closedTabs: unknown[] };
  expect(state.closedTabs).toEqual([]);
});
