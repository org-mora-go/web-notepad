import { expect, test } from "@playwright/test";

test("4. 그룹 이름을 대소문자 구분 없이 검색한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: /Ungrouped/ }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  if ((await toggle.getAttribute("aria-expanded")) === "false")
    await toggle.click();
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  await expect(search).toBeVisible();
  await search.fill("work");
  await expect(page.locator(".group-item")).toContainText("Work");
});
