import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { seedStoredStateOnLoad } from "../__util__";

test("1. 탭 선택을 URL 이력으로 기록하고 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("tab-1", "First note"),
    createTabFixture("tab-2", "Second note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 3,
  });

  const editor = page.locator("textarea");
  await expect(editor).toHaveValue("First note");
  await page.getByRole("tab", { name: "Second note" }).click();
  await expect(editor).toHaveValue("Second note");
  await expect(new URL(page.url()).searchParams.get("leftTab")).toBe("tab-2");

  await page.goBack();
  await expect(editor).toHaveValue("First note");
  await page.goForward();
  await expect(editor).toHaveValue("Second note");
});