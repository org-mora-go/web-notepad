import { expect, type Page } from "@playwright/test";

import type { Viewport } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu } from "../../__util__";

// Moves the seeded "Move me" tab to the "Target" group through the PC or mobile tab menu.
export async function moveTabToTarget(page: Page, viewport?: Viewport) {
  await openTabMenu(moveGroupSourceTab(page), viewport);
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await page.getByRole("menuitem", { name: "Target", exact: true }).click();
  await expect(page.getByRole("menu")).toHaveCount(0);
}
