import { expect, test } from "@playwright/test";

import { groupStatusName, readStoredState } from "../__util__";
import { seedDeletableGroup } from "./__util__";

test("4. 그룹 삭제를 확인하면 그룹의 노트와 북마크를 Ungrouped로 옮긴다", async ({ page }) => {
  const { toggle, deleteButton, popup } = await seedDeletableGroup(page);
  await toggle.click();
  await deleteButton.click();
  await popup.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(deleteButton).toHaveCount(0);
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("archived note");
  const movedBookmarks = (await readStoredState(page)).groups[0].bookmarks;
  expect(movedBookmarks).toHaveLength(1);
  expect(movedBookmarks[0].content).toBe("archived note");
});
