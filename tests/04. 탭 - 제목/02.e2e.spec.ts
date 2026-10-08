import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("2. 새 탭과 빈 탭의 제목은 탭 번호 없이 -로 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const titles = page.locator(".tab-item .tab-title");
  const activeTitle = page.locator(".tab-item.is-active .tab-title");
  const editor = page.locator("textarea");
  await expect(activeTitle).toHaveText("-");

  await addTabButton(page).click();
  await expect(titles).toHaveCount(2);
  await expect(titles.nth(0)).toHaveText("-");
  await expect(titles.nth(1)).toHaveText("-");

  await editor.fill("Some note");
  await expect(activeTitle).toHaveText("Some note");
  await editor.fill("");
  await expect(activeTitle).toHaveText("-");
  await editor.fill("   \n  ");
  await expect(activeTitle).toHaveText("-");
});
