import { expect, test } from "@playwright/test";

test("5-3. 그룹을 삭제하면 노트와 북마크가 Ungrouped로 이동한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Archive");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.locator("textarea").fill("archived note");
  await page.getByRole("button", { name: /Archive/ }).click();
  await page.getByRole("button", { name: "Archive 그룹 삭제" }).click();
  await expect(page.locator("textarea")).toHaveValue("archived note");
});
