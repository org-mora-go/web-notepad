import { expect, test } from "@playwright/test";

import { dividerDistanceFromCenter } from "../__util__";
import { seedSplitState } from "./__util__";

test("7. 앱 재접속 시 분할 비율을 중앙으로 초기화한다", async ({ page }) => {
  await seedSplitState(page, 0.7);

  await expect.poll(() => dividerDistanceFromCenter(page)).toBeLessThan(10);
});
