import { expect, test } from "@playwright/test";

test("8-2. 상태 표시줄에 줄 수와 그룹 및 북마크 수를 표시하고 패널을 연다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo");
  await expect(page.locator(".status-lines")).toHaveText("2 LINES");
  await expect(page.getByRole("button", { name: /Ungrouped/ })).toBeVisible();
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await page.getByRole("button", { name: /Ungrouped/ }).click();
  await expect(page.locator("#groups-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});
