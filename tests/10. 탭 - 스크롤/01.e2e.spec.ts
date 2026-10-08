import { expect, test } from "@playwright/test";

import { overflowTabs, scrollTabs } from "./__util__";

test("1. 탭이 가로로 넘칠 때 스크롤 가능한 가장자리에 페이드 효과를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const strip = page.locator(".header").first();
  const scroller = strip.locator(".tabs-scroll");

  await overflowTabs(page);

  await expect(scroller).toHaveClass(/is-overflowing/);
  await scrollTabs(scroller, "start");
  await expect(strip).not.toHaveClass(/has-left-overflow/);
  await expect(strip).toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /48px/);

  await scrollTabs(scroller, "middle");
  await expect(strip).toHaveClass(/has-left-overflow/);
  await expect(strip).toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);

  await scrollTabs(scroller, "end");
  await expect(strip).toHaveClass(/has-left-overflow/);
  await expect(strip).not.toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);
});
