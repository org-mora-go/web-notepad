import { expect, test } from "@playwright/test";

test("2. Alt+위아래 화살표는 탭 사이를 이동하고 분할 상태에서는 패널 경계를 넘는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Alt+ArrowUp");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

  await page.locator("textarea").first().fill("left note");
  await page.keyboard.press("Alt+ArrowUp");
  await page.locator("textarea").first().fill("first note");
  await page.keyboard.press("Alt+ArrowDown");
  await page.locator("textarea").first().press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);

  const readActive = () =>
    page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
      const group = state.groups.find((entry: { id: string }) => entry.id === state.activeGroupId);
      const activeId = group.activePane === "right" ? group.activeRightTabId : group.activeTabId;
      return {
        pane: group.activePane,
        content: group.tabs.find((tab: { id: string }) => tab.id === activeId).content,
      };
    });

  await expect.poll(readActive).toEqual({ pane: "right", content: "left note" });
  await page.keyboard.press("Alt+ArrowUp");
  await expect.poll(readActive).toEqual({ pane: "left", content: "first note" });
  await page.keyboard.press("Alt+ArrowDown");
  await expect.poll(readActive).toEqual({ pane: "right", content: "left note" });
});
