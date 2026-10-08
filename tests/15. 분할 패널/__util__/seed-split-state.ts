import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

// Seeds a split view with "left" and "right" tabs on every load, then opens the app.
export async function seedSplitState(page: Page, splitRatio = 0.5) {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        [
          createTabFixture("left", "left", { title: "Left", tabColor: "gray" }),
          createTabFixture("right", "right", { title: "Right", tabColor: "gray", updatedAt: 2 }),
        ],
        { createdAt: 0, rightTabIds: ["right"], activeRightTabId: "right", splitRatio },
      ),
    ],
  });
}
