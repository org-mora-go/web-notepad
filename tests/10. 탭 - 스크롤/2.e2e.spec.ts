import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { overflowTabs, scrollTabs } from "./__util__";

test("2. 오버플로우 감지 전후 가로 스크롤바를 숨기고 스크롤과 페이드를 유지한다", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator(".header");
  const scroller = strip.locator(".tabs-scroll");
  await expect(scroller).not.toHaveClass(/is-overflowing/);
  await expect(scroller).toHaveCSS("scrollbar-width", "none");
  await overflowTabs(page);

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(scroller).toHaveClass(/is-overflowing/);
    await expect(scroller).toHaveCSS("scrollbar-width", "none");
    const beforeDetection = await scroller.evaluate((element) => {
      if (!(element instanceof HTMLElement)) throw new Error("Expected an HTML tab scroller");
      element.classList.remove("is-overflowing");
      const result = {
        scrollbarWidth: getComputedStyle(element).scrollbarWidth,
        scrollbarDisplay: getComputedStyle(element, "::-webkit-scrollbar").display,
        verticalSpace: element.offsetHeight - element.clientHeight,
      };
      element.classList.add("is-overflowing");
      return result;
    });
    expect(beforeDetection).toEqual({
      scrollbarWidth: "none",
      scrollbarDisplay: "none",
      verticalSpace: 0,
    });
    await scrollTabs(scroller, "start");
    await expect(strip).toHaveClass(/has-right-overflow/);
    await scrollTabs(scroller, "middle");
    await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await expect(strip).toHaveClass(/has-left-overflow/);
    await expect(strip).toHaveClass(/has-right-overflow/);
    await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);
  }
});
