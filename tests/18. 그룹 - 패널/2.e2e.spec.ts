import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";
import { seedSortableGroups } from "./__util__";

test("2. 그룹 생성·이름 수정 직후와 새로고침 시에도 같은 정렬을 적용한다", async ({ page }) => {
  await seedSortableGroups(page);
  const toggle = groupsCommand(page);
  const names = page.locator(".group-item .group-select strong");
  await toggle.click();

  await createGroup(page, "Beta");
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
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(names).toHaveText(finalOrder);
});
