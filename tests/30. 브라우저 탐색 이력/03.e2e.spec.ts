import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { seedStoredStateOnLoad } from "../__util__";

test("3. 분할 화면의 활성 pane 전환을 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  const group = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [createTabFixture("left-tab", "Left note"), createTabFixture("right-tab", "Right note")],
    {
      rightTabIds: ["right-tab"],
      activeRightTabId: "right-tab",
      activePane: "left",
    },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 3,
  });

  const panes = page.locator(".note-pane");
  await expect(panes.nth(0)).not.toHaveClass(/is-unfocused/);
  await page.locator(".pane-slot").nth(1).locator("textarea").click();
  await expect(page.locator(".note-pane").nth(1)).not.toHaveClass(/is-unfocused/);
  await expect(new URL(page.url()).searchParams.get("pane")).toBe("right");

  await page.goBack();
  await expect(page.locator(".note-pane").nth(0)).not.toHaveClass(/is-unfocused/);
  await page.goForward();
  await expect(page.locator(".note-pane").nth(1)).not.toHaveClass(/is-unfocused/);
});