import { expect, test } from "@playwright/test";

import { readStoredState } from "../__util__";
import { seedDeletableGroup } from "./__util__";

test("2. 그룹 삭제 팝업을 취소하면 모든 경로에서 그룹과 노트·북마크를 유지한다", async ({ page }) => {
  const { toggle, deleteButton, popup } = await seedDeletableGroup(page);
  await toggle.click();

  const assertPreserved = async () => {
    const group = (await readStoredState(page)).groups.find((item) => item.name === "Archive")!;
    expect({ content: group.tabs[0].content, bookmark: group.bookmarks[0].content })
      .toEqual({ content: "archived note", bookmark: "archived note" });
  };

  await deleteButton.click();
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await assertPreserved();
  await deleteButton.click();
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");
  await assertPreserved();
  await deleteButton.click();
  await popup.getByRole("button", { name: "삭제 확인 닫기" }).click();
  await assertPreserved();
  await deleteButton.click();
  await page.mouse.click(4, 4);
  await assertPreserved();
});
