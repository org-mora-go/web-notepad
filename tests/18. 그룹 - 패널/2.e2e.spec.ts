import { expect, test } from "@playwright/test";

import { seedSortableGroups } from "./__util__";

test("2. 그룹 생성·이름 수정 직후와 새로고침 시에도 같은 정렬을 적용한다", async ({ page }) => {
  await seedSortableGroups(page);

  await page.goto("http://localhost:3000");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  const names = page.locator(".group-item .group-select strong");
  await toggle.click();

  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Beta");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(names).toHaveText([
    "Ungrouped",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Beta",
    "Zulu",
  ]);

  await page.getByRole("button", { name: "Zulu 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Zulu 그룹 이름 수정" }).fill("Aardvark");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  const finalOrder = [
    "Ungrouped",
    "가방",
    "나무",
    "다람쥐",
    "Aardvark",
    "Alpha",
    "Beta",
  ];
  await expect(names).toHaveText(finalOrder);

  await page.reload();
  await toggle.click();
  await expect(names).toHaveText(finalOrder);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(names).toHaveText(finalOrder);
});
