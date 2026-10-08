import { expect, test } from "@playwright/test";

test("1. 그룹 패널은 그룹 이름을 대소문자 구분 없이 부분 검색하며 placeholder는 Search groups다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: /Ungrouped/ }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  const items = page.locator(".group-item");
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute("placeholder", "Search groups");
  await expect(items).toHaveCount(2);

  await search.fill("work");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Work");
  await search.fill("OR");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Work");
  await search.fill("ungrouped");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Ungrouped");
  await search.fill("missing");
  await expect(items).toHaveCount(0);
});
