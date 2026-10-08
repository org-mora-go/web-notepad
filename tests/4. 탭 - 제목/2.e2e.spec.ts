import { expect, test } from "@playwright/test";

test("2. 새 탭과 빈 탭의 제목은 탭 번호 없이 -로 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const titles = page.locator(".tab-item .tab-title");
  const activeTitle = page.locator(".tab-item.is-active .tab-title");
  await expect(activeTitle).toHaveText("-");

  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await expect(titles).toHaveCount(2);
  await expect(titles.nth(0)).toHaveText("-");
  await expect(titles.nth(1)).toHaveText("-");

  await page.locator("textarea").fill("Some note");
  await expect(activeTitle).toHaveText("Some note");
  await page.locator("textarea").fill("");
  await expect(activeTitle).toHaveText("-");
  await page.locator("textarea").fill("   \n  ");
  await expect(activeTitle).toHaveText("-");
});
