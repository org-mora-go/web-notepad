import { expect, test } from "@playwright/test";

import { seedDeletableGroup } from "./__util__";

test("6. 그룹 삭제 팝업을 취소하면 모든 경로에서 그룹과 노트·북마크를 유지한다", async ({ page }) => {
  const { toggle } = await seedDeletableGroup(page);
  await toggle.click();
  const deleteButton = page.getByRole("button", { name: "Archive 그룹 삭제" });
  const popup = page.getByRole("alertdialog", { name: "Delete group" });

  const assertPreserved = async () => {
    const preserved = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
      const group = state.groups.find((item: { name: string }) => item.name === "Archive");
      return { content: group.tabs[0].content, bookmark: group.bookmarks[0].content };
    });
    expect(preserved).toEqual({ content: "archived note", bookmark: "archived note" });
  };

  await deleteButton.click();
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await assertPreserved();
  await deleteButton.click();
  await page.keyboard.press("Escape");
  await assertPreserved();
  await deleteButton.click();
  await popup.getByRole("button", { name: "삭제 확인 닫기" }).click();
  await assertPreserved();
  await deleteButton.click();
  await page.mouse.click(4, 4);
  await assertPreserved();
});
