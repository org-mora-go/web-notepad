import { expect, test } from "@playwright/test";

test("2. 우측 명령으로 북마크와 그룹 패널을 연다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");

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
  await page.getByRole("button", { name: "그룹 닫기" }).click();
});
