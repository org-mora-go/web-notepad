import { expect, test } from "@playwright/test";

import {
  bookmarkActiveTab,
  bookmarksCommand,
  confirmTabDelete,
  cycleActiveTabColor,
  expectSelectedLines,
  lineButtons,
} from "../__util__";

test("4. 원본 탭이 없으면 내용과 탭 색상 및 선택한 줄을 복원한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  await cycleActiveTabColor(page, 2);
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.locator(".tab-item.is-active .tab-close").click();
  await confirmTabDelete(page);

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "red");
  await expectSelectedLines(page, [false, true, true]);
  await expect(lines.nth(1)).toHaveCSS("background-color", "rgba(242, 139, 130, 0.2)");
});
