import { expect, test } from "@playwright/test";

import { addTabButton, readActiveGroup } from "../__util__";

test("2. Alt+위아래 화살표는 탭 사이를 이동하고 분할 상태에서는 패널 경계를 넘는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(1);
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Alt+ArrowUp");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

  const editor = page.locator("textarea").first();
  await editor.fill("left note");
  await page.keyboard.press("Alt+ArrowUp");
  await editor.fill("first note");
  await page.keyboard.press("Alt+ArrowDown");
  await editor.press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);

  const readActive = async () => {
    const group = await readActiveGroup(page);
    const activeId = group.activePane === "right" ? group.activeRightTabId : group.activeTabId;
    return {
      pane: group.activePane,
      content: group.tabs.find((tab) => tab.id === activeId)!.content,
    };
  };

  await expect.poll(readActive).toEqual({ pane: "right", content: "left note" });
  await page.keyboard.press("Alt+ArrowUp");
  await expect.poll(readActive).toEqual({ pane: "left", content: "first note" });
  await page.keyboard.press("Alt+ArrowDown");
  await expect.poll(readActive).toEqual({ pane: "right", content: "left note" });
});
