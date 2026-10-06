import { expect, test } from "@playwright/test";

test("6. 그룹 삭제 확인창에서 취소하면 데이터를 유지하고 확인하면 삭제한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Archive");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.locator("textarea").fill("archived note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('button[aria-controls="groups-panel"]').click();
  let nativeDialogOpened = false;
  page.on("dialog", async (dialog) => {
    nativeDialogOpened = true;
    await dialog.dismiss();
  });
  const deleteButton = page.getByRole("button", { name: "Archive 그룹 삭제" });
  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await deleteButton.click();
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("Do you want to delete Archive?");
  expect(nativeDialogOpened).toBe(false);
  await expect(popup.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Tab");
    expect(await popup.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Shift+Tab");
    expect(await popup.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  const popupBounds = (await popup.boundingBox())!;
  expect(popupBounds.x).toBeGreaterThanOrEqual(0);
  expect(popupBounds.x + popupBounds.width).toBeLessThanOrEqual(390);
  expect(popupBounds.y).toBeGreaterThanOrEqual(0);
  expect(popupBounds.y + popupBounds.height).toBeLessThanOrEqual(844);
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(deleteButton).toBeFocused();
  const preserved = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
    const group = state.groups.find((item: { name: string }) => item.name === "Archive");
    return { content: group.tabs[0].content, bookmark: group.bookmarks[0].content };
  });
  expect(preserved).toEqual({ content: "archived note", bookmark: "archived note" });

  await deleteButton.click();
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(deleteButton).toBeFocused();
  await deleteButton.click();
  await popup.getByRole("button", { name: "삭제 확인 닫기" }).click();
  await expect(popup).toHaveCount(0);
  await deleteButton.click();
  await expect(popup).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(popup).toHaveCount(0);
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");

  await page.setViewportSize({ width: 1280, height: 800 });
  await deleteButton.click();
  await expect(popup).toContainText("Do you want to delete Archive?");
  await popup.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(popup).toHaveCount(0);
  expect(nativeDialogOpened).toBe(false);
  await expect(page.getByRole("button", { name: "Archive 그룹 삭제" })).toHaveCount(0);
  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("archived note");
  const movedBookmarks = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups[0].bookmarks,
  );
  expect(movedBookmarks).toHaveLength(1);
  expect(movedBookmarks[0].content).toBe("archived note");
});