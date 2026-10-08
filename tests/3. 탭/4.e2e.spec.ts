import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton } from "../__util__";

test("4. 모바일에서 탭을 선택해도 에디터에 자동 포커스하지 않는다", async ({
  browser,
}) => {
  const page = await browser.newPage({
    hasTouch: true,
    isMobile: true,
    viewport: MOBILE_VIEWPORT,
  });
  await page.goto("/");
  await addTabButton(page).click();
  const editor = page.locator("textarea");
  await editor.focus();

  const tabs = page.locator('[role="tab"]');
  await tabs.first().click();

  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(editor).not.toBeFocused();
  await page.close();
});
