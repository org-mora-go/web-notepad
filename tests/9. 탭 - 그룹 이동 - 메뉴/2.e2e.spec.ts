import { expect, test } from "@playwright/test";

import { seedMoveGroupState } from "../__util__";

test("2. 다른 그룹이 없으면 Move Group을 비활성화한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page, { withTarget: false });
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await expect(page.getByRole("menuitem", { name: "Move Group", exact: true })).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
  }
});
