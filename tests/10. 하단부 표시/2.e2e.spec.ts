import { expect, test } from "@playwright/test";

test("2. 상태 표시줄 명령으로 북마크와 그룹 및 단축키 패널을 연다", async ({
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

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.getByRole("button", { name: "단축키 안내" }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});
