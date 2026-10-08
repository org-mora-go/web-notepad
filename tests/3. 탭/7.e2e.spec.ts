import { expect, type Locator, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton } from "../__util__";

test("7. 모바일에서 탭과 탭 조작 버튼의 기본 파란 터치 강조 효과를 숨긴다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  const addButton = addTabButton(page);
  const expectNoTapHighlight = (locator: Locator) =>
    expect(locator).toHaveCSS("-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)");
  await expectNoTapHighlight(addButton);
  await addButton.click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expectNoTapHighlight(addButton);

  const tabItems = page.locator(".tab-item");
  for (let index = 0; index < 2; index += 1) {
    await expectNoTapHighlight(tabItems.nth(index).getByRole("tab"));
  }
  await tabItems.first().getByRole("tab").click();
  await expectNoTapHighlight(tabItems.first().getByRole("tab"));
  await expectNoTapHighlight(tabItems.first().locator(".tab-close"));
});
