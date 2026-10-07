import { expect, test } from "@playwright/test";

test("9. 그룹 목록 항목 사이에 14px 간격을 둔다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Spacing check");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  const groupItems = page.locator("#groups-panel .group-item");
  const firstGroup = await groupItems.nth(0).boundingBox();
  const secondGroup = await groupItems.nth(1).boundingBox();

  expect(firstGroup).not.toBeNull();
  expect(secondGroup).not.toBeNull();
  expect(secondGroup!.y - firstGroup!.y - firstGroup!.height).toBe(14);
});
