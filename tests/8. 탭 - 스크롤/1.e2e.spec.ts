import { expect, test } from "@playwright/test";

test("1. 탭이 가로로 넘칠 때 스크롤 가능한 가장자리에 페이드 효과를 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const strip = page.locator(".header").first();
  const scroller = strip.locator(".tabs-scroll");

  for (let index = 0; index < 11; index += 1) {
    await page.locator('button[aria-label="새 탭 추가"]').click();
  }

  await expect(scroller).toHaveClass(/is-overflowing/);
  await scroller.evaluate((element) => {
    element.scrollLeft = 0;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(strip).not.toHaveClass(/has-left-overflow/);
  await expect(strip).toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /48px/);

  await scroller.evaluate((element) => {
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(strip).toHaveClass(/has-left-overflow/);
  await expect(strip).toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);

  await scroller.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(strip).toHaveClass(/has-left-overflow/);
  await expect(strip).not.toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);
});
