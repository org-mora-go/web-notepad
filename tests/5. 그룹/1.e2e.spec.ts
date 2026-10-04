import { expect, test } from "@playwright/test";

test("1. Ungrouped 외에 이름 있는 그룹을 만들고 전환할 수 있다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill(" Work ");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(page.getByRole("button", { name: /Work \(2\)/ })).toBeVisible();
  await page.getByRole("button", { name: /Work \(2\)/ }).click();
  await expect(page.locator("textarea")).toHaveValue("");
});
