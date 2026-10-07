import { expect, test } from "@playwright/test";
import { seedDeletableGroup } from "./__util__";

test("6. 그룹 삭제는 실제 그룹 이름을 표시하는 앱 내부 확인 팝업을 연다", async ({ page }) => {
  const { toggle } = await seedDeletableGroup(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await toggle.click();

  let nativeDialogOpened = false;
  page.on("dialog", async (dialog) => {
    nativeDialogOpened = true;
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Archive 그룹 삭제" }).click();
  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("Do you want to delete Archive?");
  expect(nativeDialogOpened).toBe(false);
});
