import { expect, test } from "@playwright/test";

test("10. 모바일에서 탭을 선택해도 에디터에 자동 포커스하지 않는다", async ({
  browser,
}) => {
  const page = await browser.newPage({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await page.locator("textarea").focus();

  const tabs = page.locator('[role="tab"]');
  await tabs.first().click();

  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("textarea")).not.toBeFocused();
  await page.close();
});
