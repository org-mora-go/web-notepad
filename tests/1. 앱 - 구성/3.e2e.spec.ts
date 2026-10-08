import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { seedStoredStateOnLoad } from "../__util__";

test("3. 저장 상태 복원 전에는 로딩을 거쳐 복원된 편집 화면을 표시한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-restored", "restored after hydration", { title: "Restored" }),
      ]),
    ],
  });
  await expect(page.locator("textarea")).toHaveValue(
    "restored after hydration",
  );
  await expect(page.locator(".loading-screen")).toHaveCount(0);
});
