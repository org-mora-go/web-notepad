import { expect, test } from "@playwright/test";

test("6. 그룹 이름 수정은 저장·취소 버튼과 Enter·Escape를 지원하고 그룹 ID, 노트와 북마크를 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await page.locator("textarea").fill("private note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  const originalId = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("web-notepad-storage")!).state.activeGroupId,
  );
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("button", { name: "Work 그룹 수정" }).click();
  const nameInput = page.getByRole("textbox", { name: "Work 그룹 이름 수정" });
  await nameInput.fill(" Focus ");
  await nameInput.press("Enter");
  await expect(page.locator(".group-status-name")).toHaveText("Focus");
  await expect(page.locator("textarea")).toHaveValue("private note");

  await page.getByRole("button", { name: "Focus 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Focus 그룹 이름 수정" }).fill("Cancelled");
  await page.getByRole("button", { name: "그룹 수정 취소" }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Focus");
  await page.getByRole("button", { name: "Focus 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Focus 그룹 이름 수정" }).fill("Escaped");
  await page.getByRole("textbox", { name: "Focus 그룹 이름 수정" }).press("Escape");
  await expect(page.getByRole("textbox", { name: "Focus 그룹 이름 수정" })).toHaveCount(0);
  await expect(page.locator(".group-status-name")).toHaveText("Focus");
  await page.reload();
  await expect(page.locator(".group-status-name")).toHaveText("Focus");
  await expect(page.locator("textarea")).toHaveValue("private note");
  expect(await page.evaluate(() =>
    JSON.parse(localStorage.getItem("web-notepad-storage")!).state.activeGroupId,
  )).toBe(originalId);
  expect(await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
    return state.groups.find((group: { id: string }) => group.id === state.activeGroupId).bookmarks[0].content;
  })).toBe("private note");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("button", { name: "Focus 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Focus 그룹 이름 수정" }).fill("Mobile");
  await expect(page.getByRole("button", { name: "그룹 수정 저장" })).toBeInViewport();
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Mobile");
  await expect(page.locator("textarea")).toHaveValue("private note");
});
