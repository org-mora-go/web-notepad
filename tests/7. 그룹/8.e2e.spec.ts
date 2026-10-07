import { expect, test } from "@playwright/test";
import { seedDeletableGroup } from "./__util__";

test("8. 그룹 삭제 팝업은 취소 버튼에 초기 포커스를 두고 키보드 포커스를 가둔다", async ({ page }) => {
  const { toggle } = await seedDeletableGroup(page);
  await toggle.click();
  const deleteButton = page.getByRole("button", { name: "Archive 그룹 삭제" });
  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await deleteButton.click();
  await expect(popup.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();

  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Tab");
    expect(await popup.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Shift+Tab");
    expect(await popup.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(deleteButton).toBeFocused();
});
