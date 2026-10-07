import { expect, test } from "@playwright/test";

test("9. 오버플로우 감지 전후 가로 스크롤바를 숨기고 스크롤과 페이드를 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const strip = page.locator(".header");
  const scroller = strip.locator(".tabs-scroll");
  await expect(scroller).not.toHaveClass(/is-overflowing/);
  await expect(scroller).toHaveCSS("scrollbar-width", "none");
  for (let index = 0; index < 11; index += 1) {
    await page.getByRole("button", { name: "새 탭 추가" }).click();
  }

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
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
    await scroller.evaluate((element) => {
      element.scrollLeft = 0;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect(strip).toHaveClass(/has-right-overflow/);
    await scroller.evaluate((element) => {
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await expect(strip).toHaveClass(/has-left-overflow/);
    await expect(strip).toHaveClass(/has-right-overflow/);
    await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);
  }
});