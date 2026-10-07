import { expect, test } from "@playwright/test";
import { seedDeletableGroup } from "./__util__";

test("9. 그룹 삭제를 확인하면 그룹의 노트와 북마크를 Ungrouped로 옮긴다", async ({ page }) => {
  const { toggle } = await seedDeletableGroup(page);
  await toggle.click();
  const deleteButton = page.getByRole("button", { name: "Archive 그룹 삭제" });
  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await deleteButton.click();
  await popup.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(page.getByRole("button", { name: "Archive 그룹 삭제" })).toHaveCount(0);
  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("archived note");
  const movedBookmarks = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups[0].bookmarks,
  );
  expect(movedBookmarks).toHaveLength(1);
  expect(movedBookmarks[0].content).toBe("archived note");
});
