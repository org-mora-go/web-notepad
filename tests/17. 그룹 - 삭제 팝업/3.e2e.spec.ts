import { expect, test } from "@playwright/test";

import { seedDeletableGroup } from "./__util__";

test("3. 그룹 삭제 팝업은 취소 버튼에 초기 포커스를 두고 키보드 포커스를 가둔다", async ({ page }) => {
  const { toggle, deleteButton, popup } = await seedDeletableGroup(page);
  await toggle.click();
  const cancelButton = popup.getByRole("button", { name: "Cancel", exact: true });
  await deleteButton.click();
  await expect(cancelButton).toBeFocused();

  for (const key of ["Tab", "Shift+Tab"]) {
    for (let index = 0; index < 3; index += 1) {
      await page.keyboard.press(key);
      expect(await popup.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    }
  }
  await cancelButton.click();
  await expect(deleteButton).toBeFocused();
});
