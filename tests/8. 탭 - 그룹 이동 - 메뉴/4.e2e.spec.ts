import { expect, test } from "@playwright/test";

import { seedMoveGroupState } from "../__util__";

test("4. 메뉴와 그룹 목록을 화면 안에 배치하고 긴 그룹 이름은 말줄임·툴팁으로 표시한다", async ({ page }) => {
  const longName = "Very long target group name that should be truncated in the menu";
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page);
    await page.evaluate((name) => {
      const stored = JSON.parse(localStorage.getItem("web-notepad-storage")!);
      stored.state.groups[1].name = name;
      localStorage.setItem("web-notepad-storage", JSON.stringify(stored));
    }, longName);
    await page.reload();
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();

    const isInViewport = async (box: { x: number; y: number; width: number; height: number } | null) => {
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(8);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(836);
    };
    await isInViewport(await page.getByRole("menu", { name: "Tab actions", exact: true }).boundingBox());
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    const menu = page.getByRole("menu", { name: "Move Group", exact: true });
    await isInViewport(await menu.boundingBox());

    const option = menu.getByRole("menuitem", { name: longName, exact: true });
    await expect(option).toHaveAttribute("title", longName);
    const truncated = await option.evaluate((element) => {
      const target = Array.from(element.querySelectorAll<HTMLElement>("*"))
        .concat(element as HTMLElement)
        .find((node) => getComputedStyle(node).textOverflow === "ellipsis");
      return target ? target.scrollWidth > target.clientWidth : false;
    });
    expect(truncated).toBe(true);
    await expect(menu.locator(".move-group-option svg")).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Back to tab actions" }).locator("svg")).toHaveCount(1);
  }
});
