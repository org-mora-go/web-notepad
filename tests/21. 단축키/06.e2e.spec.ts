import { expect, test } from "@playwright/test";

import { readActiveGroup } from "../__util__";

test("6. 왼쪽 패널에 탭이 하나만 남으면 Option+F12 이동을 수행하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("only note");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);

  await editor.press("Alt+F12");

  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(editor).toHaveValue("only note");
  await expect
    .poll(async () => {
      const { rightTabIds, activePane } = await readActiveGroup(page);
      return { rightTabIds, activePane };
    })
    .toEqual({ rightTabIds: [], activePane: "left" });
});
