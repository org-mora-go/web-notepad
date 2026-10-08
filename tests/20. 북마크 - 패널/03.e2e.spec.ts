import { expect, test } from "@playwright/test";

import {
  activeTabItem,
  addTabButton,
  bookmarkActiveTab,
  bookmarksCommand,
  cycleActiveTabColor,
  expectSelectedLines,
  lineButtons,
} from "../__util__";

test("3. 원본 탭이 남아 있는 북마크를 열면 해당 탭을 활성화한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmark source");
  await cycleActiveTabColor(page);
  await lineButtons(page).first().click();
  await addTabButton(page).click();
  await page.locator("textarea").fill("other note");

  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("bookmark source");
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "gray");
  await expectSelectedLines(page, [true]);
});
