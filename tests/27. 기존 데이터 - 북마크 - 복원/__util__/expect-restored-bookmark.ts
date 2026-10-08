import { expect, type Page } from "@playwright/test";

import { activeTabItem, expectSelectedLines } from "../../__util__";

// Asserts the restored "one\ntwo\nthree" bookmark tab's color and per-line selection state.
export async function expectRestoredBookmark(
  page: Page,
  { tabColor, pressedLines }: { tabColor: string; pressedLines: boolean[] },
) {
  await expect(page.locator("textarea")).toHaveValue("one\ntwo\nthree");
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", tabColor);
  await expectSelectedLines(page, pressedLines);
}
