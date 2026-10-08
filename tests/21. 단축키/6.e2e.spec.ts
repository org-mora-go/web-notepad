import { expect, test } from "@playwright/test";

test("6. 왼쪽 패널에 탭이 하나만 남으면 Option+F12 이동을 수행하지 않는다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("only note");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);

  await editor.press("Alt+F12");

  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(page.locator("textarea")).toHaveValue("only note");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem("web-notepad-storage")!).state;
        const group = state.groups.find((entry: { id: string }) => entry.id === state.activeGroupId);
        return { rightTabIds: group.rightTabIds, activePane: group.activePane };
      }),
    )
    .toEqual({ rightTabIds: [], activePane: "left" });
});
