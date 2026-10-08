import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { seedDeletableGroup } from "./__util__";

test("1. 그룹 삭제는 실제 그룹 이름을 표시하는 앱 내부 확인 팝업을 연다", async ({ page }) => {
  const { toggle, deleteButton, popup } = await seedDeletableGroup(page);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await toggle.click();

  let nativeDialogOpened = false;
  page.on("dialog", async (dialog) => {
    nativeDialogOpened = true;
    await dialog.dismiss();
  });
  await deleteButton.click();
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("Do you want to delete Archive?");
  expect(nativeDialogOpened).toBe(false);
});
