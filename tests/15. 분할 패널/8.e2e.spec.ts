import { expect, test } from "@playwright/test";

import { dividerDistanceFromCenter, dragDividerBy } from "../__util__";
import { seedSplitState } from "./__util__";

test("8. 오른쪽 패널에 새 탭을 추가하면 분할선을 중앙으로 조정한다", async ({ page }) => {
  await seedSplitState(page);
  const rightPane = page.locator(".pane-slot").nth(1);

  await dragDividerBy(page, 70);
  await expect.poll(() => dividerDistanceFromCenter(page)).toBeGreaterThan(50);

  await rightPane.getByRole("button", { name: "새 탭 추가" }).click();
  await expect(rightPane.getByRole("tab")).toHaveCount(2);
  await expect.poll(() => dividerDistanceFromCenter(page)).toBeLessThan(10);
});
